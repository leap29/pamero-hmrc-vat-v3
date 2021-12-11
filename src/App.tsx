import React from 'react';
//import logo from './logo.svg';
//import { Counter } from './features/counter/Counter';
import './App.css';
import {Obligations} from "./features/obligations/Obligations";
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import {NavbarNew} from "./app/NavbarNew";
import {UploadObligation} from "./features/obligations/UploadObligation";
import {Payments} from "./features/payments/Payments";
import {Col, Container, Nav, Row} from "react-bootstrap";
import {User} from "./features/user/User";
import {TokenGenerator} from "./features/user/TokenGenerator";
import {Login} from "./features/user/Login";

function App() {
    return (
        <Router>
            <NavbarNew/>
            <div className="App">
                <Container>
                    <Row>
                        <Col xs={2}>
                            <Nav defaultActiveKey="/" className="flex-column">
                                <Nav.Link as={Link} to={"/dashboard/obligations"}>Obligations</Nav.Link>
                                <Nav.Link as={Link} to={"/dashboard/payments"}>Payments</Nav.Link>
                                <Nav.Link eventKey="link-2">Link</Nav.Link>
                                <Nav.Link eventKey="disabled" disabled>
                                    Disabled
                                </Nav.Link>
                            </Nav>
                        </Col>
                        <Col>
                            <Switch>
                                <Route
                                    exact={true}
                                    path={"/"}
                                    render={() => (
                                        <React.Fragment>
                                            <Login/>
                                            <User/>
                                        </React.Fragment>
                                    )}
                                />
                                <Route
                                    exact={true}
                                    path={"/dashboard/obligations"}
                                    render={() => (
                                        <React.Fragment>
                                            <Obligations/>
                                        </React.Fragment>
                                    )}
                                />
                                <Route exact path="/obligation/:obligationPeriodKey" component={UploadObligation} />
                                <Route exact path="/dashboard/payments" component={Payments} />
                                <Route path="/hmrcauthcode" exact component={TokenGenerator}  />
                            </Switch>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Router>
    )
}

//TODO  Add Drag and Drop
// https://codesandbox.io/s/0yr672zx2n?file=/App.js
// https://react-dropzone.js.org/

/*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <Obligations />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}
*/

export default App;
