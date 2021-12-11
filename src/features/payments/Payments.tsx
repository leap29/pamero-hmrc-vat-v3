import React, {/*useState*/} from "react";
import Table  from "react-bootstrap/Table";
import dateFormat from "dateformat";

import { useAppSelector, useAppDispatch} from "../../app/hooks";
import { Link } from "react-router-dom";

// Add in the reference to the obligations slide reducer
import {
    selectPayments
    //Obligation
} from "./paymentsSlice";

// Import the styles
import styles from '../counter/Counter.module.css';


export function Payments() {
    //Setup the obligations and use the useAppSelector with the selectObligations method from the reducer slice
    const payments = useAppSelector(selectPayments);

    //Map dispatch to the useAppDispatch hook
    const dispatch = useAppDispatch();

        //Add a connection into the useState hook if we need any changeable data entry fields on this page
        //e.g. the following two lines
        //const [incrementAmount, setIncrementAmount] = useState('2');
        //const incrementValue = Number(incrementAmount) || 0;

    const renderedPayments =

        <tbody>
            {payments.map(payment => (
                //TODO Add a Key BUT BE CAREFUL when adding duplicate "key" variable to the <tr> as it screws with the removal of the rows when redux state changes
                <tr key={payment.periodKey}>
                    <td>{payment.periodKey}</td>
                    <td>{payment.due}</td>
                    <td>{payment.start}</td>
                    <td>{payment.end}</td>
                    <td>{payment.received}</td>
                    <td>{ payment.status === "O" ?
                        <Link to={`/obligation/${payment.periodKey}`} className="button muted-button">
                            Submit
                        </Link>
                        : "Complete" }
                    </td>
                </tr>
            ))}
        </tbody>
    //Finally return the HTML fragment for this page
    return (

        <div className="payments">
            <div className="well-bs col-md-12">
                <div className="white-box">
                    <h3>Payments</h3>
                    <hr />
                </div>
                <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                        <th>Period Key</th>
                        <th>Due</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                        <th>Received</th>
                    </tr>
                    </thead>
                    {renderedPayments}
                </Table>
            </div>
        </div>
    );
}



