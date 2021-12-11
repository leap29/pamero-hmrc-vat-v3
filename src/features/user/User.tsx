import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectHMRCAuthURL,
  buildHMRCAuthURL,
  selectLoggedInState,
} from './userSlice';
import styles from '../counter/Counter.module.css';

export function User() {
  const isLoggedIn : boolean = useAppSelector(selectLoggedInState);
  const hmrcAuthURL : string = useAppSelector(selectHMRCAuthURL);
  const dispatch = useAppDispatch();

  //TODO Use the below for setting state via useState hook
  // const [incrementAmount, setIncrementAmount] = useState('2');
  // const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div className={styles.row}>
        <button
            className={styles.button}
            onClick={() => dispatch(buildHMRCAuthURL())}
        >
          Link to HMRC
        </button>
        {/*
        <span className={styles.value}>{isLoggedIn}</span>
        <span className={styles.value}>{hmrcAuthURL}</span>
        */}
      </div>
    </div>
  );
}
