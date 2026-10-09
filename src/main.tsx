import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary fallbackTitle="AuraPredict System Recovery">
          <App />
        </ErrorBoundary>
      </StrictMode>,
    );
  }
} catch (err: any) {
  console.error('[AuraPredict Root Render Error]:', err);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020617; color: #f8fafc; font-family: system-ui, sans-serif; padding: 20px; text-align: center;">
        <h2 style="font-size: 1.4rem; color: #f43f5e; margin-bottom: 8px;">AuraPredict Initialization Error</h2>
        <p style="color: #94a3b8; max-width: 420px; font-size: 0.85rem; margin-bottom: 20px;">${err?.message || 'A browser runtime interruption occurred.'}</p>
        <button onclick="if(window.auraClearCacheAndReset){window.auraClearCacheAndReset()}else{location.reload(true)}" style="padding: 10px 20px; background: #10b981; color: #020617; font-weight: bold; border-radius: 8px; border: none; cursor: pointer;">
          Clear Cache & Reset
        </button>
      </div>
    `;
  }
}
