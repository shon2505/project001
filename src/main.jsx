import React from 'react';
import ReactDOM from 'react-dom/client';
import TradingViewWidget from './components/TradingViewWidget';
import './index.css'; // ✅ this applies global styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TradingViewWidget />
  </React.StrictMode>
);

