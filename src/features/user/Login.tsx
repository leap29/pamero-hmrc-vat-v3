import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Form, FormGroup, FormControl, FormLabel, Button } from "react-bootstrap";
//import "./login.css";
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
  performLogin,
  selectLoggedInState,
} from './userSlice';
import styles from '../counter/Counter.module.css';


export function Login() {
  const isLoggedIn : boolean = useAppSelector(selectLoggedInState);
  const dispatch = useAppDispatch();

  const [validated, setValidated] = useState(false);
  const [enteredUserName, setEnteredUserName] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

//TODO - What does stopPropogation do?
// Need to figure out the below logic and figure out how to prevent the dispatch if the form isn't valid
    if (form.checkValidity() === false) {

      event.stopPropagation();
    }

    setValidated(true);

    alert(enteredUserName+", "+enteredPassword);

    dispatch(performLogin({username: enteredUserName, password: enteredPassword}))
  };

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setEnteredUserName(target.value);
  };

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setEnteredPassword(target.value);
  };

  return (
  <Form noValidate validated={validated} onSubmit={handleSubmit}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control required type="email" placeholder="Enter username" onChange={onUserNameChange} />
      <Form.Control.Feedback type="invalid">
        Please enter your username which is the email address you used to signup.
      </Form.Control.Feedback>
      <Form.Text className="text-muted">
        We'll never share your email with anyone else.
      </Form.Text>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control required type="password" placeholder="Password"  onChange={onPasswordChange} />
      <Form.Control.Feedback type="invalid">
        Please enter your password.
      </Form.Control.Feedback>
    </Form.Group>
    <Button type="submit">
      Login
    </Button>
  </Form>
  );
}
