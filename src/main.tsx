import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import toast from 'react-hot-toast';

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  toast.error('An unexpected network or async error occurred.', { id: 'unhandled-rejection' });
});

window.addEventListener('error', (event) => {
  // Prevent default to avoid some browser crash logs, but we let ErrorBoundary handle React errors.
  // This listener catches non-React global errors.
  console.error('Global Error Caught:', event.error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
