import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import { store, persistor } from './store.js';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import ErrorBoundary from './utils/ErrorBoundary.js';
import { ConfigProvider } from './contexts/ConfigContext.js';
import { AppProvider } from './contexts/AppContext.js';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <HelmetProvider>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
              <ConfigProvider>
                <AppProvider>
                  <App />
                </AppProvider>
              </ConfigProvider>
            </ErrorBoundary>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
