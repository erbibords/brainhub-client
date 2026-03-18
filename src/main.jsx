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
  // Enable revalidation on focus with throttling to refresh stale data when user returns
  revalidateOnFocus: true,
  // Throttle focus revalidation to prevent excessive calls
  focusThrottleInterval: 5000,
  // Enable revalidation on reconnect to refresh data when network reconnects
  revalidateOnReconnect: true,
  // Revalidate on mount - this is fine now because hooks conditionally disable fetching
  revalidateOnMount: true,
  // Increase dedupe window to 10 seconds to prevent duplicate requests
  // This is critical when multiple components use the same hook
  dedupingInterval: 10000,
  // Retry failed requests with exponential backoff
  errorRetryInterval: 5000,
  errorRetryCount: 3,
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
