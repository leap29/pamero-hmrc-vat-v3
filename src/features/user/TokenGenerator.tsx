import React, {useEffect, useState} from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  retrieveHMRCTokenSet,
  selectLoggedInState, TokenSet, selectHMRCTokenSet, buildHMRCAuthURL, selectTokenStatus,
} from './userSlice';
import styles from '../counter/Counter.module.css';
import {Redirect} from "react-router";
import {Spinner} from "react-bootstrap";

export function TokenGenerator() {
  const currentTokenStatus : string = useAppSelector(selectTokenStatus);
  const hmrcTokenSet : TokenSet = useAppSelector(selectHMRCTokenSet);
  const dispatch = useAppDispatch();

  //TODO Use the below for setting state via useState hook
  // const [incrementAmount, setIncrementAmount] = useState('2');
  // const incrementValue = Number(incrementAmount) || 0;

  useEffect(() => {
    if (currentTokenStatus !== 'valid') {

      console.log("Use Effect triggered");

      console.log("Query String: " + window.location.search.substring(1));
      const queryString = window.location.search.substring(1);
      const authCode = queryString.split("=")[1];
      console.log("Auth Code: " + authCode);
      dispatch(retrieveHMRCTokenSet(authCode));
    } else {
      console.log("We've already got the tokens so nothing to do");
    }
  });


  return ( currentTokenStatus === 'valid' ?
          <Redirect to={"/dashboard/obligations"} /> :
      <div>
        <Spinner animation="border"/>
        <h5>Retrieving Access Tokens from HMRC to allow us to act on your behalf...</h5>
      </div>  );
}
