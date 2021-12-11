import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from "../../app/store";

export interface PaymentState {
    value: Array<Payment>;
}

export interface Payment {
    periodKey: string;
    start: string;
    end: string;
    due: string;
    status: string;
    received: string;
}

const initialState: PaymentState = {
    value: [
        {periodKey: 'FG01', start: '02032001', end: '03032001', due: '08032001', status: 'C', received: 'Y'},
        {periodKey: 'FG02', start: '02042001', end: '03042001', due: '08042001', status: 'O', received: 'N'},
    ]
}

export const paymentsSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {}
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectPayments = (state: RootState) => state.payments.value;


export const { } = paymentsSlice.actions;


export default paymentsSlice.reducer;