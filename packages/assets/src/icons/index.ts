export const iconPaths = {
  icon16: "/icons/icon-16.png",
  icon32: "/icons/icon-32.png",
  icon48: "/icons/icon-48.png",
  icon128: "/icons/icon-128.png",
  iconOriginal: "/icons/icon-original.png",
} as const;

export const getIconPath = (size: keyof typeof iconPaths): string => {
  return iconPaths[size];
};
