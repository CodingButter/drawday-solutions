export * from "./icons";
export * from "./logos";
export * from "./favicons";

import icon16 from "./icons/icon-16.png";
import icon32 from "./icons/icon-32.png";
import icon48 from "./icons/icon-48.png";
import icon128 from "./icons/icon-128.png";
import iconOriginal from "./icons/icon-original.png";
import logo from "./logos/logo.svg";
import favicon16 from "./favicons/favicon-16x16.png";
import favicon32 from "./favicons/favicon-32x32.png";
import favicon from "./favicons/favicon.png";

export const assets = {
  icons: {
    icon16,
    icon32,
    icon48,
    icon128,
    iconOriginal,
  },
  logos: {
    svg: logo,
  },
  favicons: {
    favicon16,
    favicon32,
    favicon,
  },
} as const;
