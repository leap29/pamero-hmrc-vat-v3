import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import Amplify from "aws-amplify";
//import config from "./config";
import awsmobile from "./aws-exports";
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

//TODO Placeholder - React.StrictMode will cause the following to load twice to help spot errors -
// -Class component constructor, render, and shouldComponentUpdate methods
// -Functions passed to useState, useMemo, or useReducer
// In PROD it doesn't have this affect.


Amplify.configure(awsmobile);

ReactDOM.render(
    /*<React.StrictMode>*/
    <Provider store={store}>
        <App />
    </Provider>
    /*}</React.StrictMode>*/,
    document.getElementById('root')
);
//registerServiceWorker();
reportWebVitals();




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
