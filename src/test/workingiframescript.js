<script>
document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://dev.gravitywrite.com/api";
  let currentIndex = 0;
  let isFetching = false;
  let originalSelectors = [];

  function getAllGWSelectors() {
    const elements = document.querySelectorAll("[id^='gw']");
    originalSelectors = Array.from(elements).map((element) => `#${element.id}`);
    console.log("Original Selectors:", originalSelectors); // Log original selectors
    return originalSelectors;
  }

  async function fetchPageSelectors(gwSelectors) {
    if (isFetching) return [];
    isFetching = true;
    try {
      const response = await fetch(`${API_BASE_URL}/ai/builder/getPageSelector`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectors: gwSelectors }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Page Selectors:", data); // Log fetched selectors

      // Clear previous content based on custom_selector value
      data.forEach(item => {
        const element = document.querySelector(item.id);
        if (element) {
          if (item.custom_selector) {
            element.textContent = ""; // Clear content directly for custom selectors
            console.log(`Cleared content for custom selector: ${item.id}`);
          } else {
            const targetNode = element.children[0]?.children[1] || element.children[0]?.children[0];
            if (targetNode) {
              targetNode.textContent = ""; // Clear content of last child
              console.log(`Cleared content for last child: ${item.id}`);
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
    try {
      const response = await fetch(`${API_BASE_URL}/ai/builder/streamcontent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
          let completeData = result.substring(0, endIndex);
          const selectorData = processedSelectors[currentIndex];
          console.log(
            `Updating selector ${selectorData.id} with data:`,
            completeData
          );
          await typeEffect(selectorData, completeData);
          scrollToElement(selectorData.id);
          currentIndex = (currentIndex + 1) % processedSelectors.length;
          result = result.substring(endIndex + 1);
        }
      }

      // Send the entire HTML content to the parent window
      const pageContent = document.documentElement.outerHTML;
      window.parent.postMessage({
        type: "generatedContent",
        pageName: window.location.pathname.split("/").pop(), // Extract the page name from the URL
        content: pageContent,
        isGenerating: false,
      }, "*");

    } catch (error) {
      console.error("Streaming data error:", error.message);
    } finally {
      isFetching = false;
    }
  }

  async function typeEffect(selectorData, content) {
    const element = document.querySelector(selectorData.id);
    if (!element) {
      console.log(`Element with selector "${selectorData.id}" not found.`);
      return;
    }

    // Log the element before updating
    console.log("Element before update:", element.outerHTML);

    let targetNode;
    if (selectorData.custom_selector) {
      targetNode = element;
    } else {
      targetNode = element.children[0]?.children[1] || element.children[0]?.children[0]; // Target the specified structure
    }

    if (!targetNode) {
      console.log(`Target node not found for selector: ${selectorData.id}`);
      return;
    }

    const textNode = targetNode.childNodes[0];
    if (textNode) {
      textNode.nodeValue = ""; // Clear the existing text content
      for (let i = 0; i < content.length; i++) {
        textNode.nodeValue += content.charAt(i);
        await new Promise((resolve) => setTimeout(resolve, 0)); // Typing speed delay
      }
    } else {
      const newText = document.createTextNode("");
      targetNode.appendChild(newText);
      for (let i = 0; i < content.length; i++) {
        newText.nodeValue += content.charAt(i);
        await new Promise((resolve) => setTimeout(resolve, 0)); // Typing speed delay
      }
    }

    // Log the element after updating
    console.log("Element after update:", element.outerHTML);
  }

  function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  window.addEventListener("message", async function (event) {
    if (event.data.type === "start") {
      const gwSelectors = getAllGWSelectors();
      const processedSelectors = await fetchPageSelectors(gwSelectors);

      fetchStreamContent({
        business_name: "ajay",
        template_name: event.data.templateName,
        services_provided: event.data.description || "At Ajay's restaurant, we offer a diverse menu of authentic Indian cuisine that caters all tastes and preferences. From fragrant and flavorful curries to tandoori specialties and rich biryanis, our menu showcases the vibrant and delicious flavors of India. Our skilled chefs use traditional cooking techniques and quality ingredients to create dishes that are truly unforgettable.In addition to our delectable food offerings, we also provide top-notch customer service in a warm and inviting atmosphere. Whether you are looking to enjoy a cozy dinner with loved ones or host a special celebration, Ajay's restaurant is the perfect setting for any occasion.Come experience the best of Indian cuisine at Ajay's restaurant, where every dish tells a story and every bite is a culinary delight. Join us for a memorable dining experience that will keep you more.",
        customer_steps: "customer needs to visit the website",
        website_category: "restaurant",
        page_name: event.data.pageName,
        selectors: gwSelectors, // Use original selectors
      }, processedSelectors);
    }
  });
});
</script>










<script>
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("message", (event) => {
    if (event.data.type === "changeFont" || event.data.type === "changeGlobalColors") {
      updateCSSVariables(event.data);
    }
  });

  function updateCSSVariables(data) {
    if (data.type === "changeFont") {
      updateCSSVariable('--e-global-typography-primary-font-family', data.font);
      loadGoogleFont(data.font);
    } else if (data.type === "changeGlobalColors") {
      updateCSSVariable('--e-global-color-primary', data.primaryColor);
      updateCSSVariable('--e-global-color-secondary', data.secondaryColor);
    }
  }

  function updateCSSVariable(variable, value) {
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules || sheet.rules) {
          if (rule.style && rule.style.getPropertyValue(variable)) {
            rule.style.setProperty(variable, value);
            return true;
          }
        }
      } catch (e) {
        continue;
      }
    }
    return false;
  }

  function loadGoogleFont(font) {
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, "+")}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = font;
    document.documentElement.style.setProperty("--gw-primary-font", `${font} !important`);
  }
});


</script>



































<script>
  window.addEventListener("message", (event) => {
    if (event.data.type === "changeLogo") {
      updateLogo(event.data.logoUrl);
    }
  });

  function updateLogo(logoUrl) {
    const logoElement = document.querySelector("#template-logo > div > div > a > div > div > img");
    if (logoElement) {
      logoElement.src = logoUrl;
      logoElement.srcset = `${logoUrl} 1x, ${logoUrl} 2x`;
      logoElement.sizes = "(max-width: 319px) 100vw, 319px";
    } else {
      console.warn("Logo element not found.");
    }
  }
</script>





<script>
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
  document.body.style.transform = `translateY(-${document.body.scrollHeight - window.innerHeight}px)`;
}
function stopScrolling() {
  document.body.style.transform = `translateY(${document.body.getBoundingClientRect().top}px)`;
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

</script>

 <script>
    window.addEventListener("message", function (event) {
      if (event.data.type === "startProcessing") {
        processIds();
      }
    });

    function processIds() {
      const elements = document.querySelectorAll('[id^="gw"]');
      const results = [];

      elements.forEach((el) => {
        const lastChild = el.querySelector(':scope > *:last-child');
        if (lastChild) {
          if (lastChild.tagName.toLowerCase() !== 'style') {
            console.log("last child", lastChild.textContent);
            results.push({
              selector: el.id,
              text: lastChild.textContent
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
        const yPosition = 10 + (index * 10);
        doc.text(`Selector: ${item.selector}`, 10, yPosition);
        doc.text(`Text: ${item.text}`, 10, yPosition + 5);
        doc.text(`Console Log: last child ${item.text}`, 10, yPosition + 10);
      });

      doc.save("results.pdf");
    }
  </script>



<script>
  // Function to handle incoming messages
  window.addEventListener("message", function(event) {
    // Check the message type
    if (event.data.type === "changeLogo") {
      const logoUrl = event.data.logoUrl;
      // Find the logo element and update its attributes
      const logoElement = document.querySelector("#template-logo > div > div > a > div > div > img");
		console.log("logo element:",logoElement);
      if (logoElement) {
        logoElement.src = logoUrl;
        logoElement.srcset = `${logoUrl} 319w, ${logoUrl} 300w`;
        logoElement.sizes = "(max-width: 319px) 100vw, 319px";
      } else {
        console.warn("Logo element not found.");
      }
    }
  });
</script>


<script>
  window.addEventListener('message', function(event) {
    if (event.data === 'fetchGWIDs') {
      const elements = document.querySelectorAll('[id^="gw"]');
      const idsAndContent = Array.from(elements).map(el => ({
        id: el.id,
        content: el.innerHTML
      }));
      window.parent.postMessage({ type: 'gwIDs', idsAndContent }, '*');
    }
  });
</script>

