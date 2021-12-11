import React, {useEffect/*useState*/} from "react";
import Table  from "react-bootstrap/Table";
import dateFormat from "dateformat";

import { useAppSelector, useAppDispatch} from "../../app/hooks";
import { Link } from "react-router-dom";

// Add in the reference to the obligations slide reducer
import {
    selectObligations,
    obligationAdded,
    obligationsReplaced,
    fetchObligationsAsynch, selectObligationsStatus,
    //Obligation
} from "./obligationsSlice";

// Import the styles
import styles from '../counter/Counter.module.css';
import {Spinner} from "react-bootstrap";


// Export the component as a function
export function Obligations() {
    //Setup the obligations and use the useAppSelector with the selectObligations method from the reducer slice
    const obligations = useAppSelector(selectObligations);
    const obligationsStatus = useAppSelector(selectObligationsStatus);

    //Map dispatch to the useAppDispatch hook
    const dispatch = useAppDispatch();

        //Add a connection into the useState hook if we need any changeable data entry fields on this page
        //e.g. the following two lines
        //const [incrementAmount, setIncrementAmount] = useState('2');
        //const incrementValue = Number(incrementAmount) || 0;
    useEffect(() => {
        if (obligationsStatus !== 'fulfilled')
        {
            dispatch(fetchObligationsAsynch())
        }
    }, [dispatch])


    const renderedObligations =

        <tbody>
            {obligations ? obligations.map(obligation => (
                //TODO Add a Key BUT BE CAREFUL when adding duplicate "key" variable to the <tr> as it screws with the removal of the rows when redux state changes
                <tr key={obligation.periodKey}>
                    <td>{obligation.periodKey}</td>
                    <td>{obligation.due}</td>
                    <td>{obligation.start}</td>
                    <td>{obligation.end}</td>
                    <td>{obligation.received}</td>
                    <td>{ obligation.status === "O" ?
                        <Link to={`/obligation/${obligation.periodKey}`} className="button muted-button">
                            Submit
                        </Link>
                        : "Complete" }
                    </td>
                </tr>
            )) : <tr/>}
        </tbody>
    //Finally return the HTML fragment for this page
    return (

        <div className="obligations">
            <div className="well-bs col-md-12">
                <div className="white-box">
                    <h3>Obligations</h3>
                    <h5>{obligationsStatus}</h5>
                    <hr />
                </div>
                {obligationsStatus === "fulfilled" ?
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
                        {renderedObligations}
                    </Table>
                    : <div>
                        <Spinner animation="border"/>
                        <h5>Loading your VAT Obligations from HMRC...</h5>
                    </div>
                }
            </div>
            <div className={styles.row}>
                <button
                    className={styles.button}
                    onClick={() => dispatch(obligationAdded({ periodKey: 'FG03'+Math.random(), start: '02042001', end: '03042001', due: '08042001', status: 'O', received: 'N'}))}
                >
                    Add An Obligation
                </button>
                <button
                    className={styles.button}
                    onClick={() => dispatch(obligationsReplaced([
                        {periodKey: 'FG04', start: '02032001', end: '03032001', due: '08032001', status: 'C', received: 'Y'},
                        {periodKey: 'FG05', start: '02042001', end: '03042001', due: '08042001', status: 'O', received: 'N'},
                    ]))}
                >
                    Replace Obligations
                </button>
                <button
                    className={styles.asyncButton}
                    onClick={() => dispatch(fetchObligationsAsynch())}
                >
                    Refresh Obligations
                </button>

            </div>
        </div>
    );
}



