import React from 'react';
import ReactDOM from 'react-dom/client';
import { OptionsPage } from './pages/OptionsPage';
import AuthGuard from './components/auth/AuthGuard';
import { getStorageEnvironment } from '@raffle-spinner/storage';
import './app.css';

// Check if we're in development mode
const isWebMode = getStorageEnvironment() === 'web';
const isDevelopment = import.meta.env.DEV;

// In development web mode, you can disable auth by setting this to false
const REQUIRE_AUTH = true; // Set to false to bypass auth in development

console.log('Options page mounting...', {
  isWebMode,
  isDevelopment,
  requireAuth: REQUIRE_AUTH,
});

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AuthGuard requireAuth={REQUIRE_AUTH}>
        <OptionsPage />
      </AuthGuard>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
}
