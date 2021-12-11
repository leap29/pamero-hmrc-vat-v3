import React, { Component } from "react";
//import { CategoryNavBar } from "../category/categoryNavBar/CategoryNavBar";
//import { SearchBar } from "../search/searchBar/SearchBar";
//import "../../common/hero/hero.css";
//import { PurchasedProductRow } from "./PurchasedProductRow";
import { Auth, API } from "aws-amplify";
//import bestSellers from "../../images/bestSellers.png";
//import yourshoppingcart from "../../images/yourshoppingcart.png";
//import { Order } from "../cart/CartProductRow";

interface PastPurchasesProps {}

interface Purchases {
    orderDate: number;
    orderId: string;
    //books: Order[];
}

interface PastPurchasesState {
    userInfo: any; // FIXME
    isLoading: boolean;
    orders: Purchases[];
}

export default class PastPurchases extends Component<PastPurchasesProps, PastPurchasesState> {
    constructor(props: PastPurchasesProps) {
        super(props);

        this.state = {
            userInfo: null,
            isLoading: true,
            orders: []
        };
    }

    async componentDidMount() {
        const userInfo = await Auth.currentUserInfo();
        this.setState({ userInfo })

        try {
            //const orders = await this.listOrders();
            //this.setState({
            //    orders: orders,
            //    isLoading: false
            //});
            const returns = await this.listReturns();
            alert("Worked: "+returns.response);
            console.log("Worked: "+returns.authCodeURL);
            window.location.href = returns.authCodeURL;
        } catch (e) {
            console.log("Failed: "+e.response)
            alert("Failed: "+e.response);
        }
    }

    listOrders() {
        return API.get("orders", "/orders", null);
    }

    listReturns() {
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
        return API.get("apihmrcgetauthurl", "/hmrcbuildauthurl", myInit);
    }

    getPrettyDate = (orderDate: number) => {
        const date = new Date(orderDate);
        return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
    }

    render() {
        return (
            <div className="Category">
                {/*
                <SearchBar />
                <CategoryNavBar />
                */}
                <div className="well-bs col-md-12">
                    {this.state.userInfo && <div className="white-box no-margin-top">
                        <h3>{`Hello ${this.state.userInfo.attributes.email}!`}</h3>
                    </div>}
                    <div className="white-box">
                        <h3>Past purchases</h3>
                    </div>
                    {!this.state.isLoading && this.state.orders && this.state.orders
                        .sort((order1, order2) => order2.orderDate - order1.orderDate)
                        .map(order =>
                            <div className="order-date" key={order.orderId}>
                                <h4>{`Order date: ${this.getPrettyDate(order.orderDate)}`}</h4>
                                {/*
                                {order.books.map((book) => <PurchasedProductRow order={book} key={book.bookId} />)}
                                */}
                            </div>)
                    }
                </div>
{/*}
                    <div className="well-bs no-margin-top no-padding col-md-12">
                        <a href="/best"><img src={bestSellers} alt="Best sellers" className="checkout-img no-padding" /></a>
                        <a href="/cart"><img src={yourshoppingcart} alt="Shopping cart" className="checkout-img no-padding" /></a>
                    </div>
*/}
            </div>
        );
    }
}