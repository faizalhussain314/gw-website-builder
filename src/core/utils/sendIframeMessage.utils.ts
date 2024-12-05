export const sendIframeMessage = (type: string, payload) => {
  const iframes = document.getElementsByTagName("iframe");

  if (iframes.length > 0) {
    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes[i];

      if (
        type === "changeGlobalColors" &&
        (payload.primary || payload.secondary)
      ) {
        iframe?.contentWindow?.postMessage(
          {
            type: "changeGlobalColors",
            primaryColor: payload.primary,
            secondaryColor: payload.secondary,
          },
          "*"
        );
      }

      if (type === "bussinessName") {
        iframe?.contentWindow?.postMessage(
          { type: "businessName", text: payload },
          "*"
        );
      }

      if (type === "changeFont" && payload.font) {
        iframe?.contentWindow?.postMessage(
          {
            type: "changeFont",
            font: payload.font,
          },
          "*"
        );
      }

      if (type === "changeLogo" && payload.logoUrl) {
        iframe?.contentWindow?.postMessage(
          {
            type: "changeLogo",
            logoUrl: payload.logoUrl,
          },
          "*"
        );
      }
      if (type === "changeLogoSize" && payload.size) {
        console.log("iframe triggered for size", payload.size);

        iframe?.contentWindow?.postMessage(
          {
            type: "changeLogoSize",
            size: payload.size,
          },
          "*"
        );
      }
    }
  } else {
    console.log("No iframes found");
  }
};
