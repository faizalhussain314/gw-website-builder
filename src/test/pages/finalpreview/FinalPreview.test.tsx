// /**
//  * @file FinalPreview.test.tsx
//  */
// import React from "react";
// import { render, screen, fireEvent, act } from "@testing-library/react";
// import { Provider } from "react-redux";
// import configureStore from "redux-mock-store";
// import thunk from "redux-thunk";
// import FinalPreview from "../../../ui/pages/finalpreview/FinalPreview";
// import { ToastContainer } from "react-toastify";

// const mockStore = configureStore([thunk]);

// describe("FinalPreview Component Tests", () => {
//   let store: any;

//   beforeEach(() => {
//     // Initialize mock store with any initial Redux state you want
//     store = mockStore({
//       userData: {
//         templateList: {
//           pages: [
//             {
//               title: "Home",
//               slug: "home",
//               iframe_url: "http://example.com/home",
//             },
//             {
//               title: "About Us",
//               slug: "about",
//               iframe_url: "http://example.com/about",
//             },
//           ],
//           id: 123,
//         },
//         font: "",
//         color: { primary: "", secondary: "" },
//         logo: "",
//         logoWidth: 150,
//         description1: "Business description",
//         description2: "Step description",
//         businessName: "MyBusiness",
//         contactform: {
//           email: "test@example.com",
//           phoneNumber: "1234567890",
//           address: "123 Test Street",
//         },
//       },
//       user: {
//         wp_token: "fake_wp_token",
//       },
//     });
//     jest.clearAllMocks();
//   });

//   test("renders the component and checks basic text", () => {
//     render(
//       <Provider store={store}>
//         <FinalPreview />
//         <ToastContainer />
//       </Provider>
//     );

//     // Check that the heading "Website Preview" appears
//     expect(screen.getByText(/Website Preview/i)).toBeInTheDocument();

//     // Check that the "Back" button is rendered
//     expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
//   });

//   test("opens the popup and triggers page generation flow", () => {
//     render(
//       <Provider store={store}>
//         <FinalPreview />
//         <ToastContainer />
//       </Provider>
//     );

//     // The "Generate Page" popup typically shows if you click some button
//     // that sets `setShowPopup(true)`.
//     // For demonstration, let's assume there's a "Generate this Page" button
//     // or a step that triggers it:

//     // 1) Confirm that the popup is initially not in the DOM
//     expect(screen.queryByText(/Generate this Page/i)).not.toBeInTheDocument();

//     // 2) Suppose there's a "Generate" button in the UI that sets `showPopup`.
//     //    We'll click it:
//     const someGenerateButton = screen.getByRole("button", {
//       name: /Generate/i,
//     });
//     fireEvent.click(someGenerateButton);

//     // 3) Now the popup should appear
//     expect(screen.getByText(/Generate this Page/i)).toBeInTheDocument();

//     // 4) Let's click on "Generate this Page" inside the popup
//     const generatePageBtn = screen.getByText(/Generate this Page/i);
//     fireEvent.click(generatePageBtn);

//     // We can test that an action was dispatched, or a loader was shown, etc.
//     // Or that a toast is triggered. For example:
//     // expect(some mock or store action).toHaveBeenCalled();
//   });

//   test("iframe is rendered with correct src and receives messages", async () => {
//     // Spy on window.addEventListener to test we set up message event
//     const addEventListenerSpy = jest.spyOn(window, "addEventListener");
//     // Spy on postMessage
//     const postMessageSpy = jest.spyOn(window, "postMessage");

//     render(
//       <Provider store={store}>
//         <FinalPreview />
//       </Provider>
//     );

//     // We expect an iframe to be in the DOM. By default, it might show the first page's iframe_url
//     const iframe = screen.getByTitle("website") as HTMLIFrameElement;
//     expect(iframe).toBeInTheDocument();
//     expect(iframe.src).toContain("http://example.com/home");

//     // We can also check that the message event is set up
//     expect(addEventListenerSpy).toHaveBeenCalledWith(
//       "message",
//       expect.any(Function)
//     );

//     // If you want to test sending a message to the iframe, you'd do something like:
//     act(() => {
//       // The component might do `iframeRef.current.contentWindow.postMessage(...)`.
//       // We can't fully simulate `contentWindow`, but we can check that the method is invoked.
//       window.postMessage({ type: "testMessage" }, "*");
//     });

//     expect(postMessageSpy).toHaveBeenCalledWith({ type: "testMessage" }, "*");
//   });

//   test("displays loader while content is generating", () => {
//     // If the component shows a loader (e.g., <GwLoader />) while generating,
//     // we can confirm it appears. We'll artificially set the store or state to reflect that.
//     store = mockStore({
//       userData: {
//         templateList: { pages: [], id: 123 },
//         // ...
//       },
//       user: { wp_token: "fake_wp_token" },
//     });

//     render(
//       <Provider store={store}>
//         <FinalPreview />
//       </Provider>
//     );

//     // Suppose the loader has an alt text or test ID "gw-loader"
//     // or a text "Loading..." – check whichever is in your code
//     const loaderElement = screen.queryByTestId("gw-loader");
//     // In the real code, you’d set isContentGenerating or showGwLoader to true, e.g.:
//     // setShowGwLoader(true);
//     // Then test:
//     // expect(loaderElement).toBeInTheDocument();
//     // Or if it's not generating, the loader might not appear:
//     expect(loaderElement).not.toBeInTheDocument();
//   });
// });
