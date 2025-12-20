import React from 'react';
import 'antd/dist/reset.css';
import ReactDOM from 'react-dom/client';
import { SWRConfig, cache } from 'swr';
import App from './App.jsx';
import fetcher from './utils/fetcher.js';
import { DISABLE_API_CALLS } from './utils/axiosInstance.js';
import './index.css';

// Disabled fetcher that prevents all API calls
const disabledFetcher = async (url) => {
  console.warn('API calls are disabled. Request blocked for:', url);
  return Promise.resolve(null);
};

// Clear SWR cache if API calls are disabled
if (DISABLE_API_CALLS) {
  cache.clear();
}

// Global SWR configuration to prevent excessive API calls and reduce server load
const swrConfig = {
  fetcher: DISABLE_API_CALLS ? disabledFetcher : fetcher,
  // Disable automatic refresh to prevent unnecessary API calls
  refreshInterval: 0,
  // Disable revalidation on focus to prevent API calls when user switches tabs
  revalidateOnFocus: false,
  // Disable revalidation on reconnect to prevent API calls when network reconnects
  revalidateOnReconnect: false,
  // Disable revalidation on mount to prevent using cached data
  revalidateOnMount: false,
  // Increase dedupe window to 10 seconds to prevent duplicate requests
  // This is critical when multiple components use the same hook
  dedupingInterval: 5000,
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
  // Remove success logging in production to reduce console spam
  // onSuccess: (data, key) => {
  //   console.log("SWR Success for key:", key);
  // },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SWRConfig value={swrConfig}>
      <App />
    </SWRConfig>
  </React.StrictMode>
);
