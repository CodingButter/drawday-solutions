export const faviconPaths = {
  favicon16: "/favicons/favicon-16x16.png",
  favicon32: "/favicons/favicon-32x32.png",
  favicon: "/favicons/favicon.png",
} as const;

export const getFaviconPath = (type: keyof typeof faviconPaths): string => {
  return faviconPaths[type];
};
