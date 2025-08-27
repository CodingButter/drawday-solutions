import React from 'react';
import ReactDOM from 'react-dom/client';
import './app.css';

// Get the website URL - in production this would be your deployed website
const WEBSITE_URL = import.meta.env.PROD 
  ? 'https://drawday.app' // Replace with your production URL
  : 'http://localhost:3000';

function SidePanelIframe() {
  return (
    <div className="w-full h-screen bg-background">
      <iframe
        src={`${WEBSITE_URL}/live-spinner/spinner`}
        className="w-full h-full border-0"
        allow="clipboard-write; clipboard-read"
        title="DrawDay Spinner"
      />
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <SidePanelIframe />
    </React.StrictMode>
  );
}