export const getDomainFromEndpoint = (endpoint: string): string => {
  const currentUrl = window.location.href;
  const wpAdminIndex = currentUrl.indexOf("/wp-admin");

  if (wpAdminIndex !== -1) {
    const baseUrl = currentUrl.substring(0, wpAdminIndex);
    return `${baseUrl}/${endpoint}`;
  } else {
    return `https://top-taillon-nov7.zipwp.dev/${endpoint}`;
  }
};