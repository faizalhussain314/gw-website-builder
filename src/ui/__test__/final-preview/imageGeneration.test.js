// imageGeneration.test.js
import { handleImageGeneration } from "./imageGeneration";

// A helper to flush pending promise callbacks.
const flushPromises = () => new Promise(setImmediate);

describe("Image Generation Process", () => {
  beforeEach(() => {
    // Reset DOM and globals before each test.
    document.body.innerHTML = "";
    global.API_BASE_URL = "https://api.gravitywrite.com/api";
    global.imageUrlData = {}; // mapping of old to new image URLs
    global.stylePrompt = "test-style-prompt";
    // Set up a dummy apiResponseData global variable.
    global.apiResponseData = {
      data: [
        {
          selector: "#testImage",
          content: [], // No extra content for this test
          isbackgroundimage: false,
        },
      ],
    };
    // Mock window.parent.postMessage to spy on calls.
    window.parent.postMessage = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should update non-background image element with new image URL", async () => {
    // Set up a dummy image element with an initial src.
    document.body.innerHTML = `<img id="testImage" src="original.jpg" />`;

    const eventData = {
      page_name: "Home",
      business_name: "Test Business",
      template_name: "Test Template",
      services_provided: "Test Services",
      customer_steps: "Test Steps",
      website_category: "Test Category",
      template_id: "123",
    };

    // Mock fetch to return a new image URL.
    const newImageUrl = "https://newimage.url/new.jpg";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: { image_urls: [newImageUrl] },
      }),
    });

    // Call the image generation function.
    handleImageGeneration("dummyToken", eventData);

    // Wait for all asynchronous operations to finish.
    await flushPromises();

    // The element should have been temporarily set to the loader URL then updated.
    const imageElement = document.querySelector("#testImage");
    expect(imageElement.src).toBe(newImageUrl);
    expect(imageElement.srcset).toBe(newImageUrl);

    // Check that the global mapping was updated:
    expect(global.imageUrlData["#testImage"]).toEqual({
      "original.jpg": newImageUrl,
    });

    // Verify that window.parent.postMessage was called with the generated content messages.
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "generatedContent",
        pageName: "Home",
        isGenerating: false,
      }),
      "*"
    );
    expect(window.parent.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "oldNewImages",
        pageName: "Home",
        images: global.imageUrlData,
        isGenerating: false,
      }),
      "*"
    );
  });

  test("should update background image element with new image URL", async () => {
    // For a background image element, create a dummy div with an inline background image.
    document.body.innerHTML = `<div id="testDiv" style="background-image: url('original-bg.jpg');"></div>`;

    // Update the global apiResponseData to indicate a background image.
    global.apiResponseData = {
      data: [
        {
          selector: "#testDiv",
          content: [],
          isbackgroundimage: true,
        },
      ],
    };

    // For simplicity, we mock getBackgroundImageFromElement to return the inline URL.
    // (In your actual tests, you might import and spy on the real implementation.)
    const originalGetBg = global.getBackgroundImageFromElement;
    global.getBackgroundImageFromElement = jest.fn(() => "original-bg.jpg");

    const eventData = {
      page_name: "Home",
      business_name: "Test Business",
      template_name: "Test Template",
      services_provided: "Test Services",
      customer_steps: "Test Steps",
      website_category: "Test Category",
      template_id: "123",
    };

    // Mock fetch to return a new background image URL.
    const newBgUrl = "https://newimage.url/new-bg.jpg";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: { image_urls: [newBgUrl] },
      }),
    });

    // Call the image generation function.
    handleImageGeneration("dummyToken", eventData);

    await flushPromises();

    const divElement = document.querySelector("#testDiv");
    // Check that the div's style.backgroundImage was updated.
    expect(divElement.style.backgroundImage).toBe(`url(${newBgUrl})`);
    // And that the mapping was updated correctly.
    expect(global.imageUrlData["#testDiv"]).toEqual({
      "original-bg.jpg": newBgUrl,
    });

    // Restore any mocked globals.
    global.getBackgroundImageFromElement = originalGetBg;
  });
});
