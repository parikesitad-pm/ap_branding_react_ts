/**
 * Afrizal Pramudyan Portfolio
 *
 * crafted with <3 by parikesitad-pm
 * https://github.com/parikesitad-pm
 *
 * a MODULA project
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/theme.css';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
