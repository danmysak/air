import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);
