// Extension configuration
// Uses environment variables to determine the correct website URL

// Get the website URL from Vite environment variables
// This will be set during build time based on the environment
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:3004';

// For debugging (disabled for production)
// console.log('Extension environment:', import.meta.env.VITE_ENV);
// console.log('Extension using website URL:', WEBSITE_URL);

export const IFRAME_URLS = {
  options: `${WEBSITE_URL}/live-spinner/options`,
  spinner: `${WEBSITE_URL}/live-spinner/spinner`,
};
