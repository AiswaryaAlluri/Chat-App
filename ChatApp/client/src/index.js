import React from 'react';
import ReactDOM from 'react-dom/client'; //  updated import
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//  createRoot API for React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Performance measuring
reportWebVitals();
