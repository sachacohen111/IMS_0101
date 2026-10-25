import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for Mobile PWA / WebAPK installability
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[IMS Mobile] ServiceWorker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[IMS Mobile] ServiceWorker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
