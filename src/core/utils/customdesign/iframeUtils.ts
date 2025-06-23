export const sendNonClickable = (): void => {
  const iframe = document.getElementById("myIframe") as HTMLIFrameElement;

  iframe.contentWindow?.postMessage(
    {
      type: "nonClickable",
      transdiv: `<div id="overlay" style="position:fixed;width: 100vw;height: 100vh;z-index: 1000000;top: 0;left: 0;"></div>`,
    },
    "*"
  );
};
