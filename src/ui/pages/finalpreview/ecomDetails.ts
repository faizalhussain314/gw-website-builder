import type {
  Dispatch,
  SetStateAction,
  RefObject, // 👈 only types – doesn't bloat bundle
} from "react";

const API_BASE_URL = "https://dev.gravitywrite.com/api";
const GENERATE_PRODUCT_ENDPOINT = `${API_BASE_URL}/ai-generateProduct`;
const GENERATE_IMAGE_ENDPOINT = `${API_BASE_URL}/ai-product-image`;
const WORDPRESS_BACKEND_ENDPOINT = "YOUR_WORDPRESS_API_ENDPOINT_HERE"; // Replace this
const BEARER_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZTg5YTg1ZC05YjhmLTQ1NGUtOWVlMC1lNzgxNTFiMzc3YWUiLCJqdGkiOiI5ZGQ4ZGI4ZmI0MzAwOGZiNjA1NWI5NmU1NTcwZDEwZTY0Yjc1MjFiNTI5YmZlNWFlZjIwZTAyM2Q2MGY2YjEwNDdkZWJkNmI4NzhmMGY5NSIsImlhdCI6MTc0NDA5MjA4OS44OTQ0MTEsIm5iZiI6MTc0NDA5MjA4OS44OTQ0MTMsImV4cCI6MTc1OTkwMzI4OS44OTIzMDUsInN1YiI6IjgwNiIsInNjb3BlcyI6W119.nzRIFNURZtSuLSW78H5LKtUL_s2h7ZmtU3YrnfmSRAA1IZzhBDgr7mLzknQuNVkOjvsSvzqWKaMilHbld4q35cFC3PajZ8uUVU-1wfGU7g7yLBiJWtrDsf2uvra8cO11Zp3SDx_OULphTMYKAMPMnxSPj9dRW80Wzlq6KUBwAxXioo4naNjeqFnu_nUprXyQ1S7AhLhG2N3-itva8vGXAN1xKf5XayKnK1gpTcnFz6B5uNJsx010YRKGqcZmU5Pt1cfTmPqaBLng0qXAT2aAocrUpuBuBtJBuv9BwOlrHnPrqWw21KkG-arFuETmAZtD2BdsgmzceDaWvERYEeX-dV_eRgcibGPxwpAW7QOdhA0goMJMsAJcQl-7Rp_a6DfiMzNPHximIf6dxgSBRV-bT3ykz9_81cgw3GjDhv2dcjg82l-bT4kgyroSyYzl1JLsT4Yge1kZi4e1PyPcBVM0cO1cYDIdZbsuInvfVje7oN66TVYdCJEila9zaSJAAfYYTSJSzyuM9YxXLmOopxmYpWgi8-XguS1rMAsunAu4Z-KyUfjnxSUVlbLmk24wIhe7mIk3QHAVw5LHQdsrAJAIl4fCfZpVsom6iAqhBTit86eL8JVIPBnK5HpPEaWRehwTRS9erw_6Cgewl9tNulM0vOU56BslYQAoq_mA2aGMULc";
const StylePrompt =
  "Warm and inviting with soft, organic shapes in mint green (#1FB68D) and gentle seafoam (#E8FBF7). Elegant yet approachable, featuring delicate patterns and natural textures with a homey sophistication";

const IMAGE_LOADER_URL = "https://plugin.mywpsite.org/white-normal.gif";

// --- TYPE DEFINITIONS ---
interface ProductSelectorSet {
  productName: string;
  productDescription: string;
  productPrice: string;
  productOriginalPrice: string;
  productImage: string;
  productCategory: string;
}

interface SelectorsConfig {
  product: ProductSelectorSet[];
}

interface ApiProductData {
  productName: string;
  productDescription: string;
  productPrice: number;
  sku: string;
  imagePrompt?: string; // imagePrompt is optional in the initial API response
  // Add any other fields from the API product object
  originalPrice?: number;
  category?: string;
}

interface ProductForWordPress extends ApiProductData {
  productIndex: number;
  imageUrl: string | null;
}

interface InitialProductPayload {
  productIndex: number;
  data: {
    productName: string;
    productDescription: string;
    productPrice: number;
    sku: string;
  };
  selectors: ProductSelectorSet;
}

interface ProductImageUpdatePayload {
  productIndex: number;
  imageUrl: string;
  selector: string;
}

interface ProductImageErrorPayload {
  productIndex: number;
  message: string;
}

// SELECTORS
const selectors: SelectorsConfig = {
  product: [
    {
      productName:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(1) > h3",
      productDescription:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(1) > .product-description-container", // Example valid selector
      productPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(1) > div.product-price > p > ins > span",
      productOriginalPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(1) > div.product-price > p > span:nth-child(4)", // This might be inside <del> too
      productImage:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(1) > div.product-thumb > a > img",
      productCategory:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(1) > div.product-category > ul > li",
    },
    {
      productName:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(2) > h3 > a",
      productDescription:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(2) > .product-description-container", // Example valid selector
      productPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(2) > div.product-price > p > span:nth-child(4)",
      productOriginalPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(2) > div.product-price > p > del > span > bdi",
      productImage:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(2) > div.product-thumb > a > img",
      productCategory:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(2) > div.product-category > ul > li > a",
    },
    // Add up to 6 or 8 as per your typical max
    {
      productName:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(3) > h3 > a",
      productDescription:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(3) > .product-description-container",
      productPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(3) > div.product-price > p > span:nth-child(4)",
      productOriginalPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(3) > div.product-price > p > del > span > bdi",
      productImage:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(3) > div.product-thumb > a > img",
      productCategory:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(3) > div.product-category > ul > li > a",
    },
    {
      productName:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(4) > h3 > a",
      productDescription:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(4) > .product-description-container",
      productPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(4) > div.product-price > p > span:nth-child(4)",
      productOriginalPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(4) > div.product-price > p > del > span > bdi",
      productImage:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(4) > div.product-thumb > a > img",
      productCategory:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(4) > div.product-category > ul > li > a",
    },
    {
      productName:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(5) > h3 > a",
      productDescription:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(5) > .product-description-container",
      productPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(5) > div.product-price > p > span:nth-child(4)",
      productOriginalPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(5) > div.product-price > p > del > span > bdi",
      productImage:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(5) > div.product-thumb > a > img",
      productCategory:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(5) > div.product-category > ul > li > a",
    },
    {
      productName:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(6) > h3 > a",
      productDescription:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(6) > .product-description-container",
      productPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(6) > div.product-price > p > span:nth-child(4)",
      productOriginalPrice:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(6) > div.product-price > p > del > span > bdi",
      productImage:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(6) > div.product-thumb > a > img",
      productCategory:
        "#ecomgw > div > div > div > div > div.filter-content > div > div:nth-child(6) > div.product-category > ul > li > a",
    },
  ],
};

export const getEcomSelectors = (): Promise<SelectorsConfig> => {
  return new Promise((resolve) => {
    const delayMs = 5_000 + Math.random() * 2_000;
    setTimeout(() => resolve(selectors), 2000);
  });
};

let iframeWindow: Window | null = null;

// const iframeElement = document.getElementById(
//   "myIframe"
// ) as HTMLIFrameElement | null;
// const iframeWindow = iframeElement?.contentWindow;
// console.log("myIframe", iframeElement);

async function fetchAIProducts(
  businessName: string,
  description: string,
  numberOfProducts: string | number
): Promise<ApiProductData[] | null> {
  const payload = {
    business_name: businessName,
    description: description,
    number_of_products:
      typeof numberOfProducts === "string"
        ? parseInt(numberOfProducts, 10)
        : numberOfProducts,
    style_prompt: StylePrompt,
  };

  try {
    const response = await fetch(GENERATE_PRODUCT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error fetching AI products:", response.status, errorData);
      iframeWindow?.postMessage(
        {
          type: "ERROR",
          payload: `Failed to fetch product details: ${response.status}`,
        },
        "*"
      );
      return null;
    }

    const result = await response.json();
    if (result.status && result.data && Array.isArray(result.data.products)) {
      return result.data.products as ApiProductData[];
    } else {
      console.error("Invalid data structure from AI products API:", result);
      iframeWindow?.postMessage(
        { type: "ERROR", payload: "Received invalid product data." },
        "*"
      );
      return null;
    }
  } catch (error) {
    console.error("Network or other error fetching AI products:", error);
    iframeWindow?.postMessage(
      { type: "ERROR", payload: `Error fetching products: ${error.message}` },
      "*"
    );
    return null;
  }
}

async function fetchAIProductImage(
  imagePrompt: string,
  productIndex: number
): Promise<string | null> {
  const payload = { prompt: imagePrompt };

  try {
    const response = await fetch(GENERATE_IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Error fetching image for product ${productIndex}:`,
        response.status,
        errorData
      );
      const errorPayload: ProductImageErrorPayload = {
        productIndex: productIndex,
        message: `Failed to load image (status ${response.status})`,
      };
      iframeWindow?.postMessage(
        { type: "PRODUCT_IMAGE_ERROR", payload: errorPayload },
        "*"
      );
      return null;
    }

    const result = await response.json();
    if (result && result.data && typeof result.data.image_url === "string") {
      return result.data.image_url;
    } else if (result && typeof result.image_url === "string") {
      return result.image_url;
    } else {
      console.error(
        `Invalid image data structure for product ${productIndex}:`,
        result
      );
      const errorPayload: ProductImageErrorPayload = {
        productIndex: productIndex,
        message: "Received invalid image data from API.",
      };
      iframeWindow?.postMessage(
        { type: "PRODUCT_IMAGE_ERROR", payload: errorPayload },
        "*"
      );
      return null;
    }
  } catch (error) {
    console.error(
      `Network or other error fetching image for product ${productIndex}:`,
      error
    );
    const errorPayload: ProductImageErrorPayload = {
      productIndex: productIndex,
      message: `Error fetching image: ${error.message}`,
    };
    iframeWindow?.postMessage(
      { type: "PRODUCT_IMAGE_ERROR", payload: errorPayload },
      "*"
    );
    return null;
  }
}

async function sendProductsToWordPress(
  productsData: ProductForWordPress[]
): Promise<boolean> {
  const finalProducts = productsData.map((p) => {
    const { imagePrompt, productIndex, ...rest } = p; // Remove internal tracking fields
    return rest;
  });

  try {
    const response = await fetch(WORDPRESS_BACKEND_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" /* Add WP auth headers */ },
      body: JSON.stringify({ products: finalProducts }),
    });

    console.log("final products", finalProducts);
    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        "Error sending data to WordPress:",
        response.status,
        errorData
      );
      iframeWindow?.postMessage(
        {
          type: "WP_SUBMIT_ERROR",
          payload: `WP Submit Failed: ${response.status}`,
        },
        "*"
      );
      return false;
    }
    const result = await response.json();
    console.log("Successfully sent data to WordPress:", result);
    iframeWindow?.postMessage(
      { type: "WP_SUBMIT_SUCCESS", payload: "Products sent to WordPress!" },
      "*"
    );
    return true;
  } catch (error) {
    console.error("Network or other error sending data to WordPress:", error);
    iframeWindow?.postMessage(
      { type: "WP_SUBMIT_ERROR", payload: `WP Submit Error: ${error.message}` },
      "*"
    );
    return false;
  }
}

// Main Orchestration Function
// Main Orchestration Function
export async function generateAndDisplayEcomProducts(
  businessName: string,
  businessDescription: string,
  numberOfProducts: string | number,
  iframeRef: RefObject<HTMLIFrameElement>, // <── the ref
  setIsLoading: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  setIsLoading(true);
  console.log("iframwindow", iframeRef, iframeWindow);
  iframeWindow = iframeRef.current?.contentWindow ?? null;
  if (!iframeWindow) {
    console.error(
      "Iframe not found or not accessible. Ensure the iframe ID is correct and the element exists."
    );
    alert("Critical Error: Iframe communication channel is not available.");
    return;
  }

  iframeWindow.postMessage({ type: "PROCESS_STARTING" }, "*");

  const productsFromAPI = await fetchAIProducts(
    businessName,
    businessDescription,
    numberOfProducts
  );

  if (!productsFromAPI || productsFromAPI.length === 0) {
    console.log("No products received from API or an error occurred.");
    iframeWindow.postMessage(
      { type: "NO_PRODUCTS", payload: "No products to display." },
      "*"
    );
    iframeWindow.postMessage({ type: "PROCESS_COMPLETE" }, "*"); // End process if no products
    return;
  }

  const { product: productSelectorsConfig } = await getEcomSelectors();
  const productsForWordPress: ProductForWordPress[] = [];

  productsFromAPI.forEach((product, index) => {
    if (index < productSelectorsConfig.length) {
      console.log(
        "productSelectorsConfig.length",
        productSelectorsConfig.length
      );
      const selectorsForProduct = productSelectorsConfig[index];

      // CORRECTED TYPE FOR initialData:
      const initialData: InitialProductPayload["data"] = {
        productName: product.productName,
        productDescription: product.productDescription,
        productPrice: product.productPrice,
        sku: product.sku,
        // originalPrice: product.originalPrice, // Uncomment if API provides and you want to send
        // category: product.category,           // Uncomment if API provides and you want to send
      };

      const messageToIframe: {
        type: "INITIAL_PRODUCT_DATA";
        payload: InitialProductPayload;
      } = {
        type: "INITIAL_PRODUCT_DATA",
        payload: {
          productIndex: index,
          data: initialData,
          selectors: selectorsForProduct,
        },
      };

      iframeWindow.postMessage(messageToIframe, "*");
      setIsLoading(false);

      iframeWindow.postMessage(
        {
          type: "PRODUCT_IMAGE_UPDATE",
          payload: {
            productIndex: index,
            imageUrl: IMAGE_LOADER_URL,
            selector: selectorsForProduct.productImage,
          } satisfies ProductImageUpdatePayload,
        },
        "*"
      );

      productsForWordPress.push({
        ...product,
        productIndex: index,
        imageUrl: null,
      });
    } else {
      console.warn(
        `Not enough selectors defined for product index ${index}. Max selectors: ${productSelectorsConfig.length}. This product will not be displayed but data might be sent to WordPress if it has an image prompt.`
      );
      productsForWordPress.push({
        ...product,
        productIndex: index,
        imageUrl: null,
      });
    }
  });

  // ... rest of the function remains the same
  let imageOperationsToComplete = 0;
  productsForWordPress.forEach((p) => {
    if (p.imagePrompt && p.productIndex < productSelectorsConfig.length) {
      imageOperationsToComplete++;
    }
  });

  let imageOperationsDone = 0;

  if (imageOperationsToComplete === 0) {
    console.log(
      "No images to fetch for the displayable products. Sending data to WordPress."
    );
    // if (productsForWordPress.length > 0) {
    //   await sendProductsToWordPress(productsForWordPress);
    // }
    iframeWindow.postMessage({ type: "PROCESS_COMPLETE" }, "*");
    return;
  }

  productsForWordPress.forEach((productData) => {
    if (
      productData.imagePrompt &&
      productData.productIndex < productSelectorsConfig.length
    ) {
      const currentProductIndex = productData.productIndex;
      const currentImageSelector =
        productSelectorsConfig[currentProductIndex].productImage;

      fetchAIProductImage(productData.imagePrompt, currentProductIndex)
        .then((imageUrl) => {
          console.log("imageUrl", imageUrl);
          if (imageUrl) {
            const updatePayload: ProductImageUpdatePayload = {
              productIndex: currentProductIndex,
              imageUrl: imageUrl,
              selector: currentImageSelector,
            };
            iframeWindow.postMessage(
              { type: "PRODUCT_IMAGE_UPDATE", payload: updatePayload },
              "*"
            );
            const productInWpArray = productsForWordPress.find(
              (p) => p.productIndex === currentProductIndex
            );
            if (productInWpArray) {
              productInWpArray.imageUrl = imageUrl;
            }
          }
        })
        .catch((error) => {
          console.error(
            `Further error handling for image of product index ${currentProductIndex} if needed:`,
            error
          );
        })
        .finally(() => {
          imageOperationsDone++;
          if (imageOperationsDone === imageOperationsToComplete) {
            console.log(
              "All image processing attempts are complete. Sending data to WordPress."
            );
            // if (productsForWordPress.length > 0) {
            //   sendProductsToWordPress(productsForWordPress).then(() => {
            //     iframeWindow.postMessage({ type: "PROCESS_COMPLETE" }, "*");
            //   });
            // } else {
            //   iframeWindow.postMessage({ type: "PROCESS_COMPLETE" }, "*");
            // }
          }
        });
    }
  });
}

// Ensure your type definitions (especially InitialProductPayload) are correctly defined as before:
// interface InitialProductPayload { // This is the type of the 'payload' object for initial data
//   productIndex: number;
//   data: {
//       productName: string;
//       productDescription: string;
//       productPrice: number;
//       sku: string;
//       originalPrice?: number; // Optional
//       category?: string;      // Optional
//   };
//   selectors: ProductSelectorSet;
// }

// Other type definitions (ProductSelectorSet, ApiProductData, ProductForWordPress, ProductImageUpdatePayload, etc.) as previously defined.

// Example Usage (ensure this is called after the DOM is ready if iframeElement is fetched immediately):
// Assuming you have input fields for these values:
// const businessName = (document.getElementById('businessNameInput') as HTMLInputElement)?.value || "GlowHaus";
// const description = (document.getElementById('descriptionInput') as HTMLInputElement)?.value || "Eco-friendly skincare.";
// const numProducts = (document.getElementById('numProductsInput') as HTMLInputElement)?.value || "8";

// document.addEventListener('DOMContentLoaded', () => {
//     const generateButton = document.getElementById('generateProductsButton');
//     if (generateButton) {
//         generateButton.addEventListener('click', () => {
//             // Fetch values from inputs when button is clicked
//             const bn = (document.getElementById('businessNameInput') as HTMLInputElement)?.value || "GlowHaus";
//             const desc = (document.getElementById('descriptionInput') as HTMLInputElement)?.value || "Eco-friendly skincare.";
//             const num = (document.getElementById('numProductsInput') as HTMLInputElement)?.value || "8";
//             if (iframeElement) { // Check if iframeElement is not null
//                 generateAndDisplayEcomProducts(bn, desc, num);
//             } else {
//                 console.error("Cannot generate products: iframe element not found.");
//                 alert("Setup error: Product display area not found.");
//             }
//         });
//     }
// });
