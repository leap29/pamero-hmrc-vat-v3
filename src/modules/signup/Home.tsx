import React, { Component } from "react";
//import screenshot from "../../images/screenshot.png";
import pastOrders from "../../images/pastorders.png";
//import bestSellers from "../../images/bestSellers.png";
//import yourshoppingcart from "../../images/yourshoppingcart.png";
//import { Hero } from "../../common/hero/Hero";
//import { CategoryNavBar } from "../category/categoryNavBar/CategoryNavBar";
//import { SearchBar } from "../search/searchBar/SearchBar";
//import { BestSellersBar } from "../bestSellers/bestSellersBar/BestSellersBar";
//import { CategoryGalleryTeaser } from "../category/CategoryGalleryTeaser";
//import { FriendsBought } from "../friends/FriendsBought";
import { LinkContainer } from "react-router-bootstrap";
import "./home.css";

interface HomeProps {
    isAuthenticated: boolean;
}

interface HomeState {
    isLoading: boolean;
}

export default class Home extends Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);

        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        this.setState({ isLoading: false });
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

    renderHome() {
        return (
            <div className="bookstore">
                {/*
                <Hero />
                <SearchBar />
                <CategoryNavBar />
                <BestSellersBar />
                */}
                <div className="well-bs col-md-12 ad-container-padding">
                    <div className="col-md-4 ad-padding">
                        <div className="container-category no-padding">
                            <LinkContainer to="/past">
                                <img src={pastOrders} alt="Past returns"></img>
                            </LinkContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderHome() : this.renderLanding()}
            </div>
        );
    }
}