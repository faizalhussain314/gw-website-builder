document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* -------------------------------------------------------------------------
   * Global Variables
   * ------------------------------------------------------------------------- */
  let API_BASE_URL = "https://api.gravitywrite.com/api";
  let stagging_url = "https://staging-api.gravitywrite.com/api";
  let currentIndex = 0;
  let isFetching = false; // Used in stream content
  let isFetchingPageSelectors = false;
  let isFetchingImageSelectors = false;
  let isFetchingNqImageSelectors = false;
  let oldNewContent = {}; // To store old and new content per selector
  let imageUrlData = {}; // To store mapping of old/new image URLs

  let apiResponseData = [];
  let imageFailureQueue = [];

  let stylePrompt = "";
  let completedCount = 0; // how many images are finished (success OR fail)
  let totalItems = 0; // how many images we expect in this round
  let globalPageName = ""; // saved once per “start” message
  var globalCleaned = {};
  var logoUpdated = false;

  /* -------------------------------------------------------------------------
   * STEP 1: Utility Functions for Background Image Extraction
   * ------------------------------------------------------------------------- */

  /**
   * Extracts the URL from a CSS background-image string.
   * @param {string} backgroundImage - The background-image CSS value.
   * @returns {string|null} - The extracted URL or null if extraction fails.
   */
  function extractBackgroundImageUrl(backgroundImage) {
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
        return extractedUrl;
      }
    }
    return null;
  }
  //--------------------------------------------------------------------
  // helper – call once for *every* failure
  //--------------------------------------------------------------------
  function recordImageFailure({ selector, payload, error }) {
    imageFailureQueue.push({ selector, payload, error });
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
    const styleSheets = [...document.styleSheets];

    for (const sheet of styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule.selectorText && rule.selectorText.includes(classSelector)) {
            const bgImage = rule.style?.backgroundImage;
            const url = extractBackgroundImageUrl(bgImage);
            if (url) return url;
          }
        }
      } catch (e) {
        // Skip cross-origin stylesheets
      }
    }
    return null;
  }

  function getBackgroundImageFromElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      return null;
    }

    // Check for inherited background image specifically for jkit-icon-box-wrapper
    if (
      element.classList.contains("jkit-icon-box-wrapper") ||
      element.className.startsWith("jkit-icon-box-wrapper")
    ) {
      const inheritedBg = getInheritedBackgroundImage(element);
      if (inheritedBg) {
        return inheritedBg;
      }
    }

    // Get computed style for the element itself
    // const getComputedValue = window.getComputedStyle(element);

    // Use a Set to store unique image URLs
    let imageUrlData = new Set();

    // Check each class on the current element
    for (const className of element.classList) {
      if (
        className.startsWith("elementor-element-") ||
        className.startsWith("jkit-icon-box-wrapper")
      ) {
        const classSelector = `.${className}`;
        const url = getBackgroundImageFromClass(classSelector);
        if (url && !imageUrlData.has(url)) {
          imageUrlData.add(url);

          return url;
        }
      }
    }

    // Fallback: Check the parent’s parent’s parent (or a fixed level upward)
    const parentEl = element.parentElement;
    if (parentEl) {
      // Example: travel three levels up
      let targetEl = parentEl;
      for (let i = 0; i < 2; i++) {
        // already have one level from parentEl, so two more levels to get three total
        if (targetEl.parentElement) {
          targetEl = targetEl.parentElement;
        }
      }
      if (targetEl) {
        for (const parentClassName of targetEl.classList) {
          if (parentClassName.startsWith("elementor-element-")) {
            const parentClassSelector = `.${parentClassName}`;
            const parentUrl = getBackgroundImageFromClass(parentClassSelector);
            if (parentUrl && !imageUrlData.has(parentUrl)) {
              imageUrlData.add(parentUrl);

              return parentUrl;
            }
          }
        }
      }
    }

    // Fallback: Check inline style
    const inlineBackgroundImage = element.style.backgroundImage;

    if (inlineBackgroundImage && inlineBackgroundImage !== "none") {
      const url = extractBackgroundImageUrl(inlineBackgroundImage);
      if (url) {
        return url;
      }
    }

    // Fallback: Check computed style
    const computedBackgroundImage =
      window.getComputedStyle(element).backgroundImage;

    if (computedBackgroundImage && computedBackgroundImage !== "none") {
      const url = extractBackgroundImageUrl(computedBackgroundImage);
      if (url) {
        return url;
      }
    }

    return null;
  }

  function showFallbackImage(selector, isbackground, darkTheme) {
    const elementImagewhite = "https://plugin.mywpsite.org/whiteelement.png";
    const elementImagedark = "https://plugin.mywpsite.org/darkelement.png";
    const backgroundwhite = "https://plugin.mywpsite.org/white-bg.png";
    const backgroundDark = "https://plugin.mywpsite.org/dark-bg.png";

    const newImageUrl = isbackground
      ? darkTheme
        ? backgroundDark
        : backgroundwhite
      : darkTheme
      ? elementImagedark
      : elementImagewhite;

    const element = document.querySelector(selector);
    if (!element) {
      console.warn("⚠️ Fallback image: element not found:", selector);
      return;
    }

    if (isbackground) {
      const beforeImage = getBeforePseudoElementBackground(selector);

      if (
        selector === "#py-barber-services-banner" ||
        selector === "#py-barber-about-banner"
      ) {
        updateBeforePseudoElementBackground(selector, newImageUrl);
        element.style.backgroundImage = `url(${newImageUrl}) !important`;
      } else if (beforeImage) {
        updateBeforePseudoElementBackground(selector, newImageUrl);
      } else {
        element.style.backgroundImage = `url(${newImageUrl})`;
      }
    } else {
      element.src = newImageUrl;
      element.srcset = newImageUrl;
    }

    // Safely update imageUrlData
    const key = selector;
    if (!imageUrlData[key]) {
      imageUrlData[key] = {};
    }

    const oldUrl = Object.keys(imageUrlData[key])[0];

    imageUrlData[key][oldUrl] = newImageUrl;
  }

  /* -------------------------------------------------------------------------
   *
   * @param {Object}   opts
   * @param {string}   opts.pageName         – e.g. eventData.page_name
   * @param {Object}   opts.cleanedContent   – { oldText : newText, … }
   * @param {Object}   opts.imageUrlMap      – { '#selector' : { oldUrl : newUrl } }
   * @param {Array}    opts.failureQueue     – [{ selector, payload, error }, …]
   * @param {boolean}  [opts.isGenerating]   – defaults to false
   */
  function flushResultsToParent({
    pageName,
    cleanedContent,
    imageUrlMap,
    failureQueue,
    isGenerating = false,
  }) {
    if (!cleanedContent || Object.keys(cleanedContent).length === 0) return;

    // 1. text diff map --------------------------------------------------------
    window.parent.postMessage(
      {
        type: "oldNewContent",
        pageName,
        content: cleanedContent, // { oldText : newText }
      },
      "*"
    );

    // 2. a *snapshot* of the full generated HTML ------------------------------
    window.parent.postMessage(
      {
        type: "generatedContent",
        pageName,
        content: document.documentElement.outerHTML,
        isGenerating,
      },
      "*"
    );

    // 3. image diff map -------------------------------------------------------
    window.parent.postMessage(
      {
        type: "oldNewImages",
        pageName,
        images: imageUrlMap, // { '#selector' : { old : new } }
        isGenerating,
      },
      "*"
    );

    // 4. overall status flag --------------------------------------------------
    window.parent.postMessage({ type: "generationStatus", isGenerating }, "*");

    // 5. consolidated failures (only if any) ----------------------------------
    if (failureQueue && failureQueue.length) {
      window.parent.postMessage(
        {
          type: "image-failure",
          failures: failureQueue, // [{ selector, payload, error }, …]
        },
        "*"
      );
    }
  }

  // Modified helper function that climbs a fixed number of levels (here: 3 total levels up)
  // and checks that target element's class list for classes starting with "elementor-element-"
  function getInheritedBackgroundImage(el) {
    // Traverse three levels upward
    let target = el;
    for (let i = 0; i < 4; i++) {
      if (target.parentElement) {
        target = target.parentElement;
      } else {
        break;
      }
    }

    if (!target) {
      return null;
    }

    for (const cls of target.classList) {
      if (cls.startsWith("elementor-element-")) {
        const classSelector = `.${cls}`;
        const bg = getBackgroundImageFromClass(classSelector);
        if (bg && bg !== "none") {
          return bg;
        }
      }
    }

    return null;
  }

  /**
   * Get the current background image URL of the :before pseudo-element.
   * @param {string} selector - The CSS selector of the element with the :before pseudo-element.
   * @returns {string|null} - The current background image URL or null if not found.
   */
  function ensureStylesheetLoaded() {
    return new Promise((resolve) => {
      const links = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      );
      if (!links.length) return resolve();

      let loaded = 0;

      links.forEach((link) => {
        if (link.sheet) {
          // Already loaded
          loaded++;
          if (loaded === links.length) resolve();
        } else {
          link.addEventListener("load", () => {
            loaded++;
            if (loaded === links.length) resolve();
          });
          link.addEventListener("error", () => {
            loaded++; // Even on error, count as loaded to prevent hanging
            if (loaded === links.length) resolve();
          });
        }
      });

      // Fallback - in case all are already loaded
      if (loaded === links.length) {
        resolve();
      }
    });
  }

  function getBeforePseudoElementBackground(selector) {
    ensureStylesheetLoaded().then(() => {
      const element = document.querySelector(selector);
      if (!element) {
        console.log(`Element not found for selector: ${selector}`);
        return null;
      }

      // Retrieve the computed style of the element's ::before pseudo-element
      const beforeStyle = window.getComputedStyle(element, "::before");

      // Ensure the pseudo-element is rendered and has valid content

      // const content = extractBackgroundImageUrl(beforeStyle.backgroundImage);

      // if (content) {
      //   console.log("content", content);
      //   return content;
      // }
      // if (!content || content === "none" || content === '""') {
      //   console.log(
      //     `::before pseudo-element has no content and will not render for ${selector}`
      //   );
      //   return null;
      // }

      // Extract the background image from the ::before pseudo-element
      const bgImage = beforeStyle.getPropertyValue("background-image");
      let url = extractBackgroundImageUrl(bgImage); // Use your existing URL extraction function
      if (url) {
        return url;
      }

      // If no background image on ::before, check parent elements and their classes for background images
      let currentElement = element.parentElement;
      while (currentElement) {
        // Check for background images in the parent element's computed style
        const parentBgImage = getComputedStyle(currentElement).backgroundImage;
        url = extractBackgroundImageUrl(parentBgImage); // Use the same extraction function
        if (url) {
          return url;
        }

        // Move to the parent element
        currentElement = currentElement.parentElement;
      }

      return null;
    });
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

    if (
      (selector === "#py-barber-services-banner" ||
        selector === "#py-barber-about-banner") &&
      newImageUrl !== "https://plugin.mywpsite.org/white-normal.gif"
    ) {
      const styleTag = window.document.createElement("style");
      styleTag.innerHTML = `
        ${selector}::before {
          background-image: url(${newImageUrl}) !important;
         
        }
      `;
      document.head.appendChild(styleTag);
    }

    // Inject the new background image for the :before pseudo-element
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
      `${selector}::before { background-image: url(${newImageUrl}) !important; }`,
      styleSheet.cssRules.length
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
          }
          if (actualBackgroundImage) {
            imageUrlData[item.selector] = { [actualBackgroundImage]: "" };
          }

          if (actualBackgroundImage) {
            imageUrlData[item.selector] = { [actualBackgroundImage]: "" };
          }
        }
      });

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
        var originalSelector = selector;

        const dark_theme = eventData.dark_theme;

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
        const loaderGifUrl = "https://plugin.mywpsite.org/white-normal.gif";
        let oldImageUrl = "";

        if (element) {
          if (isbackground) {
            const beforeImage = getBeforePseudoElementBackground(selector);
            if (
              selector === "#py-barber-services-banner" ||
              selector === "#py-barber-about-banner"
            ) {
              oldImageUrl = getBackgroundImageFromElement(selector) || "";
              updateBeforePseudoElementBackground(selector, loaderGifUrl);
            } else if (beforeImage) {
              oldImageUrl = beforeImage;
              updateBeforePseudoElementBackground(selector, loaderGifUrl);
            } else {
              oldImageUrl = getBackgroundImageFromElement(selector) || "";
              // element.style.backgroundImage = `url(${loaderGifUrl})`;
              element.style.backgroundImage = `url("https://plugin.mywpsite.org/Rectangle-white-bg%20-low-quality.gif)`;
            }
          } else {
            oldImageUrl = element.src;

            imageUrlData[item.selector] = { [oldImageUrl]: "" };
            element.src = loaderGifUrl;
            element.srcset = loaderGifUrl;
          }
        }

        // Function to call the API to fetch image URL
        const fetchFunction = async (requestId) => {
          return fetch(`${API_BASE_URL}/get-image-url`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearer_token}`,
            },
            body: JSON.stringify({ ...payload, requestId }), // Attach requestId here
          });
        };

        // Polling function with retry logic
        const pollForCompletedImage = (requestId, retries = 3, payload) => {
          if (!requestId) {
            console.error("No requestId found in polling function.");
            return;
          }

          setTimeout(async () => {
            try {
              const response = await retryFetch({
                fetchFunction,
                payload,
                selector: originalSelector,
                delay: 5000,
                retries: 3,
                isbackground,
                dark_theme,
                requestId: requestId,
              });
              const data = await response.json();

              if (data && data.status === "completed" && data.data.image_urls) {
                const newImageUrl = data.data.image_urls;

                if (element) {
                  if (isbackground) {
                    const beforeImage =
                      getBeforePseudoElementBackground(selector);

                    if (
                      selector === "#py-barber-services-banner" ||
                      selector === "#py-barber-about-banner"
                    ) {
                      updateBeforePseudoElementBackground(
                        selector,
                        newImageUrl
                      );
                      element.style.backgroundImage = `url(${newImageUrl}) !important`;
                    } else if (beforeImage) {
                      updateBeforePseudoElementBackground(
                        selector,
                        newImageUrl
                      );
                    } else {
                      element.style.backgroundImage = `url(${newImageUrl})`;
                    }
                  } else {
                    element.src = newImageUrl;
                    element.srcset = newImageUrl;
                  }
                  imageUrlData[item.selector] = { [oldImageUrl]: newImageUrl };
                }
              } else if (data && data.status === "pending" && retries > 0) {
                pollForCompletedImage(requestId, retries - 1, payload); // Retry
              } else if (data && data.status === "pending") {
                pollForCompletedImage(data.requestId, retries - 1, payload); // Retry
              } else {
                if (data.status === "failed") {
                  showFallbackImage(originalSelector, isbackground, dark_theme);

                  completedCount++;

                  return; // stop polling this one
                }

                console.error(`Unexpected response for ${selector}:`, data);
                if (retries >= 3) {
                  console.error(
                    `maximum retires(${retries}) reached for ${selector}`
                  );
                }
              }
            } catch (error) {
              showFallbackImage(originalSelector, isbackground, dark_theme);
              recordImageFailure({
                selector: payload.selector,
                payload,
                error: error,
              });
              console.error("Error in polling for image completion", error);
            }
          }, 3000); // Poll every 3 seconds
        };

        // Initial fetch to start polling if the status is "pending"
        retryFetch({
          fetchFunction,
          payload,
          selector: originalSelector,
          delay: 5000,
          retries: 3,
          isbackground, // 🔁 add this
          dark_theme, // 🔁 and this
        }) // Pass requestId from here
          .then(async (response) => {
            const data = await response.json();

            if (data && data.status === "pending" && data.requestId) {
              pollForCompletedImage(data.requestId, 3, payload); // Retry 3 times
            } else if (
              data &&
              data.status === "completed" &&
              data.data.image_urls
            ) {
              const newImageUrl = data.data.image_urls;
              if (element) {
                if (isbackground) {
                  const beforeImage =
                    getBeforePseudoElementBackground(selector);
                  if (
                    selector === "#py-barber-services-banner" ||
                    selector === "#py-barber-about-banner"
                  ) {
                    element.style.backgroundImage = `url(${newImageUrl})`;
                    updateBeforePseudoElementBackground(selector, newImageUrl);
                  } else if (beforeImage) {
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
              // const elementImagewhite =
              //   "https://plugin.mywpsite.org/whiteelement.png";
              // const elementImagedark =
              //   "https://plugin.mywpsite.org/darkelement.png";
              // const backgroundwhite =
              //   "https://plugin.mywpsite.org/white-bg.png";
              // const backgroundDark = "https://plugin.mywpsite.org/dark-bg.png";
              // const element = document.querySelector(selector);
              // const newImageUrl = isbackground
              //   ? dark_theme
              //     ? backgroundDark
              //     : backgroundwhite
              //   : dark_theme
              //   ? elementImagedark
              //   : elementImagewhite;
              // if (element) {
              //   if (isbackground) {
              //     const beforeImage =
              //       getBeforePseudoElementBackground(selector);
              //     if (
              //       selector === "#py-barber-services-banner" ||
              //       selector === "#py-barber-about-banner"
              //     ) {
              //       console.log(
              //         "image Changed from full code",
              //         selector,
              //         newImageUrl
              //       );
              //       element.style.backgroundImage = `url(${newImageUrl})`;
              //       updateBeforePseudoElementBackground(selector, newImageUrl);
              //     } else if (beforeImage) {
              //       updateBeforePseudoElementBackground(selector, newImageUrl);
              //     } else {
              //       element.style.backgroundImage = `url(${newImageUrl})`;
              //     }
              //   } else {
              //     element.src = newImageUrl;
              //     element.srcset = newImageUrl;
              //   }
              //   imageUrlData[selector] = { [oldImageUrl]: newImageUrl };
              //   console.log(
              //     `[handleNqImageGeneration] Image generation completed immediately for ${selector}: ${newImageUrl}`
              //   );
              // }
              // changeImage(selector, isbackground, oldImageUrl, dark_theme);
              recordImageFailure({
                selector: payload.selector,
                payload,
                error: data,
              });
              console.error("Unexpected API response for", selector, data);
              showFallbackImage(originalSelector, isbackground, dark_theme);
            }
          })
          .catch((error) => {
            showFallbackImage(originalSelector, isbackground, dark_theme);
            // recordImageFailure({
            //   selector: payload.selector,
            //   payload,
            //   error: error,
            // });
            console.error("Error generating NQ image for", selector, error);
          });
      });
    } else {
      console.error(
        "nqImageSelectorResult is not an array:",
        nqImageSelectorResult
      );
    }
  }

  /**
   * Handles image generation for page selectors.
   * @param {string} bearer_token - Authorization token.
   * @param {Object} eventData - Event data containing necessary details.
   * @param {object} cleanedContent - oldnew content of text
   */
  function handleImageGeneration(
    bearer_token,
    eventData,
    cleanedContent,
    darkTheme
  ) {
    totalItems = apiResponseData.data.length; // update global
    completedCount = 0;
    const pageName = eventData.page_name;
    globalPageName = pageName;
    const loaderGifUrl = "https://plugin.mywpsite.org/white-normal.gif";
    var originalSelector = "";

    // Polling function that re-calls the get-image-url API
    async function pollForCompletedImage(
      originalSelector,
      payload,
      requestId,
      isbackground
    ) {
      const pollInterval = 5000; // 5 seconds

      while (true) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        try {
          const response = await fetch(`${API_BASE_URL}/get-image-url`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bearer_token}`,
            },
            // Include the original payload plus the requestId from the pending response.
            body: JSON.stringify({ ...payload, requestId }),
          });
          const data = await response.json();

          if (data.status === "completed" && data.data?.image_urls) {
            return data;
          } else if (data.status === "pending") {
            if (data.status === "failed") {
              showFallbackImage(originalSelector, isbackground, darkTheme);
              recordImageFailure({
                selector: payload.selector,
                payload,
                error: data,
              });
              return; // stop polling this one
            }

            // Continue the loop
          } else {
            showFallbackImage(originalSelector, isbackground, darkTheme);
            recordImageFailure({
              selector: originalSelector,
              payload,
              error: data,
            });
            throw new Error(
              `[pollForCompletedImage] Unexpected response status: ${data.status}`
            );
          }
        } catch (error) {
          showFallbackImage(originalSelector, isbackground, darkTheme);
          recordImageFailure({
            selector: payload.selector,
            payload,
            error: error,
          });
          console.error("[pollForCompletedImage] Error during polling:", error);
          throw error;
        }
      }
    }

    apiResponseData.data.forEach((item) => {
      const contentPayload = {};
      if (item.content && item.content.length > 0) {
        item.content.forEach((contentItem) => {
          contentPayload[contentItem.title] = fetchTextFromSelector(
            contentItem.selectorid
          );
        });
      }

      originalSelector = item.selector;

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
        // If we already have a mapping, use it.
        if (
          imageUrlData[item.selector] &&
          Object.keys(imageUrlData[item.selector]).length
        ) {
          oldImageUrl = Object.keys(imageUrlData[item.selector])[0];
        } else {
          if (item.isbackgroundimage) {
            // Check if a :before pseudo-element background exists.
            const beforeImage = getBeforePseudoElementBackground(item.selector);
            if (beforeImage) {
              oldImageUrl = beforeImage;
              updateBeforePseudoElementBackground(item.selector, loaderGifUrl);
            } else {
              // Fallback to the element's own background image.
              oldImageUrl = getBackgroundImageFromElement(item.selector) || "";
              element.style.backgroundImage = `url("https://plugin.mywpsite.org/Rectangle-white-bg%20-low-quality.gif")`;
            }
          } else {
            oldImageUrl = element.src;
            element.src = loaderGifUrl;
            element.srcset = loaderGifUrl;
          }
        }
      }

      const fetchFunction = async () => {
        return fetch(`${API_BASE_URL}/get-image-url`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer_token}`,
          },
          body: JSON.stringify(payload),
        });
      };

      // Call our retryFetch (or similar) with the original fetchFunction.
      retryFetch({
        fetchFunction,
        payload,
        selector: originalSelector,
        delay: 5000,
        retries: 3,
        isbackground: item.isbackgroundimage, // 🔁 add this
        dark_theme: darkTheme, // 🔁 and this
      })
        .then(async (response) => {
          try {
            const data = await response.json();

            return data;
          } catch (e) {
            console.log("Error parsing JSON response:", e);
          }
        })
        .then(async (data) => {
          // If the response indicates that the image generation is pending,
          // poll until we get a completed response.
          if (data && data.status === "pending" && data.requestId) {
            data = await pollForCompletedImage(
              originalSelector,
              payload,
              data.requestId,
              item.isbackgroundimage
            );
          }

          if (data && data.data && data.data.image_urls) {
            const newImageUrl = data.data.image_urls;
            if (element) {
              if (item.isbackgroundimage) {
                // First, check if the pseudo-element background exists.
                const beforeImage = getBeforePseudoElementBackground(
                  item.selector
                );
                if (beforeImage) {
                  updateBeforePseudoElementBackground(
                    item.selector,
                    newImageUrl
                  );
                } else {
                  // New logic: If the item's selector starts with "#px-", then look for a nested element:
                  let targetElement = element;
                  if (item.selector.startsWith("#px-")) {
                    const candidate = element.querySelector("div > div > div");
                    if (
                      candidate &&
                      candidate.classList.contains("jkit-icon-box-wrapper") &&
                      candidate.classList.contains("hover-from-arise")
                    ) {
                      targetElement = candidate;
                    } else {
                      console.log(
                        `Candidate child not found or missing required classes for ${item.selector}. Using original element.`
                      );
                    }
                  }
                  targetElement.style.backgroundImage = `url(${newImageUrl})`;
                }
              } else {
                // Non-background image handling.
                element.src = newImageUrl;
                element.srcset = newImageUrl;
              }
              // Update the mapping.
              if (oldImageUrl) {
                imageUrlData[item.selector] = { [oldImageUrl]: newImageUrl };
              } else {
                console.warn(
                  `[Fix] Skipping mapping because oldImageUrl is null for ${item.selector}`
                );
              }
            }
          } else {
            console.error(
              `No valid image URL returned for selector: ${item.selector}`,
              data
            );
            showFallbackImage(
              originalSelector,
              item.isbackgroundimage,
              darkTheme
            );
          }
        })
        .catch((error) => {
          console.error("Error generating image for", item.selector, error);
          showFallbackImage(
            originalSelector,
            item.isbackgroundimage,
            darkTheme
          );
        })
        .finally(() => {
          completedCount++;
          if (completedCount === totalItems) {
            flushResultsToParent({
              pageName,
              cleanedContent,
              imageUrlMap: imageUrlData,
              failureQueue: imageFailureQueue,
              isGenerating: false,
            });
          }
        });
    });
  }

  /**
   * Helper function to retry a fetch call after a specified delay.
   * @param {Function} fetchFunction - The fetch function to call.
   * @param {number} delay - The delay in milliseconds before retrying.
   * @param {number} retries - The number of retries before giving up.
   * @returns {Promise<Response>} - Resolves to the response of the fetch call.
   */
  async function retryFetch({
    fetchFunction,
    payload,
    selector,
    delay = 5000,
    retries = 3,
    isbackground,
    dark_theme,
    requestId,
  }) {
    let attempt = 0;

    while (attempt < retries) {
      try {
        const response = await fetchFunction(requestId);

        // If the response is successful, return the response
        if (response.ok) {
          return response;
        } else {
          throw new Error(`HTTP status ${response.status}`);
        }
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        } else {
          showFallbackImage(selector, isbackground, dark_theme);
          recordImageFailure({
            selector: payload.selector,
            payload,
            error: { message: "max-retries" },
          });
          completedCount;
          if (completedCount === totalItems) {
            flushResultsToParent({
              pageName: globalPageName,
              cleanedContent: globalCleaned,
              imageUrlMap: imageUrlData,
              failureQueue: imageFailureQueue,
              isGenerating: false,
            });
          }
          throw new Error("Max retries reached. API call failed.");
        }
      }
    }
  }

  function cleanContent(content) {
    return content.replace(/^[\n\t]+|[\n\t]+$/g, "").trim();
  }
  /**
   * Fetches streaming content from the API and processes the stream.
   * @param {Object} payload - Request payload.
   * @param {Array} processedSelectors - Array of processed selectors.
   */
  async function fetchStreamContent(payload, processedSelectors, darkTheme) {
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
            // return;
          }

          let completeData = result.substring(0, endIndex);
          const selectorData = processedSelectors[currentIndex];

          // Send isGenerating: true when content starts typing
          window.parent.postMessage(
            {
              type: "generationStatus",
              isGenerating: true,
            },
            "*"
          );

          await typeEffect(selectorData, completeData);
          scrollToElement(selectorData.id);
          currentIndex++;
          result = result.substring(endIndex + 1);
        }
      }

      console.log("processedSelectors");
      if (
        currentIndex < processedSelectors.length &&
        result.trim().length > 0
      ) {
        const selectorData = processedSelectors[currentIndex];
        await typeEffect(selectorData, result);
        scrollToElement(selectorData.id);
        currentIndex++;
      }

      processedSelectors.forEach((item) => {
        const element = document.querySelector(item.id);
        if (element) {
          let targetNode;
          if (item.custom_selector) {
            targetNode = element;
          } else {
            targetNode =
              element.children[0]?.children[1] ||
              element.children[0]?.children[0];
          }

          if (targetNode && targetNode.nodeName.toLowerCase() !== "style") {
            let newContent = targetNode.textContent || "";

            newContent = cleanContent(newContent);

            // Update new content for the respective selector ID
            oldNewContent[item.id].new = newContent;
          }
        }
      });

      const cleanedContent = {};
      Object.keys(oldNewContent).forEach((id) => {
        let oldContent = oldNewContent[id].old;
        let newContent = oldNewContent[id].new;

        oldContent = cleanContent(oldContent);
        newContent = cleanContent(newContent);

        // Ensure we skip empty entries
        if (oldContent !== "" || newContent !== "") {
          cleanedContent[oldContent] = newContent;
        }
      });

      handleImageGeneration(bearer_token, eventData, cleanedContent, darkTheme);
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
      const darkTheme = event.data.dark_theme;

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
                processedSelectors,
                darkTheme
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
    apiResponseData = data;

    const loaderGifUrl = "https://plugin.mywpsite.org/white-normal.gif";
    apiResponseData.data.forEach((selectorDetails) => {
      const selector = selectorDetails.selector;
      const element = document.querySelector(selector);

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
          element.style.backgroundImage = `url("https://plugin.mywpsite.org/Rectangle-white-bg%20-low-quality.gif")`;
        }
      }
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Step 4: retry any failures on demand
  // ────────────────────────────────────────────────────────────────────────────
  // window.addEventListener("message", (event) => {
  //   if (event.data.type === "retryFailures") {
  //     // pass along your token so fetches will auth
  //     regenerateFailedImages(event.data.bearer_token);
  //   }
  // });

  // /**
  //  * Retry‐generate every failed image in imageFailureQueue, in parallel.
  //  * @param {string} bearer_token
  //  */
  // async function regenerateFailedImages(bearer_token) {
  //   if (!imageFailureQueue.length) return;

  //   // copy & clear the queue so new failures go back into it
  //   const failuresToRetry = imageFailureQueue.splice(0);
  //   const newFailureQueue = [];

  //   // run them all at once
  //   await Promise.all(
  //     failuresToRetry.map(async ({ selector, payload }) => {
  //       try {
  //         // 1) call the same endpoint you used before
  //         let resp = await retryFetch(
  //           () =>
  //             fetch(`${API_BASE_URL}/get-image-url`, {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //                 Authorization: `Bearer ${bearer_token}`,
  //               },
  //               body: JSON.stringify(payload),
  //             }),
  //           payload
  //         );
  //         let data = await resp.json();

  //         // 2) if still pending, poll until complete
  //         if (data.status === "pending" && data.requestId) {
  //           data = await pollForCompletedImage(payload, data.requestId);
  //         }

  //         // 3) if success—swap out the image in the DOM, update imageUrlData
  //         if (data.status === "completed" && data.data.image_urls) {
  //           const newUrl = data.data.image_urls;
  //           const el = document.querySelector(selector);
  //           if (el && el.tagName.toLowerCase() === "img") {
  //             el.src = newUrl;
  //             el.srcset = newUrl;
  //           } else if (el) {
  //             el.style.backgroundImage = `url(${newUrl})`;
  //           }
  //           // remember old → new
  //           const oldUrl = Object.keys(imageUrlData[selector] || {})[0] || "";
  //           imageUrlData[selector] = { [oldUrl]: newUrl };
  //         } else {
  //           // otherwise push it back into failures
  //           newFailureQueue.push({ selector, payload, error: data });
  //         }
  //       } catch (err) {
  //         newFailureQueue.push({ selector, payload, error: err });
  //       }
  //     })
  //   );

  //   // 4) restore any left‐over failures
  //   imageFailureQueue.push(...newFailureQueue);

  //   // 5) finally, send the updated results back up
  //   flushResultsToParent({
  //     pageName: globalPageName,
  //     cleanedContent: globalCleaned,
  //     imageUrlMap: imageUrlData,
  //     failureQueue: imageFailureQueue,
  //     isGenerating: false,
  //   });
  // }

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
      const businessName = event.data.text;
      const darkTheme = event.data.dark_theme ?? 0;
      updateLogoText("#template-logo", businessName, darkTheme);
      updateLogoText("#footer-logo", businessName, darkTheme);
      removeLogoAndAddBusinessName("#template-logo", businessName);
      removeLogoAndAddBusinessName("#footer-logo", businessName);
    }
    if (event.data.type === "changeLogo") {
      const logoUrl = event.data.logoUrl;

      if (logoUrl && logoUrl.trim()) {
        logoUpdated = true;
        updateLogoImage("#template-logo", logoUrl);
        updateLogoImage("#footer-logo", logoUrl);
      }
      // } else {
      //   removeLogoAndAddBusinessName("#template-logo", event.data.businessName);
      //   removeLogoAndAddBusinessName("#footer-logo", event.data.businessName);
      // }
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
    if (existingText) existingText.remove();

    const logoContainer = parentElement.querySelector(
      "div > div > a > div > div"
    );
    if (logoContainer) {
      logoElement.src = logoUrl;
      logoElement.srcset = `${logoUrl} 1x, ${logoUrl} 2x`;
      logoElement.sizes = "(max-width: 319px) 100vw, 319px";
      logoElement.style.setProperty("display", "block", "important");
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
  // Update contact details in the page content.
  window.addEventListener("message", (event) => {
    if (event.data.type === "updateContactDetails") {
      const { email, phone, address } = event.data;
      const contactDetails = {
        "2360 Hood Avenue, San Diego, CA, 92123": address,
        "contact@example.com": email,
        "202-555-0188": phone,
      };

      for (const [findText, replaceWith] of Object.entries(contactDetails)) {
        findAndReplaceText(findText, replaceWith);
      }
    }
  });

  // Listen for a specific "changeLogo" message to update the logo image.
  // window.addEventListener("message", (event) => {
  //   if (event.data.type === "changeLogo") {
  //     const logoUrl = event.data.logoUrl;
  //     const logoElement = document.querySelector(
  //       "#template-logo > div > div > a > div > div > img"
  //     );
  //     if (logoElement) {
  //       logoElement.src = logoUrl;
  //       logoElement.srcset = `${logoUrl} 319w, ${logoUrl} 300w`;
  //       logoElement.sizes = "(max-width: 319px) 100vw, 319px";
  //       logoElement.style.setProperty("display", "block", "important");
  //     } else {
  //       console.warn("Logo element not found.");
  //     }
  //   }
  // });

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
