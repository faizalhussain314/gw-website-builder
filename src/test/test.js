document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://staging-api.gravitywrite.com/api";
  let currentIndex = 0;
  let isFetching = false;
  let originalSelectors = [];
  let oldnewcontent = {}; // Object to store selector, old, and new content

  function getAllGWSelectors() {
    const elements = document.querySelectorAll("[id^='gw']");
    originalSelectors = Array.from(elements).map((element) => `#${element.id}`);
    return originalSelectors;
  }

  async function fetchPageSelectors(gwSelectors, bearer_token, template_id) {
    if (isFetching) return [];
    isFetching = true;

    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/builder/getPageSelector`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearer_token}`,
          },
          body: JSON.stringify({
            selectors: gwSelectors,
            template_id: template_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Collect and store old content before clearing
      data.forEach((item) => {
        const element = document.querySelector(item.id);
        if (element) {
          const oldContent = element.textContent || "";

          // Store selector ID and old content
          oldnewcontent[item.id] = { old: oldContent, new: "" };

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
      isFetching = false;
    }
  }

  async function fetchStreamContent(payload, processedSelectors) {
    if (isFetching) return;
    isFetching = true;

    const bearer_token = payload.bearer_token;

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

      if (
        currentIndex < processedSelectors.length &&
        result.trim().length > 0
      ) {
        const selectorData = processedSelectors[currentIndex];
        await typeEffect(selectorData, result);
        scrollToElement(selectorData.id);
        currentIndex++;
      }

      function cleanContent(content) {
        //    return content.replace(/^[\n\t]+|[\n\t]+$/g, '').trim();
        return content.trim();
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
            oldnewcontent[item.id].new = newContent;
          }
        }
      });

      const cleanedContent = {};
      Object.keys(oldnewcontent).forEach((id) => {
        let oldContent = oldnewcontent[id].old;
        let newContent = oldnewcontent[id].new;

        oldContent = cleanContent(oldContent);
        newContent = cleanContent(newContent);

        // Ensure we skip empty entries
        if (oldContent !== "" || newContent !== "") {
          cleanedContent[oldContent] = newContent;
        }
      });

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
          pageName: window.location.pathname.split("/").pop(),
          content: pageContent,
          isGenerating: false,
        },
        "*"
      );
    } catch (error) {
      console.error("Streaming data error:", error.message);
    } finally {
      isFetching = false;
      window.parent.postMessage(
        {
          type: "generationStatus",
          isGenerating: false,
        },
        "*"
      );
    }
  }

  async function typeEffect(selectorData, content) {
    const element = document.querySelector(selectorData.id);
    if (!element) {
      return;
    }

    let targetNode;
    if (selectorData.custom_selector) {
      targetNode = element;
    } else {
      targetNode =
        element.children[0]?.children[1] || element.children[0]?.children[0];
    }

    if (!targetNode) {
      return;
    }

    const textNode = targetNode.childNodes[0];

    if (textNode) {
      textNode.nodeValue = "";
      for (let i = 0; i < content.length; i++) {
        textNode.nodeValue += content.charAt(i);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } else {
      const newText = document.createTextNode("");
      targetNode.appendChild(newText);
      for (let i = 0; i < content.length; i++) {
        newText.nodeValue += content.charAt(i);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  window.addEventListener("message", async function (event) {
    if (event.data.type === "start") {
      // Reset variables for fresh generation
      currentIndex = 0;
      originalSelectors = [];
      oldnewcontent = {};
      var bearer_token = event.data.bearer_token;

      const gwSelectors = getAllGWSelectors();
      const processedSelectors = await fetchPageSelectors(
        gwSelectors,
        event.data.bearer_token,
        event.data.template_id
      );

      fetchStreamContent(
        {
          business_name: event.data.bussinessname || "ajay",
          template_name: event.data.templateName,
          services_provided:
            event.data.description ||
            "At Ajay's restaurant, we offer a diverse menu of authentic Indian cuisine.",
          customer_steps: "customer needs to visit the website",
          website_category: event.data.category || "restaurant",
          page_name: event.data.pageName,
          selectors: gwSelectors,
          template_id: event.data.template_id,
          bearer_token: bearer_token,
        },
        processedSelectors
      );
    }
  });
});

// Flag to track if the logo was updated
let logoUpdated = false;

window.addEventListener("message", (event) => {
  // Handle non-clickable content
  if (event.data.type === "nonClickable") {
    const bodyContent = event.data.transdiv;
    document.body.insertAdjacentHTML("beforeend", bodyContent);
  }

  // Handle business name update for both header and footer
  if (event.data.type === "businessName") {
    // If the logo has already been updated, skip creating the span
    if (logoUpdated) {
      return;
    }

    const businessName = event.data.text;
    const darkTheme = event.data.dark_theme;
    updateLogoText("#template-logo", businessName, darkTheme);
    updateLogoText("#footer-logo", businessName, darkTheme);
  }

  // Handle logo change for both header and footer
  if (event.data.type === "changeLogo") {
    // Set the flag to indicate the logo has been updated
    logoUpdated = true;

    updateLogoImage("#template-logo", event.data.logoUrl);
    updateLogoImage("#footer-logo", event.data.logoUrl);
  }
});

// Function to update the logo text (span element) in a given container
function updateLogoText(containerSelector, businessName, darkTheme) {
  const parentElement = document.querySelector(containerSelector);
  if (!parentElement) return;

  // Remove existing logo image and span element
  const logoElement = parentElement.querySelector("img:last-of-type");
  const existingText = parentElement.querySelector("#logo-text");

  if (existingText) {
    existingText.remove();
  }

  if (logoElement) {
    logoElement.src = "";
    logoElement.alt = "";
    logoElement.style.display = "none";
  }

  // Create and insert new span element for the business name
  const spanElement = document.createElement("span");
  spanElement.id = "logo-text";
  spanElement.textContent = businessName;
  spanElement.style.fontSize = "22px";
  spanElement.style.fontWeight = "bold";
  spanElement.style.textAlign = "center";
  spanElement.style.color = darkTheme ? "#fff !important" : "#00000 !important";

  console.log("this is dark theme", darkTheme);

  const logoContainer = parentElement.querySelector(
    "div > div > a > div > div"
  );
  if (logoContainer) {
    logoContainer.appendChild(spanElement);
  } else {
    console.warn(`Logo container not found in ${containerSelector}.`);
  }
}

// Function to update the logo image in a given container
function updateLogoImage(containerSelector, logoUrl) {
  const parentElement = document.querySelector(containerSelector);
  if (!parentElement) return;

  // Remove the #logo-text span if it exists
  const existingText = parentElement.querySelector("#logo-text");
  if (existingText) {
    existingText.remove();
  }

  // Update the logo image
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

window.addEventListener("message", (event) => {
  console.log("Event received on iframe:", event.data);

  if (event.data.type === "changeLogoSize") {
    const headerLogoElement = document.querySelector("#template-logo img");
    const footerLogoElement = document.querySelector("#footer-logo img");

    if (headerLogoElement || footerLogoElement) {
      // Remove any previous dynamically generated styles
      const existingStyleTag = document.getElementById("dynamic-logo-style");
      if (existingStyleTag) {
        existingStyleTag.remove();
      }

      // Create a new style tag with the !important rule
      const styleTag = document.createElement("style");
      styleTag.id = "dynamic-logo-style";
      styleTag.innerHTML = `
        #template-logo img, #footer-logo img {
          width: ${event.data.size}px !important;
          height: auto !important; /* Maintain aspect ratio */
        }
      `;

      // Append the style tag to the document head
      document.head.appendChild(styleTag);

      console.log(
        `Logo size updated to: ${event.data.size}px with !important for header and footer.`
      );
    } else {
      console.log("Logo elements not found to change the size.");
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("message", (event) => {
    if (
      event.data.type === "changeFont" ||
      event.data.type === "changeGlobalColors"
    ) {
      updateCSSVariables(event.data);
    }
  });

  function updateCSSVariable(variable, value) {
    let isUpdated = false;
    injectCSS(variable, value); // Try injecting CSS as a fallback
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules || sheet.rules) {
          if (rule.style && rule.style.getPropertyValue(variable)) {
            rule.style.setProperty(variable, value);
            isUpdated = true;
            return true; // Stop as soon as the rule is updated
          }
        }
      } catch (e) {
        console.log("Error accessing stylesheet:", e);
        continue; // Skip and move to the next stylesheet
      }
    }

    // Fallback to inject CSS if no rules were updated
    if (!isUpdated) {
      injectCSS(variable, value);

      return true;
    }
    return false;
  }

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

  function injectCSS(variable, value) {
    const style = document.createElement("style");
    style.textContent = ` * { ${variable}: ${value} !important; }`;
    document.head.appendChild(style);
  }

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
});

window.addEventListener("message", function (event) {
  var data = event.data;
  if (data.type === "scroll") {
    handleScrollMessage(data.scrollAmount);
  } else if (data.type === "stopScrolling") {
    stopScrolling();
  } else if (data.type === "reverseScroll") {
    reverseScroll();
  }
});
function handleScrollMessage(scrollAmount) {
  document.body.style.transition = "transform 10s linear";
  document.body.style.transform = `translateY(-${
    document.body.scrollHeight - window.innerHeight
  }px)`;
}
function stopScrolling() {
  document.body.style.transform = `translateY(${
    document.body.getBoundingClientRect().top
  }px)`;
  document.body.style.transition = "transform 10s linear";
  document.body.style.transform = `translateY(0)`;
}
function reverseScroll() {
  var targetPosition = document.body.scrollHeight - window.innerHeight;
  var currentPosition = window.scrollY;
  var step = 10;
  var distance = Math.abs(targetPosition - currentPosition);
  var numSteps = Math.ceil(distance / step);
  var direction = Math.sign(targetPosition - currentPosition);
  var currentStep = 0;
  var scrollIntervalId = setInterval(function () {
    window.scrollBy(0, direction * step);
    currentStep++;
    if (window.scrollY <= 0 || currentStep >= numSteps) {
      clearInterval(scrollIntervalId);
    }
  }, 20);
}

window.addEventListener("message", function (event) {
  if (event.data.type === "startProcessing") {
    processIds();
  }
});

function processIds() {
  const elements = document.querySelectorAll('[id^="gw"]');
  const results = [];

  elements.forEach((el) => {
    const lastChild = el.querySelector(":scope > *:last-child");
    if (lastChild) {
      if (lastChild.tagName.toLowerCase() !== "style") {
        results.push({
          selector: el.id,
          text: lastChild.textContent,
        });
      }
    }
  });

  generatePDF(results);
}

function generatePDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  data.forEach((item, index) => {
    const yPosition = 10 + index * 10;
    doc.text(`Selector: ${item.selector}`, 10, yPosition);
    doc.text(`Text: ${item.text}`, 10, yPosition + 5);
    doc.text(`Console Log: last child ${item.text}`, 10, yPosition + 10);
  });

  doc.save("results.pdf");
}

window.addEventListener("message", function (event) {
  if (event.data.type === "updateContactDetails") {
    const { email, phone, address } = event.data;

    // Define the text values to find and their replacements
    const contactDetails = {
      "2360 Hood Avenue, San Diego, CA, 92123": address,
      "contact@example.com": email,
      "202-555-0188": phone,
    };

    // Function to find and replace text content across the document
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

    // Iterate over each contact detail and replace it in the document
    for (const [findText, replaceWith] of Object.entries(contactDetails)) {
      findAndReplaceText(findText, replaceWith);
    }
  }
});

// Function to handle incoming messages
window.addEventListener("message", function (event) {
  // Check the message type
  if (event.data.type === "changeLogo") {
    const logoUrl = event.data.logoUrl;
    // Find the logo element and update its attributes
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

window.addEventListener("message", function (event) {
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

// window.addEventListener("message", function (event) {
//   if (event.data === "fetchGWIDs") {
//     const elements = document.querySelectorAll('[id^="gw"]');
//     const idsAndContent = Array.from(elements).map((el) => ({
//       id: el.id,
//       content: el.innerHTML,
//     }));
//     window.parent.postMessage({ type: "gwIDs", idsAndContent }, "*");
//   }
// });
