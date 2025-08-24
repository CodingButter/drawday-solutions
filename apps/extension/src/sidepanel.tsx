import React from 'react';
import ReactDOM from 'react-dom/client';
import { SidePanel } from './pages/SidePanel';
import AuthGuard from './components/auth/AuthGuard';
// import { getStorageEnvironment } from '@raffle-spinner/storage';
import './app.css';

// Check if we're in development mode
// const _isWebMode = getStorageEnvironment() === 'web';
// const _isDevelopment = import.meta.env.DEV;

// In development web mode, you can disable auth by setting this to false
const REQUIRE_AUTH = true; // Set to false to bypass auth in development

// Sidepanel mounting...

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AuthGuard requireAuth={REQUIRE_AUTH}>
        <SidePanel />
      </AuthGuard>
    </React.StrictMode>
  );
}
