import React from 'react';
import 'antd/dist/reset.css';
import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import App from './App.jsx';
import fetcher from './utils/fetcher.js';
import './index.css';

// Global SWR configuration to prevent excessive API calls and reduce server load
const swrConfig = {
  fetcher,
  // Disable automatic refresh to prevent unnecessary API calls
  refreshInterval: 0,
  // Disable revalidation on focus to prevent API calls when user switches tabs
  revalidateOnFocus: false,
  // Disable revalidation on reconnect to prevent API calls when network reconnects
  revalidateOnReconnect: false,
  // Revalidate on mount - this is fine now because hooks conditionally disable fetching
  revalidateOnMount: true,
  // Increase dedupe window to 10 seconds to prevent duplicate requests
  // This is critical when multiple components use the same hook
  dedupingInterval: 10000,
  // Retry failed requests with exponential backoff
  errorRetryInterval: 5000,
  errorRetryCount: 3,
  // Keep data fresh for 5 minutes before considering it stale
  focusThrottleInterval: 5000,
  // Disable loading timeout
  loadingTimeout: 0,
  // Global error handler
  onError: (error, key) => {
    console.error('SWR Error:', error, 'for key:', key);
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SWRConfig value={swrConfig}>
      <App />
    </SWRConfig>
  </React.StrictMode>
);
