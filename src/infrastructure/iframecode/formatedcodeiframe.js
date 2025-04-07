document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* -------------------------------------------------------------------------
   * Global Variables
   * ------------------------------------------------------------------------- */
  let API_BASE_URL = "https://api.gravitywrite.com/api";
  let stagging_url = "https://dev.gravitywrite.com/api";
  let currentIndex = 0;
  let isFetching = false; // Used in stream content
  let isFetchingPageSelectors = false;
  let isFetchingImageSelectors = false;
  let isFetchingNqImageSelectors = false;
  let oldNewContent = {}; // To store old and new content per selector
  let imageUrlData = {}; // To store mapping of old/new image URLs

  let apiResponseData = [];

  let stylePrompt = "";

  /* -------------------------------------------------------------------------
   * STEP 1: Utility Functions for Background Image Extraction
   * ------------------------------------------------------------------------- */

  /**
   * Extracts the URL from a CSS background-image string.
   * @param {string} backgroundImage - The background-image CSS value.
   * @returns {string|null} - The extracted URL or null if extraction fails.
   */
  function extractBackgroundImageUrl(backgroundImage) {
    console.log("[extractBackgroundImageUrl] Called with:", backgroundImage);
    if (
      typeof backgroundImage === "string" &&
      backgroundImage.trim() !== "none"
    ) {
      let extractedUrl = backgroundImage.replace(
        /url\(["']?(.*?)["']?\)/,
        "$1"
      );
      extractedUrl = extractedUrl.replace(/^["'()]+|["'()]+$/g, "");
      if (extractedUrl && extractedUrl !== backgroundImage) {
        console.log(
          "[extractBackgroundImageUrl] Final Cleaned URL:",
          extractedUrl
        );
        return extractedUrl;
      } else {
        console.log(
          "[extractBackgroundImageUrl] No valid URL extracted from:",
          backgroundImage
        );
      }
    } else {
      console.log(
        "[extractBackgroundImageUrl] Invalid backgroundImage value:",
        backgroundImage
      );
    }
    return null;
  }

  /**
   * Fetches trimmed text content from the element identified by the selector.
   * @param {string} selectorId - The CSS selector for the element.
   * @returns {string} - The trimmed text content or an empty string if not found.
   */
  function fetchTextFromSelector(selectorId) {
    const element = document.querySelector(selectorId);
    if (!element) {
      console.error(`Element not found for selector: ${selectorId}`);
      return "";
    }
    return element.textContent.trim() || "";
  }

  /**
   * Scans all accessible stylesheets for a rule containing the given class selector
   * and returns the background image URL.
   * @param {string} classSelector - The class selector (e.g., ".elementor-element-...").
   * @returns {string|null} - The extracted URL or null if not found.
   */
  function getBackgroundImageFromClass(classSelector) {
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;
        for (const rule of rules) {
          if (rule.selectorText && rule.selectorText.includes(classSelector)) {
            const backgroundImage = rule.style.backgroundImage;
            if (backgroundImage && backgroundImage !== "none") {
              const url = extractBackgroundImageUrl(backgroundImage);
              if (url) {
                return url;
              } else {
                console.log(
                  "[getBackgroundImageFromClass] Failed to extract URL from:",
                  backgroundImage
                );
              }
            }
          }
        }
      } catch (e) {
        console.log(
          "[getBackgroundImageFromClass] Error accessing stylesheet:",
          e
        );
      }
    }
    console.log(
      "[getBackgroundImageFromClass] No CSS rule found for",
      classSelector
    );
    return null;
  }

  /**
   * Retrieves the background image URL from an element.
   * It first checks class-based rules, then inline style, and finally the computed style.
   * @param {string} selector - The CSS selector for the element.
   * @returns {string|null} - The background image URL or null if not found.
   */
  function getBackgroundImageFromElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.log(
        "[getBackgroundImageFromElement] Element not found for selector:",
        selector
      );
      return null;
    }

    // Check each class that starts with "elementor-element-"
    for (const className of element.classList) {
      if (className.startsWith("elementor-element-")) {
        const classSelector = `.${className}`;
        const url = getBackgroundImageFromClass(classSelector);
        if (url) {
          return url;
        } else {
          console.log(
            "[getBackgroundImageFromElement] No URL found for class",
            className
          );
        }
      }
    }

    // Fallback: Check inline style
    const inlineBackgroundImage = element.style.backgroundImage;
    console.log(
      "[getBackgroundImageFromElement] Inline background image:",
      inlineBackgroundImage
    );
    if (inlineBackgroundImage && inlineBackgroundImage !== "none") {
      const url = extractBackgroundImageUrl(inlineBackgroundImage);
      if (url) {
        console.log("[getBackgroundImageFromElement] Found inline URL:", url);
        return url;
      }
    }

    // Fallback: Check computed style
    const computedBackgroundImage = getComputedStyle(element).backgroundImage;
    console.log(
      "[getBackgroundImageFromElement] Computed background image:",
      computedBackgroundImage
    );
    if (computedBackgroundImage && computedBackgroundImage !== "none") {
      const url = extractBackgroundImageUrl(computedBackgroundImage);
      if (url) {
        console.log("[getBackgroundImageFromElement] Found computed URL:", url);
        return url;
      }
    }

    console.log(
      "[getBackgroundImageFromElement] No background image found for element",
      selector
    );
    return null;
  }

  /**
   * Get the current background image URL of the :before pseudo-element.
   * @param {string} selector - The CSS selector of the element with the :before pseudo-element.
   * @returns {string|null} - The current background image URL or null if not found.
   */
  function getBeforePseudoElementBackground(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.log(`Element not found for selector: ${selector}`);
      return null;
    }

    const computedStyle = window.getComputedStyle(element, "::before");
    const backgroundImage = computedStyle.getPropertyValue("background-image");

    if (backgroundImage && backgroundImage !== "none") {
      // Extract the URL from the background-image value
      const url = extractBackgroundImageUrl(backgroundImage);
      return url;
    }

    return null;
  }

  /**
   * Updates the background image of the :before pseudo-element.
   * @param {string} selector - The CSS selector of the element with the :before pseudo-element.
   * @param {string} newImageUrl - The new background image URL.
   */
  function updateBeforePseudoElementBackground(selector, newImageUrl) {
    const element = document.querySelector(selector);
    if (!element) {
      console.log(`Element not found for selector: ${selector}`);
      return;
    }

    // Inject the new background image for the :before pseudo-element
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
      `${selector}::before { background-image: url(${newImageUrl}) !important; }`,
      styleSheet.cssRules.length
    );
  }

  // Example usage:
  // Get the current background image URL
  const currentBackgroundImage =
    getBeforePseudoElementBackground(".some-class");
  console.log("Current background image URL:", currentBackgroundImage);

  // Now change the background image
  if (currentBackgroundImage) {
    updateBeforePseudoElementBackground(
      ".some-class",
      "https://example.com/new-image.jpg"
    );
  }
  /* -------------------------------------------------------------------------
   * STEP 2: Functions for API Calls and Content Streaming
   * ------------------------------------------------------------------------- */

  /**
   * Retrieves selectors for various elements.
   * @returns {Object} - An object containing arrays: gwSelectors, nqElements, and imageElements.
   */
  function getAllGWSelectors() {
    const gwElements = document.querySelectorAll("[id^='gw']");
    const gwSelectors = Array.from(gwElements).map(
      (element) => `#${element.id}`
    );
    const nqElements = Array.from(document.querySelectorAll("[id^='py']")).map(
      (el) => `#${el.id}`
    );
    const imageElements = Array.from(
      document.querySelectorAll("[id^='px']")
    ).map((el) => `#${el.id}`);

    console.log(
      "GW Selectors:",
      gwSelectors,
      "NQ Elements:",
      nqElements,
      "Image Elements:",
      imageElements
    );
    return { gwSelectors, nqElements, imageElements };
  }

  /**
   * Fetches page selectors from the API and prepares the content.
   * @param {Array} gwSelectors - Array of selectors.
   * @param {string} bearer_token - Authorization token.
   * @param {string} template_id - Template identifier.
   * @param {boolean} stagging - Flag for staging environment.
   * @returns {Promise<Array>} - Resolves to an array of processed selectors.
   */
  async function fetchPageSelectors(
    gwSelectors,
    bearer_token,
    template_id,
    stagging
  ) {
    if (isFetchingPageSelectors) return [];
    isFetchingPageSelectors = true;

    if (stagging) {
      API_BASE_URL = stagging_url;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/builder/getPageSelector`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer_token}`,
          },
          body: JSON.stringify({ selectors: gwSelectors, template_id }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      data.forEach((item) => {
        const element = document.querySelector(item.id);
        if (element) {
          const oldContent = element.textContent || "";
          oldNewContent[item.id] = { old: oldContent, new: "" };

          if (item.custom_selector) {
            element.textContent = "";
          } else {
            const targetNode =
              element.children[0]?.children[1] ||
              element.children[0]?.children[0];
            if (targetNode) {
              targetNode.textContent = "";
            } else {
              element.textContent = "";
            }
          }
        }
      });
      return data;
    } catch (error) {
      console.error("Error fetching page selectors:", error);
      return [];
    } finally {
      isFetchingPageSelectors = false;
    }
  }

  /**
   * Fetches image selectors from the API.
   * @param {Array} imageElements - Array of image selectors.
   * @param {string} bearer_token - Authorization token.
   * @param {string} template_id - Template identifier.
   * @param {boolean} stagging - Flag for staging environment.
   * @returns {Promise<Object>} - Resolves to image selector data.
   */
  async function fetchImageSelector(
    imageElements,
    bearer_token,
    template_id,
    stagging
  ) {
    if (isFetchingImageSelectors) return [];
    isFetchingImageSelectors = true;

    if (stagging) {
      API_BASE_URL = stagging_url;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/get-image-selector`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer_token}`,
        },
        body: JSON.stringify({ selectors: imageElements, template_id }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching image selectors:", error);
      return [];
    } finally {
      isFetchingImageSelectors = false;
    }
  }

  /**
   * Fetches NQ image selectors from the API.
   * @param {Array} nqElements - Array of NQ selectors.
   * @param {string} bearer_token - Authorization token.
   * @param {string} template_id - Template identifier.
   * @param {boolean} stagging - Flag for staging environment.
   * @returns {Promise<Object>} - Resolves to NQ image selector data.
   */
  async function fetchNqImageSelector(
    nqElements,
    bearer_token,
    template_id,
    stagging
  ) {
    if (isFetchingNqImageSelectors) return [];
    isFetchingNqImageSelectors = true;

    if (stagging) {
      API_BASE_URL = stagging_url;
    }

    if (!nqElements || nqElements.length === 0) {
      console.log("No nqElements provided");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/get-nqimage-selector`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer_token}`,
        },
        body: JSON.stringify({ selectors: nqElements, template_id }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("data.data", data.data);
      data.data.forEach((item) => {
        if (item.isbackground) {
          let actualBackgroundImage = getBeforePseudoElementBackground(
            item.selector
          );
          // If no :before background exists, fallback to the element's own background.
          if (!actualBackgroundImage) {
            actualBackgroundImage = getBackgroundImageFromElement(
              item.selector
            );
            console.log(
              "console from !actualBackgroundImage",
              actualBackgroundImage
            );
          }
          if (actualBackgroundImage) {
            imageUrlData[item.selector] = { [actualBackgroundImage]: "" };
            console.log(
              "console from actualBackgroundImage",
              actualBackgroundImage
            );
          }

          if (actualBackgroundImage) {
            imageUrlData[item.selector] = { [actualBackgroundImage]: "" };
          }
        } else {
          // Non-background image handling (currently commented out)
          // const itemSelector = document.querySelector(item.selector);
          // const oldimage = itemSelector.src;
          // imageUrlData[item.selector] = { [oldimage]: "" };
          // itemSelector.src = "https://plugin.mywpsite.org/loader-gif-final.gif";
          // itemSelector.srcset = "https://plugin.mywpsite.org/loader-gif-final.gif";
        }
      });

      setTimeout(() => {
        console.log("Generated JSON with old image URLs:", imageUrlData);
      }, 2000);
      return data;
    } catch (error) {
      console.error("Error fetching NQ image selectors:", error);
      return [];
    } finally {
      isFetchingNqImageSelectors = false;
    }
  }

  /**
   * Handles image generation for NQ image selectors.
   * @param {string} bearer_token - Authorization token.
   * @param {Array} nqImageSelectorResult - Array of NQ image selector items.
   * @param {Object} eventData - Event data containing necessary details.
   */
  function handleNqImageGeneration(
    bearer_token,
    nqImageSelectorResult,
    eventData
  ) {
    if (Array.isArray(nqImageSelectorResult)) {
      nqImageSelectorResult.forEach((item) => {
        const { selector, isbackground } = item;
        console.log(`Generating image for selector: ${selector}`);

        const payload = {
          selector: selector.split(">")[0].trim(),
          content: {},
          business_name: eventData.bussinessname || "",
          template_name: eventData.templateName,
          services_provided: eventData.description,
          customer_steps: eventData?.stepdescription,
          website_category: eventData.category || "",
          page_name: eventData.pageName,
          template_id: eventData.template_id,
          style_prompt: stylePrompt,
        };

        const element = document.querySelector(selector);
        const loaderGifUrl = "https://plugin.mywpsite.org/Dots-Loader.gif";
        let oldImageUrl = "";

        if (element) {
          if (isbackground) {
            // Check if there's a :before pseudo-element background image.
            const beforeImage = getBeforePseudoElementBackground(selector);
            if (beforeImage) {
              oldImageUrl = beforeImage;
              // Set loader image for the pseudo-element.
              updateBeforePseudoElementBackground(selector, loaderGifUrl);
            } else {
              // Fallback to the element's own background image.
              oldImageUrl = getBackgroundImageFromElement(selector) || "";
              element.style.backgroundImage = `url(${loaderGifUrl})`;
            }
          } else {
            oldImageUrl = element.src;
            element.src = loaderGifUrl;
            element.srcset = loaderGifUrl;
          }
        }

        fetch(`${API_BASE_URL}/get-image-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer_token}`,
          },
          body: JSON.stringify(payload),
        })
          .then((response) => {
            console.log(
              `API response status for ${selector}:`,
              response.status
            );
            return response.json();
          })
          .then((data) => {
            console.log("Generated image response for", selector, data);
            if (data && data.data && data.data.image_urls) {
              const newImageUrl = data.data.image_urls[0];
              if (element) {
                if (isbackground) {
                  // Check if pseudo-element exists again for updating.
                  const beforeImage =
                    getBeforePseudoElementBackground(selector);
                  if (beforeImage) {
                    updateBeforePseudoElementBackground(selector, newImageUrl);
                  } else {
                    element.style.backgroundImage = `url(${newImageUrl})`;
                  }
                } else {
                  element.src = newImageUrl;
                  element.srcset = newImageUrl;
                }
                imageUrlData[item.selector] = { [oldImageUrl]: newImageUrl };
              }
            } else {
              console.error(
                `No valid image URL returned for selector: ${selector}`,
                data
              );
            }
          })
          .catch((error) => {
            console.error("Error generating NQ image for", selector, error);
          });
      });
    } else {
      console.error(
        "nqImageSelectorResult is not an array:",
        nqImageSelectorResult,
        "please check if backend structure has changed"
      );
    }
  }

  /**
   * Handles image generation for page selectors.
   * @param {string} bearer_token - Authorization token.
   * @param {Object} eventData - Event data containing necessary details.
   * @param {object} cleanedContent - oldnew content of text
   */
  function handleImageGeneration(bearer_token, eventData, cleanedContent) {
    const totalItems = apiResponseData.data.length;
    let completedCount = 0;
    const pageName = eventData.page_name;
    const loaderGifUrl = "https://plugin.mywpsite.org/Dots-Loader.gif";

    apiResponseData.data.forEach((item) => {
      const contentPayload = {};
      if (item.content && item.content.length > 0) {
        item.content.forEach((contentItem) => {
          contentPayload[contentItem.title] = fetchTextFromSelector(
            contentItem.selectorid
          );
        });
      }

      const payload = {
        selector: item.selector.split(">")[0].trim(),
        content: contentPayload,
        business_name: eventData.business_name || "",
        template_name: eventData.template_name,
        services_provided: eventData.services_provided,
        customer_steps: eventData?.customer_steps,
        website_category: eventData.website_category || "",
        page_name: eventData.page_name,
        template_id: eventData.template_id,
        style_prompt: stylePrompt,
      };

      const element = document.querySelector(item.selector);
      let oldImageUrl = "";
      if (element) {
        // Check if we've already stored the original URL in our mapping.
        if (
          imageUrlData[item.selector] &&
          Object.keys(imageUrlData[item.selector]).length
        ) {
          oldImageUrl = Object.keys(imageUrlData[item.selector])[0];
        } else {
          if (item.isbackgroundimage) {
            oldImageUrl = getBackgroundImageFromElement(item.selector) || "";
            element.style.backgroundImage = `url(${loaderGifUrl})`;
          } else {
            oldImageUrl = element.src;
            element.src = loaderGifUrl;
            element.srcset = loaderGifUrl;
          }
        }
      }

      fetch(`${API_BASE_URL}/get-image-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer_token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          console.log(
            `API response status for ${item.selector}:`,
            response.status
          );
          return response.json();
        })
        .then((data) => {
          console.log("Generated image response for", item.selector, data);
          if (data && data.data && data.data.image_urls) {
            const newImageUrl = data.data.image_urls[0];
            if (element) {
              if (item.isbackgroundimage) {
                element.style.backgroundImage = `url(${newImageUrl})`;
              } else {
                element.src = newImageUrl;
                element.srcset = newImageUrl;
              }
              // Update the mapping: the key is the old URL, and the value is the new URL.
              imageUrlData[item.selector] = { [oldImageUrl]: newImageUrl };
            }
          } else {
            console.error(
              `No valid image URL returned for selector: ${item.selector}`,
              data
            );
          }
        })
        .catch((error) => {
          console.error("Error generating image for", item.selector, error);
        })
        .finally(() => {
          completedCount++;
          if (completedCount === totalItems) {
            console.log("oldnewcontent from finally block", cleanedContent);
            window.parent.postMessage(
              {
                type: "oldNewContent",
                pageName: window.location.pathname.split("/").pop(),
                content: cleanedContent,
              },
              "*"
            );

            const pageContent = document.documentElement.outerHTML;
            window.parent.postMessage(
              {
                type: "generatedContent",
                pageName: pageName,
                content: pageContent,
                isGenerating: false,
              },
              "*"
            );
            window.parent.postMessage(
              {
                type: "oldNewImages",
                pageName: pageName,
                images: imageUrlData,
                isGenerating: false,
              },
              "*"
            );

            window.parent.postMessage(
              { type: "generationStatus", isGenerating: false },
              "*"
            );
          }
        });
    });
  }

  /**
   * Fetches streaming content from the API and processes the stream.
   * @param {Object} payload - Request payload.
   * @param {Array} processedSelectors - Array of processed selectors.
   */
  async function fetchStreamContent(payload, processedSelectors) {
    if (isFetching) return;
    isFetching = true;

    const { bearer_token, stagging } = payload;
    const eventData = payload;
    if (stagging) {
      API_BASE_URL = stagging_url;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ai/builder/streamcontent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const reader = response.body.getReader();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder("utf-8").decode(value, { stream: true });
        let endIndex;
        while ((endIndex = result.indexOf("~")) !== -1) {
          if (currentIndex >= processedSelectors.length) {
            console.error(
              "Error: Extra content in stream with no available selectors."
            );
            return;
          }
          const completeData = result.substring(0, endIndex);
          const selectorData = processedSelectors[currentIndex];
          window.parent.postMessage(
            { type: "generationStatus", isGenerating: true },
            "*"
          );
          await typeEffect(selectorData, completeData);
          scrollToElement(selectorData.id);
          currentIndex++;
          result = result.substring(endIndex + 1);
        }
      }

      if (
        currentIndex < processedSelectors.length &&
        result.trim().length > 0
      ) {
        const selectorData = processedSelectors[currentIndex];
        await typeEffect(selectorData, result);
        scrollToElement(selectorData.id);
        currentIndex++;
      }

      // Clean up and update content for each selector
      const cleanContent = (content) => content.trim();
      processedSelectors.forEach((item) => {
        const element = document.querySelector(item.id);
        if (element) {
          const targetNode = item.custom_selector
            ? element
            : element.children[0]?.children[1] ||
              element.children[0]?.children[0];
          if (targetNode && targetNode.nodeName.toLowerCase() !== "style") {
            let newContent = cleanContent(targetNode.textContent || "");
            oldNewContent[item.id].new = newContent;
          }
        }
      });

      const cleanedContent = {};
      Object.keys(oldNewContent).forEach((id) => {
        const oldContent = cleanContent(oldNewContent[id].old);
        const newContent = cleanContent(oldNewContent[id].new);
        if (oldContent !== "" || newContent !== "") {
          cleanedContent[oldContent] = newContent;
        }
      });

      handleImageGeneration(bearer_token, eventData, cleanedContent);
    } catch (error) {
      console.error("Streaming data error:", error.message);
      window.parent.postMessage(
        { type: "streamingError", showError: true },
        "*"
      );
    } finally {
      isFetching = false;
      // window.parent.postMessage(
      //   { type: "generationStatus", isGenerating: false },
      //   "*"
      // );
    }
  }

  /**
   * Simulates a typing effect for updating text content.
   * @param {Object} selectorData - Object containing the selector and custom flag.
   * @param {string} content - The content to display.
   */
  async function typeEffect(selectorData, content) {
    const element = document.querySelector(selectorData.id);
    if (!element) return;
    const targetNode = selectorData.custom_selector
      ? element
      : element.children[0]?.children[1] || element.children[0]?.children[0];
    if (!targetNode) return;
    let textNode = targetNode.childNodes[0];
    if (textNode) {
      textNode.nodeValue = "";
      for (let i = 0; i < content.length; i++) {
        textNode.nodeValue += content.charAt(i);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } else {
      textNode = document.createTextNode("");
      targetNode.appendChild(textNode);
      for (let i = 0; i < content.length; i++) {
        textNode.nodeValue += content.charAt(i);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  /**
   * Scrolls the view to the element specified by the selector.
   * @param {string} selector - The CSS selector of the target element.
   */
  function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  /* -------------------------------------------------------------------------
   * STEP 3: Listen for Messages and Trigger API Calls
   * ------------------------------------------------------------------------- */

  window.addEventListener("message", (event) => {
    if (event.data.type === "start") {
      currentIndex = 0;
      oldNewContent = {};
      const bearer_token = event.data.bearer_token;
      const template_id = event.data.template_id;
      const stagging = event.data.stagging;
      const { gwSelectors, nqElements, imageElements } = getAllGWSelectors();

      // Immediately apply loader to each image element

      let payload = {
        primary_color: event.data.primaryColor,
        secondary_color: event.data.secondaryColor,
        business_name: event.data.bussinessname,
        business_description: event.data.description,
      };

      if (stagging) {
        API_BASE_URL = stagging_url;
      }

      // First, call the style-prompt API
      fetch(`${API_BASE_URL}/ai/builder/style-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer_token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          stylePrompt = data.data.prompt;
          console.log("style prompt is:", stylePrompt);

          fetchPageSelectors(gwSelectors, bearer_token, template_id, stagging)
            .then((processedSelectors) => {
              fetchStreamContent(
                {
                  business_name: event.data.bussinessname || "",
                  template_name: event.data.templateName,
                  services_provided: event.data.description,
                  customer_steps: event.data?.stepdescription,
                  website_category: event.data.category || "",
                  page_name: event.data.pageName,
                  selectors: gwSelectors,
                  template_id,
                  bearer_token,
                  stagging,
                },
                processedSelectors
              );
            })
            .catch((error) => {
              console.error("Error in fetchPageSelectors:", error);
            });

          fetchImageSelector(imageElements, bearer_token, template_id, stagging)
            .then((imageSelectorResult) => {
              handleImageSelectorResponse(imageSelectorResult);
            })
            .catch((error) => {
              console.error("Error in fetchImageSelector:", error);
            });

          fetchNqImageSelector(nqElements, bearer_token, template_id, stagging)
            .then((nqImageSelectorResult) => {
              handleNqImageGeneration(
                bearer_token,
                nqImageSelectorResult.data,
                event.data
              );
            })
            .catch((error) => {
              console.error("Error in fetching NQ image selectors:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching style prompt:", error);
        });
    }
  });

  /**
   * Handles the response from the image selector API.
   * @param {Object} data - The API response data.
   */
  function handleImageSelectorResponse(data) {
    console.log("Image Selector API Response:", data);
    apiResponseData = data;

    const loaderGifUrl = "https://plugin.mywpsite.org/Dots-Loader.gif";
    apiResponseData.data.forEach((selectorDetails) => {
      const selector = selectorDetails.selector;
      const element = document.querySelector(selector);
      console.log("changing the loop for ", selector);
      if (!selector.isbackgroundimage) {
        if (element.tagName.toLowerCase() === "img") {
          if (!imageUrlData[selector]) {
            imageUrlData[selector] = { [element.src]: "" };
          }
          element.src = loaderGifUrl;
          element.srcset = loaderGifUrl;
        } else {
          const originalUrl = getBackgroundImageFromElement(selector);
          if (!imageUrlData[selector]) {
            imageUrlData[selector] = { [originalUrl]: "" };
          }
          element.style.backgroundImage = `url(${loaderGifUrl})`;
        }
      }
    });
    // Add any custom logic here if needed.
  }

  /* -------------------------------------------------------------------------
   * STEP 4: Other Functionalities (Logo Updates, Scrolling, CSS Variables, etc.)
   * ------------------------------------------------------------------------- */

  // Listen for messages related to logo updates and non-clickable content.
  window.addEventListener("message", (event) => {
    if (event.data.type === "nonClickable") {
      const bodyContent = event.data.transdiv;
      document.body.insertAdjacentHTML("beforeend", bodyContent);
    }
    if (event.data.type === "businessName") {
      console.log("businessName event triggered");
      const businessName = event.data.text;
      const darkTheme = event.data.dark_theme ?? 0;
      updateLogoText("#template-logo", businessName, darkTheme);
      updateLogoText("#footer-logo", businessName, darkTheme);
      removeLogoAndAddBusinessName("#template-logo", businessName);
      removeLogoAndAddBusinessName("#footer-logo", businessName);
    }
    if (event.data.type === "changeLogo") {
      const logoUrl = event.data.logoUrl;
      console.log("changeLogo event triggered");
      if (logoUrl && logoUrl.trim()) {
        logoUpdated = true;
        updateLogoImage("#template-logo", logoUrl);
        updateLogoImage("#footer-logo", logoUrl);
      } else {
        removeLogoAndAddBusinessName("#template-logo", event.data.businessName);
        removeLogoAndAddBusinessName("#footer-logo", event.data.businessName);
      }
    }
  });

  /**
   * Updates the logo text within a container.
   * @param {string} containerSelector - CSS selector for the container.
   * @param {string} businessName - The business name to display.
   * @param {number} darkTheme - Flag indicating dark theme (1 for dark).
   */
  function updateLogoText(containerSelector, businessName, darkTheme) {
    const parentElement = document.querySelector(containerSelector);
    if (!parentElement) return;
    const logoElement = parentElement.querySelector("img:last-of-type");
    const existingText = parentElement.querySelector("#logo-text");
    if (existingText) existingText.remove();
    if (logoElement) {
      logoElement.src = "";
      logoElement.alt = "";
      logoElement.style.display = "none";
    }
    const spanElement = document.createElement("span");
    spanElement.id = "logo-text";
    spanElement.textContent = businessName;
    spanElement.style.fontSize = "22px";
    spanElement.style.fontWeight = "bold";
    spanElement.style.textAlign = "center";
    spanElement.style.color = darkTheme === 1 ? "#fff" : "#000000";
    const logoContainer = parentElement.querySelector(
      "div > div > a > div > div"
    );
    if (logoContainer) {
      logoContainer.appendChild(spanElement);
    } else {
      console.warn(`Logo container not found in ${containerSelector}.`);
    }
  }

  /**
   * Updates the logo image within a container.
   * @param {string} containerSelector - CSS selector for the container.
   * @param {string} logoUrl - The URL of the new logo image.
   */
  function updateLogoImage(containerSelector, logoUrl) {
    const parentElement = document.querySelector(containerSelector);
    if (!parentElement) return;
    const existingText = parentElement.querySelector("#logo-text");
    if (existingText) existingText.remove();
    const logoElement = parentElement.querySelector("img:last-of-type");
    if (logoElement) {
      logoElement.src = logoUrl;
      logoElement.srcset = `${logoUrl} 1x, ${logoUrl} 2x`;
      logoElement.sizes = "(max-width: 319px) 100vw, 319px";
      logoElement.style.display = "block";
      logoElement.alt = "Uploaded Logo";
    } else {
      console.warn(`Logo element not found in ${containerSelector}.`);
    }
  }

  /**
   * Removes the logo and replaces it with the business name text.
   * @param {string} containerSelector - CSS selector for the container.
   * @param {string} businessName - The business name to display.
   */
  function removeLogoAndAddBusinessName(containerSelector, businessName) {
    const parentElement = document.querySelector(containerSelector);
    if (!parentElement) {
      console.error("Logo element not found for", containerSelector);
      return;
    }
    const logoElement = parentElement.querySelector("img:last-of-type");
    if (logoElement) {
      logoElement.style.display = "none";
    }
    const existingText = parentElement.querySelector("#logo-text");
    if (existingText) existingText.remove();
    const spanElement = document.createElement("span");
    spanElement.id = "logo-text";
    spanElement.textContent = businessName;
    spanElement.style.fontSize = "22px";
    spanElement.style.fontWeight = "bold";
    spanElement.style.textAlign = "center";
    spanElement.style.color = "#000000";
    const logoContainer = parentElement.querySelector(
      "div > div > a > div > div"
    );
    if (logoContainer) {
      logoContainer.appendChild(spanElement);
    } else {
      console.warn(`Logo container not found in ${containerSelector}.`);
    }
  }

  // Listen for messages to change logo size and global colors.
  window.addEventListener("message", (event) => {
    if (event.data.type === "changeLogoSize") {
      const headerLogoElement = document.querySelector("#template-logo img");
      const footerLogoElement = document.querySelector("#footer-logo img");
      if (headerLogoElement || footerLogoElement) {
        const existingStyleTag = document.getElementById("dynamic-logo-style");
        if (existingStyleTag) existingStyleTag.remove();
        const styleTag = document.createElement("style");
        styleTag.id = "dynamic-logo-style";
        styleTag.innerHTML = `
          #template-logo img, #footer-logo img {
            width: ${event.data.size}px !important;
            height: auto !important;
          }
        `;
        document.head.appendChild(styleTag);
      } else if (event.data.type === "changeGlobalColors") {
        console.log("changeGlobalColors event triggered on custom log");
        updateCSSVariables(event.data);
      } else {
        console.log("Logo elements not found to change the size.");
      }
    }
  });

  /**
   * Updates a CSS variable in existing stylesheets.
   * @param {string} variable - The CSS variable name.
   * @param {string} value - The value to set.
   * @returns {boolean} - True if updated successfully.
   */
  function updateCSSVariable(variable, value) {
    let isUpdated = false;
    // Fallback injection
    injectCSS(variable, value);
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule.style && rule.style.getPropertyValue(variable)) {
            rule.style.setProperty(variable, value);
            isUpdated = true;
            return true;
          }
        }
      } catch (e) {
        console.log("Error accessing stylesheet:", e);
        continue;
      }
    }
    if (!isUpdated) {
      injectCSS(variable, value);
      return true;
    }
    return false;
  }

  /**
   * Updates global CSS variables based on event data.
   * @param {Object} data - Event data containing type and new values.
   */
  function updateCSSVariables(data) {
    if (data.type === "changeFont") {
      const { primary, secondary } = data.font || {};
      if (primary && secondary) {
        updateCSSVariable("--e-global-typography-primary-font-family", primary);
        updateCSSVariable(
          "--e-global-typography-secondary-font-family",
          secondary
        );
      } else if (primary) {
        updateCSSVariable("--e-global-typography-primary-font-family", primary);
      }
      loadGoogleFont(primary);
    } else if (data.type === "changeGlobalColors") {
      updateCSSVariable("--e-global-color-primary", data.primaryColor);
      updateCSSVariable("--e-global-color-secondary", data.secondaryColor);
    }
  }

  /**
   * Injects a CSS rule into the document head.
   * @param {string} variable - The CSS variable.
   * @param {string} value - The value to set.
   */
  function injectCSS(variable, value) {
    const style = document.createElement("style");
    style.textContent = `* { ${variable}: ${value} !important; }`;
    document.head.appendChild(style);
  }

  /**
   * Loads a Google Font by adding a link element to the document head.
   * @param {string} font - The name of the font.
   */
  function loadGoogleFont(font) {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
      / /g,
      "+"
    )}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = font;
    document.documentElement.style.setProperty(
      "--gw-primary-font",
      `${font} !important`
    );
  }

  // Listen for messages to change font or global colors.
  window.addEventListener("message", (event) => {
    if (
      event.data.type === "changeFont" ||
      event.data.type === "changeGlobalColors"
    ) {
      updateCSSVariables(event.data);
    }
  });

  // Scroll-related message handlers.
  window.addEventListener("message", (event) => {
    if (event.data.type === "scroll") {
      handleScrollMessage(event.data.scrollAmount);
    } else if (event.data.type === "stopScrolling") {
      stopScrolling();
    } else if (event.data.type === "reverseScroll") {
      reverseScroll();
    }
  });

  /**
   * Handles scroll messages by translating the body element.
   * @param {number} scrollAmount - The scroll amount.
   */
  function handleScrollMessage(scrollAmount) {
    document.body.style.transition = "transform 10s linear";
    document.body.style.transform = `translateY(-${
      document.body.scrollHeight - window.innerHeight
    }px)`;
  }

  /**
   * Stops scrolling by resetting the body transform.
   */
  function stopScrolling() {
    document.body.style.transform = `translateY(${
      document.body.getBoundingClientRect().top
    }px)`;
    document.body.style.transition = "transform 10s linear";
    document.body.style.transform = `translateY(0)`;
  }

  /**
   * Gradually reverses the scroll direction.
   */
  function reverseScroll() {
    const targetPosition = document.body.scrollHeight - window.innerHeight;
    const currentPosition = window.scrollY;
    const step = 10;
    const distance = Math.abs(targetPosition - currentPosition);
    const numSteps = Math.ceil(distance / step);
    const direction = Math.sign(targetPosition - currentPosition);
    let currentStep = 0;
    const scrollIntervalId = setInterval(() => {
      window.scrollBy(0, direction * step);
      currentStep++;
      if (window.scrollY <= 0 || currentStep >= numSteps) {
        clearInterval(scrollIntervalId);
      }
    }, 20);
  }

  // Update contact details in the page content.
  window.addEventListener("message", (event) => {
    if (event.data.type === "updateContactDetails") {
      const { email, phone, address } = event.data;
      const contactDetails = {
        "2360 Hood Avenue, San Diego, CA, 92123": address,
        "contact@example.com": email,
        "202-555-0188": phone,
      };
      function findAndReplaceText(findText, replaceWith) {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        let node;
        while ((node = walker.nextNode())) {
          if (node.nodeValue.includes(findText)) {
            node.nodeValue = node.nodeValue.replace(findText, replaceWith);
          }
        }
      }
      for (const [findText, replaceWith] of Object.entries(contactDetails)) {
        findAndReplaceText(findText, replaceWith);
      }
    }
  });

  // Listen for a specific "changeLogo" message to update the logo image.
  window.addEventListener("message", (event) => {
    if (event.data.type === "changeLogo") {
      const logoUrl = event.data.logoUrl;
      const logoElement = document.querySelector(
        "#template-logo > div > div > a > div > div > img"
      );
      if (logoElement) {
        logoElement.src = logoUrl;
        logoElement.srcset = `${logoUrl} 319w, ${logoUrl} 300w`;
        logoElement.sizes = "(max-width: 319px) 100vw, 319px";
      } else {
        console.warn("Logo element not found.");
      }
    }
  });

  // Another listener for updating contact details with a slightly different mapping.
  window.addEventListener("message", (event) => {
    function findAndReplaceText(findText, replaceWith) {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue.includes(findText)) {
          node.nodeValue = node.nodeValue.replace(findText, replaceWith);
        }
      }
    }
    if (event.data.type === "updateContactDetails") {
      const { email, phone, address } = event.data;
      const contactDetails = {
        "Address : 2360 Hood Avenue, San Diego, CA, 92123": address,
        "202-555-0188": phone,
        "contact@example.com": email,
      };
      for (const [findText, replaceWith] of Object.entries(contactDetails)) {
        findAndReplaceText(findText, replaceWith);
      }
    }
  });
});
