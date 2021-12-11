import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import "./home.css";
import {API, Auth} from "aws-amplify";

interface HMRCRedirectProps {
    isAuthenticated: boolean;
}

interface HMRCRedirectState {
    userInfo: any;
    isLoading: boolean;
    accessToken: string;
    refreshToken: string;
    grantedScope: string;
    expiresIn: string;
//    tokens: Tokens;
}


export default class HMRCRedirect extends Component<HMRCRedirectProps, HMRCRedirectState> {
    constructor(props: HMRCRedirectProps) {
        super(props);

        this.state = {
            isLoading: true,
            userInfo: null,
            accessToken: "",
            refreshToken: "",
            grantedScope: "",
            expiresIn: "",
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            alert("Query String: "+window.location.search.substring(1));
            const queryString = window.location.search.substring(1);
            const authCode = queryString.split("=")[1];
            alert("Auth Code: "+authCode);
            const tokens = await this.getTokens(authCode);
            alert("Tokens= access: "+tokens.accessToken+", refresh: "+tokens.refreshToken+", granted: "+tokens.grantedScope+", expiresIn: "+tokens.expiresIn);
            console.log("Tokens= access: "+tokens.accessToken+", refresh: "+tokens.refreshToken+", granted: "+tokens.grantedScope+", expiresIn: "+tokens.expiresIn);
            this.setState({ isLoading: false, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, grantedScope: tokens.grantedScope, expiresIn: tokens.expiresIn });
        } catch (e) {
            console.log("Failed: "+e.error)
            alert("Failed: "+e.error);
        }

        this.setState({ isLoading: false } );
    }

    getTokens(authCode: string) {
        const myInit = { // OPTIONAL
            //headers: {}, // OPTIONAL
            //response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            body: {
                //queryStringParameters: {  // OPTIONAL
                "authCode": authCode
            },
        };
        return API.post("hmrcauth", "/hmrcauth", myInit);
    }


    renderLanding() {
        return (
            <div className="lander">
                <h1>VAT Returns</h1>
                <hr />
                <p>This is a sample application demonstrating how different types of databases and AWS services can work together to deliver a delightful user experience.  In this bookstore demo, users can browse and search for books, view recommendations, see the leaderboard, view past orders, and more.  You can get this sample application up and running in your own environment and learn more about the architecture of the app by looking at the <a href="https://github.com/aws-samples/aws-bookstore-demo-app" target="_blank">github repository</a>.</p>
                <div className="button-container col-md-12">
                    <LinkContainer to="/signup">
                        <a href="/signup">Sign up to Pamero VAT Returner</a>
                    </LinkContainer>
                </div>
            </div>);
    }


    renderTokens() {
        return (
            <div className="tokens">
                <h1>Tokens</h1>
                <hr />
                <div className="well-bs col-md-12">
                    {!this.state.isLoading && <div className="white-box no-margin-top">
                        <h4>{`Auth Token: ${this.state.accessToken}`}</h4>
                        <h4>{`Refresh Token: ${this.state.refreshToken}`}</h4>
                        <h4>{`Granted Scope: ${this.state.grantedScope}`}</h4>
                        <h4>{`Expires In: ${this.state.expiresIn}`}</h4>
                        {/*
                        <h4>{`Hello Response: ${this.state.helloResponse}`}</h4>
                        */}
                    </div>}
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="home">
                {this.props.isAuthenticated ? this.renderTokens() : this.renderLanding()}
            </div>
        );
    }
}