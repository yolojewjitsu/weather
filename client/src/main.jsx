import React from 'react';
import ReactDOM from 'react-dom/client'; // изменено на 'react-dom/client'
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // изменено
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
