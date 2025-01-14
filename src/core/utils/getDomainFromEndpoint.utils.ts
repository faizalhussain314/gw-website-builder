export const getDomainFromEndpoint = (endpoint: string): string => {
  const currentUrl = window.location.href;
  const wpAdminIndex = currentUrl.indexOf("/wp-admin");

  if (wpAdminIndex !== -1) {
    const baseUrl = currentUrl.substring(0, wpAdminIndex);
    return `${baseUrl}/${endpoint}`;
  } else {
    return `http://localhost/wordpress/${endpoint}`;
    // return `https://plugin.mywpsite.org/${endpoint}`;
  }
};
