import logo from './logo.svg';
import './App.css';
import { Auth } from "aws-amplify";
import React, { Component, Fragment } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Routes } from "./Routes";
/*
function App() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Hello from V2</h1>
        </header>
      </div>
  );
}

export default App;
*/


interface AppProps {
    history: any;
}

interface AppState {
    isAuthenticated: boolean;
    isAuthenticating: boolean;
}

class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true
        };

        document.title = "Bookstore Demo"
    }

    async componentDidMount() {
        try {
            //TODO Implement Auth
            if (await Auth.currentSession()) {
                this.userHasAuthenticated(true);
            }
        }
        catch(e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({ isAuthenticating: false });
    }

    userHasAuthenticated = (authenticated: boolean) => {
        this.setState({ isAuthenticated: authenticated });
    }

    handleLogout = async () => {
        await Auth.signOut();

        this.userHasAuthenticated(false);
        this.props.history.push("/login");
    }

    showLoggedInBar = () => (
        <Fragment>
            <LinkContainer to="/past">
                <NavItem><span className="orange line-height-24">Past orders</span></NavItem>
            </LinkContainer>
            <LinkContainer to="/best">
                <NavItem><span className="orange line-height-24">Best sellers</span></NavItem>
            </LinkContainer>
            <NavItem onClick={this.handleLogout}><span className="orange line-height-24">Log out</span></NavItem>
            <LinkContainer to="/cart">
                <NavItem>
                    <div className="shopping-icon-container">
                        <span className="glyphicon glyphicon-shopping-cart white" aria-hidden="true"></span>
                    </div>
                </NavItem>
            </LinkContainer>
        </Fragment>
    );

    showLoggedOutBar = () => (
        <Fragment>
            <LinkContainer to="/signup">
                <NavItem><span className="orange">Sign up</span></NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
                <NavItem><span className="orange">Log in</span></NavItem>
            </LinkContainer>
        </Fragment>
    );

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            !this.state.isAuthenticating &&
            <div className="App container">
                <Navbar collapseOnSelect>
                    <Navbar.Brand>
                        <Link to="/">
                            <span className="orange"> <img src={logo} alt="Vat Returns" /> VAT</span>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav>
                            {this.state.isAuthenticated ? this.showLoggedInBar() : this.showLoggedOutBar()}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes isAuthenticated={childProps.isAuthenticated} userHasAuthenticated={childProps.userHasAuthenticated} />
            </div>
        );
    }
}

export default withRouter(App as any);