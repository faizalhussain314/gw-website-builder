import { useCallback } from "react";

const useDomainEndpoint = () => {
  const getDomainFromEndpoint = useCallback((endpoint: string) => {
    const currentUrl = window.location.href;
    const wpAdminIndex = currentUrl.indexOf("/wp-admin");

    if (wpAdminIndex !== -1) {
      const baseUrl = currentUrl.substring(0, wpAdminIndex);
      return `${baseUrl}/${endpoint}`;
    } else {
      console.error("Could not find wp-admin in the current URL.");
      // const tempurl = `https://uncomfortable-umar-ygho.zipwp.link/${endpoint}`;
      // return tempurl;
    }
  }, []);

  return { getDomainFromEndpoint };
};

export default useDomainEndpoint;