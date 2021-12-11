import React, { Component } from "react";
//import screenshot from "../../images/screenshot.png";
import pastOrders from "../../images/pastOrders.png";
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
import {Button} from "react-bootstrap";
import {API, Auth} from "aws-amplify";

interface HomeProps {
    isAuthenticated: boolean;
    isSetup: boolean;
}

interface HomeState {
    isLoading: boolean;
    obligations: Obligation[];
}

interface Obligation {
    periodKey: string;
    start: string;
    end: string;
    due: string;
    status: string;
    received: string;
}


export default class Home extends Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);

        //alert("Home Loading");
        this.state = {
            isLoading: true,
            obligations: []
        };
    }

    async componentDidMount() {

        //alert("Home Mounted");
        if (!this.props.isAuthenticated) {
            return;
        }

        //TODO - Make a call to the back end to try and get the obligations.  If there are tokens available in DynamoDB
        // then make the request.  If there aren't then redirect to MMRC's login page

        try {
            //const orders = await this.listOrders();
            //this.setState({
            //    orders: orders,
            //    isLoading: false
            //});
            const obligations = await this.listObligations();
            alert("Response: "+obligations.responseCode+" , Obligations: " +obligations.obligations);
            console.log("Response: "+obligations.responseCode+" , Obligations: " +obligations.obligations);

            //TODO - Check a return para here and if appropriate load the obligations
            // If the tokens can't be loaded then either the VAT number needs to be setup or the tokens aren't valid
            // Route as appropriate

            this.setState( {isLoading: false, obligations: obligations.obligations})
        } catch (e) {
            console.log("Failed: "+e.response)
            alert("Failed: "+e.response);
        }
    }

    listObligations() {
        const myInit = { // OPTIONAL
            //headers: {}, // OPTIONAL
            //response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            //body: {},
            queryStringParameters: {  // OPTIONAL
            },
        };
        //TODO - This is only a note - remember never pass a body (even an empty one) for a GET request or API Gateway
        // will intercept it before it gets to Lambda and all you'll get back is a CORS error as there will be no
        // access-control-allow-origin: * set by the proxy
        return API.get("apihmrcvatobligations", "/vatobligations", myInit);
    }

    /*
    onRedirectButtonClick() = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.setState({ loading: true });

        try {
            await Auth.signIn(this.state.email, this.state.password);
            this.props.userHasAuthenticated(true);
            this.setState({ redirect: true })
        } catch (e) {
            alert(e.message);
            this.setState({ loading: false });
        }
    }
    */

    renderLanding() {
        return (
            <div className="lander">
                <h1>VAT Returns</h1>
                <hr />
                <p>This is a This is the Pamero VAT Returner <a href="https://github.com/aws-samples/aws-bookstore-demo-app" target="_blank">github repository</a>.</p>
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
                <div className="white-box">
                    <h3>Obligations</h3>
                    <hr />
                </div>
                {!this.state.isLoading && this.state.obligations
                    //{/*.sort((obligation1, obligation2) => obligation1.start - obligation2.start) */}
                    //TODO Move this to the VAT Obligations page
                    .map( obligation =>
                        <div className="obligations" key={obligation.periodKey}>
                            <h5>{`Period Key: ${obligation.periodKey}`}</h5>
                            <h5>{`Due: ${obligation.due}`}</h5>
                            <h5>{`Start: ${obligation.start}`}</h5>
                            <h5>{`End: ${obligation.end}`}</h5>
                            <h5>{`Status: ${obligation.status}`}</h5>
                            <h5>{`Received: ${obligation.received}`}</h5>
                            {/*
                                {order.books.map((book) => <PurchasedProductRow order={book} key={book.bookId} />)}
                                */}
                        </div>)
                }
                <div className="well-bs col-md-12 ad-container-padding">
                    <div className="col-md-4 ad-padding">
                        <div className="container-category no-padding">
                            <LinkContainer to="/past">
                                <img src={pastOrders} alt="Past returns"></img>
                            </LinkContainer>
                            {/*
                            <Button
                                size="lg"
                                type="submit"
                                onClick={onRedirectButtonClick} Redirect to HMRC>
                            </Button>
                            */}
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