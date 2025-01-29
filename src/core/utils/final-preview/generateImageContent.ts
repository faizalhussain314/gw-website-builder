export const generateImageContent = () => {
  // Find the first element with an ID starting with "gw-"
  const section = document.querySelector('[id^="gw-"]') as HTMLElement;

  if (!section) {
    console.error(`No element found with ID starting with "gw-"`);
    return null;
  }

  const result: Array<{ type: string; selector: string; content: string }> = [];

  // Recursive function to generate a unique CSS selector for each element
  const getSelector = (element: HTMLElement | null): string => {
    if (!element || element === section || element.tagName === "HTML") {
      return "";
    }

    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : "";
    const classes = element.className
      ? `.${element.className.trim().split(/\s+/).join(".")}`
      : "";

    let siblingIndex = 1; // Find the element's index among its siblings
    let sibling = element;
    while ((sibling = sibling.previousElementSibling as HTMLElement)) {
      if (sibling.tagName === element.tagName) {
        siblingIndex++;
      }
    }

    const nthChild =
      siblingIndex > 1 || element.nextElementSibling
        ? `:nth-of-type(${siblingIndex})`
        : "";

    return `${getSelector(
      element.parentElement
    )} > ${tag}${id}${classes}${nthChild}`;
  };

  // Collect all images and their selectors
  const images = section.querySelectorAll("img");
  images.forEach((img) => {
    const imageSelector = getSelector(img as HTMLElement);
    result.push({
      type: "image",
      selector: imageSelector.trim(),
      content: img.src,
    });
  });

  // Collect all text elements and their selectors
  const textElements = section.querySelectorAll(
    "*:not(img):not(script):not(style)"
  );
  textElements.forEach((el) => {
    const textContent = el.textContent?.trim();
    if (textContent) {
      const textSelector = getSelector(el as HTMLElement);
      result.push({
        type: "text",
        selector: textSelector.trim(),
        content: textContent,
      });
    }
  });

  return result;
};
