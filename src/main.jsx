import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import SharedView from './pages/SharedView.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Creator view — home page */}
        <Route path="/" element={<App />} />
        {/* Shared plan view — the link you drop in group chat */}
        <Route path="/p/:slug" element={<SharedView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
