import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './app/layout/styles.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './app/stores/store';
import ScrollToTop from './app/layout/ScrollToTop';
import "./app/common/i18n/i18n";
import { createBrowserHistory } from 'history';


// Create the root element for React 18
const container = document.getElementById('root');
const root = createRoot(container as HTMLElement);
export const history = createBrowserHistory();

// Render the application
root.render(
  <StoreContext.Provider value={store}>
    <BrowserRouter>
        <ScrollToTop />
        <App />
    </BrowserRouter>
  </StoreContext.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
