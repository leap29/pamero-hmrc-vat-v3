import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
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

Amplify.configure(awsmobile);
/*
Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: "books",
                endpoint: config.apiGateway.API_URL,
                region: config.apiGateway.REGION
            },
            {
                name: "cart",
                endpoint: config.apiGateway.API_URL,
                region: config.apiGateway.REGION
            },
            {
                name: "orders",
                endpoint: config.apiGateway.API_URL,
                region: config.apiGateway.REGION
            },
            {
                name: "search",
                endpoint: config.apiGateway.API_URL,
                region: config.apiGateway.REGION
            },
            {
                name: "recommendations",
                endpoint: config.apiGateway.API_URL,
                region: config.apiGateway.REGION
            },
            {
                name: "bestsellers",
                endpoint: config.apiGateway.API_URL,
                region: config.apiGateway.REGION
            }
        ]
    }
});
*/
ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);
//registerServiceWorker();
reportWebVitals();
