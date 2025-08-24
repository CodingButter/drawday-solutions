export const logoPaths = {
  svg: "/logos/logo.svg",
} as const;

export const getLogoPath = (type: keyof typeof logoPaths): string => {
  return logoPaths[type];
};
