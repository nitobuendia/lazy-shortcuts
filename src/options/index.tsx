/** @file Options view. Main UI for the extenion. */

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { OptionsPage } from '@app/options/options_page';
import '@app/options/options.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <OptionsPage />
  </StrictMode>
);
