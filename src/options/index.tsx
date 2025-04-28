/** @file Options view. Main UI for the extenion. */

import React from 'react';
import ReactDOM from 'react-dom/client';
import OptionsApp from '@app/options/OptionsApp';
import '@app/options/options.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>
);
