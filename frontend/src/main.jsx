import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Provider } from 'react-redux';
import configureStore from './store/store';
import { restoreCSRF, csrfFetch } from './store/csrf';

import * as sessionActions from './store/session';
import { Modal, ModalProvider } from './context/Modal';
import { BrowserRouter } from 'react-router-dom';


const store = configureStore();

if(process.env.NODE_ENV !== 'production') {
  restoreCSRF();

  window.sessionActions = sessionActions; //

  window.csrfFetch = csrfFetch;
  window.store = store;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store} >
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>

);
