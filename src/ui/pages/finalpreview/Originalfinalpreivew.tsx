// import React, { useState, useEffect, useRef } from "react";
// import GravityWriteLogo from "../../../assets/logo.svg";
// import MenuIcon from "../../../assets/menu.svg";
// import TabletMacIcon from "@mui/icons-material/TabletMac";
// import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
// import CachedIcon from "@mui/icons-material/Cached";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";
// import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
// import popupimg from "../../../assets/popupimg.svg";
// import CloseIcon from "@mui/icons-material/Close";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import UpgradePopup from "../../component/UpgradePopup";
// import { Link, useNavigate } from "react-router-dom";
// import useIframeMessage from "../../../hooks/useIframeMessage";
// import { ChangeLogoMessage } from "../../../types/iframeMessages.type";

// type Page = {
//   name: string;
//   status: string;
//   slug: string;
// };

// type GeneratedContent = {
//   template: string;
//   pages: {
//     [pageName: string]: {
//       content: { [selector: string]: string };
//     };
//   };
//   style: {
//     primaryColor: string;
//     secondaryColor: string;
//     fontFamily: string;
//   };
// };

// type IframeContent = {
//   content: string;
// }[];

// function FinalPreview() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [viewMode, setViewMode] = useState("desktop");
//   const businessName = useSelector(
//     (state: RootState) => state.userData.businessName
//   );
//   const Description = useSelector(
//     (state: RootState) => state.userData.description1
//   );
//   const templateName: string = useSelector(
//     (state: RootState) => state.userData.templatename
//   );
//   const fontFamily = useSelector((state: RootState) => state.userData.font);
//   const Color = useSelector((state: RootState) => state.userData.color);
//   const [selectedPage, setSelectedPage] = useState<string | null>("Home");
//   const [temLoader, setTemLoader] = useState(false);
//   const [_loading, setLoading] = useState(true); // Set initial loading state to true
//   const [originalPrompts, setOriginalPrompts] = useState<any>({});
//   const logoUrl = useSelector((state: RootState) => state.userData.logo);
//   const [pages, setPages] = useState<Page[]>([
//     { name: "Home", status: "", slug: "home" },
//     { name: "About Us", status: "", slug: "about" },
//     { name: "Services", status: "", slug: "service" },
//     { name: "Blog", status: "", slug: "blog" },
//     { name: "Contact", status: "", slug: "contact" },
//   ]);
//   const [pageContents, setPageContents] = useState<any>({});
//   const [showPopup, setShowPopup] = useState(false);
//   const [isContentGenerating, setIsContentGenerating] = useState(false);
//   const [previousClicked, setPreviousClicked] = useState(false);
//   const navigate = useNavigate();
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const { sendMessage, sendMessageToIframe } = useIframeMessage(iframeRef);

//   const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
//     template: "plumber",
//     pages: {},
//     style: {
//       primaryColor: "",
//       secondaryColor: "",
//       fontFamily: "",
//     },
//   });

//   const [regenerateCount, setRegenerateCount] = useState(0);
//   const [showUpgradePopup, setShowUpgradePopup] = useState(false);
//   const [iframeContent, setIframeContent] = useState<IframeContent>([]);
//   const [showIframe, setShowIframe] = useState(true);
//   const [iframeSrc, setIframeSrc] = useState<string>("");

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleViewChange = (mode: string) => {
//     setViewMode(mode);
//     setIsOpen(false);
//   };

//   const sendMessageToChild = (
//     type: string,
//     templateName: string,
//     pageName: string
//   ) => {
//     const iframe = iframeRef.current;
//     const message = {
//       type: type,
//       templateName: templateName,
//       pageName: pageName,
//     };
//     setTemLoader(false);
//     setLoading(false); // Show loading animation
//     if (iframe && iframe.contentWindow) {
//       console.log("data sent to iframe", message);
//       iframe.contentWindow.postMessage(message, "*");
//     }
//   };

//   const changeLogo = (logoUrl: string) => {
//     const message: ChangeLogoMessage = { type: "changeLogo", logoUrl };
//     sendMessageToIframe(message);
//   };

//   const handleRegenerate = () => {
//     setRegenerateCount(regenerateCount + 1);
//     // setShowUpgradePopup(true);

//     if (selectedPage) {
//       const currentPage = pages.find((page) => page.name === selectedPage);
//       if (currentPage) {
//         sendMessageToChild({
//           type: "regenerate",
//           templateName: "plumber",
//           pageName: currentPage.slug,
//         });
//         setShowIframe(true);
//       }
//     }
//   };

//   const onLoadMsg = () => {
//     const iframe = iframeRef.current;
//     const currentPage = pages.find((page) => page.name === selectedPage);

//     if ((Color.primary && Color.secondary) || fontFamily) {
//       if (iframe && iframe.contentWindow) {
//         iframe.contentWindow.postMessage(
//           { type: "changeFont", font: fontFamily },
//           "*"
//         );
//         iframe.contentWindow.postMessage(
//           {
//             type: "changeGlobalColors",
//             primaryColor: Color.primary,
//             secondaryColor: Color.secondary,
//           },
//           "*"
//         );
//       }
//     }
//     if (logoUrl) {
//       changeLogo(logoUrl);
//     }
//     if (selectedPage === "Home" && pages[0].status !== "Generated") {
//       if (iframe && iframe.contentWindow) {
//         iframe.contentWindow.postMessage(
//           {
//             type: "start",
//             templateName: "plumber",
//             pageName: currentPage?.slug,
//             description: Description,
//           },
//           "*"
//         );
//       }
//     }
//   };

//   const togglePage = (page: string) => {
//     setSelectedPage(selectedPage === page ? null : page);
//     setShowPopup(true);
//   };

//   const handlePageNavigation = (action: "next" | "skip") => {
//     if (isContentGenerating) {
//       toast.warn("Please wait until the full page generation is complete.");
//       return;
//     }

//     const currentPageIndex = pages.findIndex(
//       (page) => page.name === selectedPage
//     );
//     if (currentPageIndex !== -1) {
//       // Save current page content
//       if (action === "next") {
//         const iframe = iframeRef.current;
//         iframe?.contentWindow?.postMessage({ type: "saveContent" }, "*");
//       }

//       // Update page status
//       const updatedPages = [...pages];
//       if (action === "next") {
//         updatedPages[currentPageIndex].status = "Generated";
//       } else if (action === "skip") {
//         updatedPages[currentPageIndex].status = "Skipped";
//         setShowPopup(true);
//       }

//       // Navigate to the next page
//       const nextPageIndex = currentPageIndex + 1;
//       if (nextPageIndex < updatedPages.length) {
//         setSelectedPage(updatedPages[nextPageIndex].name);
//         setPages(updatedPages);

//         // Change iframe source to next page if "Next" button is clicked
//         if (action === "next") {
//           const iframe: null | HTMLIFrameElement = iframeRef.current;
//           const nextPageSlug = updatedPages[nextPageIndex].slug;
//           if (iframe) {
//             iframe.src = `https://tours.mywpsite.org/${nextPageSlug}`;
//           }

//           // Show popup for non-Home pages
//           if (updatedPages[nextPageIndex].name !== "Home") {
//             setShowPopup(true);
//           }

//           // Change border color of the previous button
//           if (currentPageIndex === 0) {
//             setPreviousClicked(true);
//           }
//         }
//       }
//     }
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   const handleGeneratePage = () => {
//     setShowPopup(false);
//     const currentPage = pages.find((page) => page.name === selectedPage);
//     if (currentPage && currentPage.status !== "Generated") {
//       sendMessageToChild({
//         type: "start",
//         templateName: "plumber",
//         pageName: currentPage.slug,
//       });
//       const updatedPages = [...pages];
//       updatedPages.find((page) => page.name === currentPage.name)!.status =
//         "Generated";
//       setPages(updatedPages);
//     }
//   };

//   const handlePrevious = () => {
//     if (!previousClicked && !isContentGenerating) {
//       navigate("/custom-design");
//       return;
//     } else if (!previousClicked) {
//       toast.warn("wait until content generation");
//     }

//     const currentPageIndex = pages.findIndex(
//       (page) => page.name === selectedPage
//     );
//     if (currentPageIndex > 0) {
//       const prevPageIndex = currentPageIndex - 1;
//       setSelectedPage(pages[prevPageIndex].name);

//       const iframe = iframeRef.current;
//       const prevPageSlug = pages[prevPageIndex].slug;
//       if (iframe) {
//         iframe.src = `https://tours.mywpsite.org/${prevPageSlug}`;
//       }
//       setShowIframe(true);
//     }
//   };

//   const handleNext = () => {
//     handlePageNavigation("next");
//   };

//   const handleSkipPage = () => {
//     handlePageNavigation("skip");
//   };

//   const handleImportSelectedPage = async () => {
//     const filteredContent = {
//       ...generatedContent,
//       pages: Object.keys(generatedContent.pages)
//         .filter((pageName) =>
//           pages.some(
//             (page) => page.slug === pageName && page.status === "Generated"
//           )
//         )
//         .reduce((obj, key) => {
//           obj[key] = generatedContent.pages[key];
//           return obj;
//         }, {}),
//     };

//     try {
//       const response = await fetch("http://localhost", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(filteredContent),
//       });
//       const result = await response.text();
//       console.log("Response from server:", result);
//     } catch (error) {
//       console.error("Error importing pages:", error);
//     }
//   };

//   useEffect(() => {
//     const receiveMessage = (event: MessageEvent) => {
//       if (event.data.type === "storePrompts") {
//         setOriginalPrompts(event.data.prompts);
//       } else if (event.data.type === "contentLoaded") {
//         setLoading(false); // Hide loading animation when content is loaded
//         setTemLoader(false);
//       } else if (event.data.type === "saveContentResponse") {
//         setPageContents((prevContents) => ({
//           ...prevContents,
//           [selectedPage!]: event.data.content,
//         }));
//       } else if (event.data.type === "generationStatus") {
//         setIsContentGenerating(event.data.isGenerating);
//       } else if (event.data.type === "generatedContent") {
//         setGeneratedContent((prevContent) => ({
//           ...prevContent,
//           pages: {
//             ...prevContent.pages,
//             [event.data.pageName]: {
//               content: event.data.content,
//             },
//           },
//           style: {
//             primaryColor: Color.primary,
//             secondaryColor: Color.secondary,
//             fontFamily: fontFamily,
//           },
//         }));
//         if (!event.data.isGenerating) {
//           toast.success("Content generation complete!");
//         }
//       }
//     };

//     window.addEventListener("message", receiveMessage);
//     return () => {
//       window.removeEventListener("message", receiveMessage);
//     };
//   }, [Color, fontFamily, selectedPage]);

//   useEffect(() => {
//     const receiveMessage = (event: MessageEvent) => {
//       if (event.data.type === "contentReady") {
//         const iframeHtmlContent: string = event.data.content;

//         console.log("event", event.data.content);

//         setIframeContent((prevContent) => [
//           ...prevContent,
//           { content: iframeHtmlContent },
//         ]);

//         // Convert the HTML content to a Blob URL
//         const blob = new Blob([iframeHtmlContent], { type: "text/html" });
//         const url = URL.createObjectURL(blob);
//         setIframeSrc(url);

//         console.log("iframeContent:", iframeHtmlContent);
//       }
//     };

//     window.addEventListener("message", receiveMessage);
//     return () => {
//       window.removeEventListener("message", receiveMessage);
//     };
//   }, []);

//   useEffect(() => {
//     const iframe = iframeRef.current;
//     if (iframe) {
//       iframe.addEventListener("load", onLoadMsg);
//     }
//     return () => {
//       if (iframe) {
//         iframe.removeEventListener("load", onLoadMsg);
//       }
//     };
//   }, [Color, fontFamily, logoUrl, selectedPage]);

//   useEffect(() => {
//     if (fontFamily && Color.primary && Color.secondary) {
//       const iframe = iframeRef.current;
//       if (iframe && iframe.contentWindow) {
//         iframe.contentWindow.postMessage(
//           { type: "changeFont", font: fontFamily },
//           "*"
//         );
//         iframe.contentWindow.postMessage(
//           {
//             type: "changeGlobalColors",
//             primaryColor: Color.primary,
//             secondaryColor: Color.secondary,
//           },
//           "*"
//         );
//       }
//     }
//   }, [fontFamily, Color]);

//   return (
//     <div className="h-screen flex font-[inter] w-screen">
//       <div className="w-[23%] lg:w-[30%]">
//         <aside className="z-10 fixed">
//           <div className="bg-white min-h-screen w-[23vw] lg:w-[30vw] z-10 border-2">
//             <div className="flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
//               <img
//                 src={GravityWriteLogo}
//                 alt="gravity write logo"
//                 className="h-10 p-2 rounded-md cursor-pointer hover:bg-palatinate-blue-50"
//               />
//               <div className="relative border-gray-100 group flex items-center justify-between py-4 border-b cursor-pointer pr-7 ps-3 sidebar-header">
//                 <img
//                   src={MenuIcon}
//                   alt="menu"
//                   className="w-5 h-auto group hidden"
//                 />
//               </div>
//             </div>
//             <div className="p-4 w-full flex flex-col justify-center">
//               <div className="flex items-center justify-between">
//                 {" "}
//                 <h1 className="text-xl leading-6 pb-2 mt-4 font-bold">
//                   Website Preview
//                 </h1>
//                 <Link to={"/custom-design"}>
//                   <button className="bg-button-bg-secondary p-2 rounded-md text-sm">
//                     Back
//                   </button>
//                 </Link>
//               </div>
//               <span className="text-sm text-[#88898A] font-light">
//                 Preview your website’s potential with our interactive
//                 demonstration.
//               </span>
//             </div>
//             <div className="p-4 w-full flex flex-col justify-center">
//               <div className="p-4">
//                 <h2 className="text-lg font-semibold">
//                   Select Pages to Import (
//                   {pages.findIndex((page) => page.name === selectedPage) + 1}/
//                   {pages.length})
//                 </h2>
//                 <div className="mt-4">
//                   {pages.map((page) => (
//                     <div
//                       key={page.name}
//                       className={`rounded-lg p-3 mb-2  ${
//                         selectedPage === page.name
//                           ? "border-palatinate-blue-500 border-2 bg-palatinate-blue-50"
//                           : ""
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <div className="custom-checkbox">
//                             <input
//                               type="checkbox"
//                               className="mr-2"
//                               checked={
//                                 selectedPage === page.name ||
//                                 page.status === "Generated"
//                               }
//                               onChange={() => togglePage(page.name)}
//                             />
//                           </div>
//                           <span className="font-medium">{page.name}</span>
//                         </div>
//                         <div className="flex items-center">
//                           {page.status && (
//                             <span
//                               className={`ml-2 text-xs rounded-2xl px-2 ${
//                                 page.status === "Generated"
//                                   ? "text-green-700 bg-green-200"
//                                   : "text-black bg-[#FFDCD5]"
//                               }`}
//                             >
//                               {page.status}
//                             </span>
//                           )}
//                           {(page.status === "Generated" ||
//                             selectedPage === page.name) && (
//                             <CachedIcon
//                               className={`ml-2 text-gray-500 cursor-pointer ${
//                                 isContentGenerating &&
//                                 page.name === selectedPage
//                                   ? "animate-spin"
//                                   : ""
//                               }`}
//                               onClick={handleRegenerate}
//                             />
//                           )}

//                           {selectedPage === page.name ? (
//                             <ExpandLessIcon
//                               className="ml-2 text-gray-500 cursor-pointer"
//                               onClick={() => togglePage(page.name)}
//                             />
//                           ) : (
//                             <ExpandMoreIcon
//                               className="ml-2 text-gray-500 cursor-pointer"
//                               onClick={() => togglePage(page.name)}
//                             />
//                           )}
//                         </div>
//                       </div>
//                       {selectedPage === page.name && (
//                         <div className="mt-3 flex justify-evenly text-sm">
//                           {page.name === "Home" ? (
//                             <>
//                               <button
//                                 className={`bg-blue-600 text-white rounded px-3 py-1 ${
//                                   isContentGenerating ? "opacity-50" : ""
//                                 }`}
//                                 onClick={handleNext}
//                                 disabled={isContentGenerating}
//                               >
//                                 Keep & Next
//                               </button>
//                               <button
//                                 className={`bg-white text-black rounded px-3 py-1 ${
//                                   isContentGenerating ? "opacity-50" : ""
//                                 }`}
//                                 onClick={handleSkipPage}
//                                 disabled={isContentGenerating}
//                               >
//                                 Skip Page
//                               </button>
//                             </>
//                           ) : page.status === "Generated" ? (
//                             <>
//                               <button
//                                 className={`bg-blue-600 text-white rounded px-3 py-1 ${
//                                   isContentGenerating ? "opacity-50" : ""
//                                 }`}
//                                 onClick={handleNext}
//                                 disabled={isContentGenerating}
//                               >
//                                 Keep & Next
//                               </button>
//                               <button
//                                 className={`bg-white text-black rounded px-3 py-1 ${
//                                   isContentGenerating ? "opacity-50" : ""
//                                 }`}
//                                 onClick={handleSkipPage}
//                                 disabled={isContentGenerating}
//                               >
//                                 Skip Page
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button
//                                 className="bg-palatinate-blue-600 text-white rounded px-3 py-1"
//                                 onClick={() => setShowPopup(true)}
//                               >
//                                 Generate Page
//                               </button>
//                               <button
//                                 className="bg-white text-black rounded px-3 py-1"
//                                 onClick={handleSkipPage}
//                               >
//                                 Skip Page
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}

//                   <div className="flex flex-col items-center justify-center absolute bottom-0 w-[80%] mb-4">
//                     <div className="mb-4 w-full flex justify-between">
//                       <button
//                         className={`w-full py-3 px-6 rounded-md mr-2 border-2 ${
//                           previousClicked
//                             ? "border-palatinate-blue-500 text-palatinate-blue-500"
//                             : "border-[#88898A] text-[#88898A]"
//                         }`}
//                         onClick={handlePrevious}
//                       >
//                         Previous
//                       </button>
//                       <button
//                         className={`bg-white w-full text-palatinate-blue-500 border-palatinate-blue-500 border-2 py-3 px-8 rounded-md ${
//                           isContentGenerating ? "opacity-50" : ""
//                         }`}
//                         onClick={handleNext}
//                         disabled={isContentGenerating}
//                       >
//                         Next
//                       </button>
//                     </div>
//                     <button
//                       className={`tertiary w-full text-white py-3 px-8 rounded-md mb-4 ${
//                         pages.every(
//                           (page) =>
//                             page.status === "Generated" ||
//                             page.status === "Skipped"
//                         )
//                           ? "opacity-100"
//                           : "opacity-50"
//                       }`}
//                       onClick={handleImportSelectedPage}
//                       disabled={
//                         !pages.every(
//                           (page) =>
//                             page.status === "Generated" ||
//                             page.status === "Skipped"
//                         )
//                       }
//                     >
//                       Import Selected Page
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </aside>
//       </div>
//       <div className="w-[80%] flex-last bg-[#F9FCFF] overflow-x-hidden relative">
//         <main className="px-12">
//           {showPopup && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//               <div className="bg-white rounded-lg shadow-lg text-center absolute">
//                 <div className="absolute right-0">
//                   <CloseIcon
//                     className="top-0 m-2 cursor-pointer"
//                     onClick={handleClosePopup}
//                   />
//                 </div>
//                 <div className="py-8 px-12">
//                   <img
//                     src={popupimg}
//                     alt="Generate Page"
//                     className="mb-2 mx-auto"
//                   />
//                   <button
//                     className="tertiary px-[30px] py-[10px] text-lg sm:text-sm text-white mt-8 sm:mt-2 rounded-md"
//                     onClick={handleGeneratePage}
//                   >
//                     Generate this Page
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//           {showUpgradePopup && (
//             <UpgradePopup
//               onClose={() => setShowUpgradePopup(false)}
//               alertType="regenerate"
//             />
//           )}
//           <div className="relative inline-block text-left my-4 flex justify-between">
//             <div>
//               <div>
//                 <button
//                   type="button"
//                   className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
//                   id="menu-button"
//                   aria-expanded={isOpen}
//                   aria-haspopup="true"
//                   onClick={toggleDropdown}
//                 >
//                   {viewMode === "desktop" && (
//                     <PersonalVideoIcon className="mr-2" />
//                   )}
//                   {viewMode === "tablet" && <TabletMacIcon className="mr-2" />}
//                   {viewMode === "mobile" && (
//                     <PhoneIphoneIcon className="mr-2" />
//                   )}
//                   {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
//                   <svg
//                     className="-mr-1 ml-2 h-5 w-5"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               </div>

//               {isOpen && (
//                 <div
//                   className="origin-top-left absolute left-0 mt-2 cursor-pointer rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
//                   role="menu"
//                   aria-orientation="vertical"
//                   aria-labelledby="menu-button"
//                 >
//                   <div className="py-1" role="none">
//                     <a
//                       className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
//                       role="menuitem"
//                       onClick={() => handleViewChange("desktop")}
//                     >
//                       <PersonalVideoIcon className="mr-2" />
//                       Desktop
//                     </a>
//                     <a
//                       className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
//                       role="menuitem"
//                       onClick={() => handleViewChange("tablet")}
//                     >
//                       <TabletMacIcon className="mr-2" />
//                       Tablet
//                     </a>
//                     <a
//                       className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
//                       role="menuitem"
//                       onClick={() => handleViewChange("mobile")}
//                     >
//                       <PhoneIphoneIcon className="mr-2" />
//                       Mobile
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div>
//               <div className="flex items-center space-x-4">
//                 <button
//                   className="text-gray-500"
//                   onClick={() => setShowIframe(true)}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="2"
//                     stroke="currentColor"
//                     className="w-5 h-5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//                 <span className="text-gray-500">
//                   {selectedPage
//                     ? `${
//                         pages.findIndex((page) => page.name === selectedPage) +
//                         1
//                       }/${pages.length}`
//                     : ""}
//                 </span>
//                 <button
//                   className="text-gray-500"
//                   onClick={() => setShowIframe(true)}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="2"
//                     stroke="currentColor"
//                     className="w-5 h-5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   className="flex items-center px-4 py-2 gap-1 bg-[#EBF4FF] text-black rounded"
//                   onClick={handleRegenerate}
//                 >
//                   <CachedIcon />
//                   Regenerate page
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="w-full h-screen flex justify-center">
//             {showIframe ? (
//               <iframe
//                 ref={iframeRef}
//                 src={`https://tours.mywpsite.org/${
//                   pages.find((page) => page.name === selectedPage)?.slug
//                 }`}
//                 title="website"
//                 id="myIframe"
//                 onLoad={onLoadMsg}
//                 className={`h-full transition-fade shadow-lg rounded-lg ${
//                   viewMode === "desktop"
//                     ? "w-full h-full"
//                     : viewMode === "tablet"
//                     ? "w-2/3 h-full"
//                     : "w-1/3 h-full"
//                 }`}
//               ></iframe>
//             ) : (
//               <iframe
//                 src={iframeSrc}
//                 title="stored-content"
//                 className={`h-full transition-fade shadow-lg rounded-lg ${
//                   viewMode === "desktop"
//                     ? "w-full h-full"
//                     : viewMode === "tablet"
//                     ? "w-2/3 h-full"
//                     : "w-1/3 h-full"
//                 }`}
//               />
//             )}
//           </div>
//         </main>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

// export default FinalPreview;

{
  /* <script>
document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "https://dev.gravitywrite.com/api";
  let currentIndex = 0;
  let isFetching = false;
  let originalSelectors = [];
  let oldnewcontent = {}; // Object to store old and new content

  function getAllGWSelectors() {
    const elements = document.querySelectorAll("[id^='gw']");
    originalSelectors = Array.from(elements).map((element) => `#${element.id}`);
    return originalSelectors;
  }

  async function fetchPageSelectors(gwSelectors) {
    if (isFetching) return [];
    isFetching = true;
    window.parent.postMessage({
      type: "generationStatus",
      isGenerating: true
    }, "*");

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

      // Collect and store old content before clearing
      data.forEach(item => {
        const element = document.querySelector(item.id);
        if (element) {
          const oldContent = element.textContent || ""; // Collect old content
          if (item.custom_selector) {
            oldnewcontent = { ...oldnewcontent, [oldContent]: "" };
            element.textContent = ""; // Clear content directly for custom selectors
          } else {
            const targetNode = element.children[0]?.children[1] || element.children[0]?.children[0];
            if (targetNode) {
              const targetContent = targetNode.textContent || "";
              oldnewcontent = { ...oldnewcontent, [targetContent]: "" };
              targetNode.textContent = ""; // Clear content of last child
            } else {
              const defaultContent = element.textContent || "";
              oldnewcontent = { ...oldnewcontent, [defaultContent]: "" };
              element.textContent = ""; // Clear content directly if no targetNode found
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
          await typeEffect(selectorData, completeData);
          scrollToElement(selectorData.id);
          currentIndex = (currentIndex + 1) % processedSelectors.length;
          result = result.substring(endIndex + 1);
        }
      }

      // After collecting all new content, update the oldnewcontent object
      processedSelectors.forEach(item => {
        const element = document.querySelector(item.id);
        if (element) {
          let targetNode;
          if (item.custom_selector) {
            targetNode = element;
          } else {
            targetNode = element.children[0]?.children[1] || element.children[0]?.children[0];
          }

          if (targetNode && targetNode.nodeName.toLowerCase() !== "style") { // Exclude <style> tags
            const newContent = targetNode.textContent || ""; // Collect new content
            const oldContent = Object.keys(oldnewcontent).find(key => oldnewcontent[key] === ""); // Find the matching old content
            if (oldContent) {
              oldnewcontent[oldContent] = newContent; // Update oldnewcontent with new content
            }
          }
        }
      });

      // Send the entire old and new content to the parent window
      window.parent.postMessage({
        type: "oldNewContent",
        pageName: window.location.pathname.split("/").pop(), // Extract the page name from the URL
        content: oldnewcontent,
      }, "*");

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
      window.parent.postMessage({
        type: "generationStatus",
        isGenerating: false
      }, "*");
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
      targetNode = element.children[0]?.children[1] || element.children[0]?.children[0]; // Target the specified structure
    }

    if (!targetNode) {
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
      const gwSelectors = getAllGWSelectors();
      const processedSelectors = await fetchPageSelectors(gwSelectors);

      fetchStreamContent({
        business_name: event.data.bussinessname ||"ajay",
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
</script> */
}
