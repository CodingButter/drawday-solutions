// Extension configuration
// Determines whether to use local development or production URLs

// Check if we're in development by looking at the manifest
// Production extensions have an update_url field
const manifest = chrome.runtime.getManifest();
const isDevelopment = !manifest.update_url || import.meta.env?.DEV;

export const WEBSITE_URL = isDevelopment 
  ? 'http://localhost:3000' 
  : 'https://drawday.app';

export const IFRAME_URLS = {
  options: `${WEBSITE_URL}/live-spinner/options`,
  spinner: `${WEBSITE_URL}/live-spinner/spinner`,
};