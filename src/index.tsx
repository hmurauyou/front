import ReactDOM from 'react-dom/client';
import {
  BrowserRouter
} from "react-router-dom";
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

import App from './components/App';
import { CartProvider } from './components/providers/CartProvider';

import './components/styles/index.css';
import global_en from './translations/en/global.json'
import global_rus from './translations/rus/global.json'
import React from 'react';


i18next.init({
  interpolation: { escapeValue: false },
  lng: "rus",
  resources: {
    en: {
      global: global_en
    },
    rus: {
      global: global_rus
    }
  }
})



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <I18nextProvider i18n={i18next}>
        <CartProvider>
          <App />
        </CartProvider>
    </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
