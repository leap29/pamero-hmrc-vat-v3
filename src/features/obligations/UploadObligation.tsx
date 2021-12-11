import React, {useState} from "react";

import { useAppSelector, useAppDispatch} from "../../app/hooks";
import {FileDropZone} from "./FileDropZone";

// Add in the reference to the obligations slice reducer
import {
    obligationSubmitted,
    Obligation, ISubmission, selectParsedFileSubmission
} from "./obligationsSlice";

// Import the styles
import styles from '../counter/Counter.module.css';
import {match} from "react-router-dom";

// Export the component as a function

// TODO - Investigate how to keep the state from resetting if the page is reloaded (or if the URL params are manually updated)

//TODO

export function UploadObligation({ match } : { match:any} )  {
    //Get the obligation key from the match.params
    const { obligationPeriodKey } = match.params;

    //Setup the useAppSelector to get the actual obligation we want from the state based on the obligationPeriodKey
    const obligation = useAppSelector(state =>
        state.obligations.value.find(obligation => obligation.periodKey === obligationPeriodKey)
    );

    const submission : ISubmission = useAppSelector(selectParsedFileSubmission);

    //Map dispatch to the useAppDispatch hook
    const dispatch = useAppDispatch();

    {
        //Add a connection into the useState hook if we need any changeable data entry fields on this page
        //e.g. the following two lines
        //const [incrementAmount, setIncrementAmount] = useState('2');
        //const incrementValue = Number(incrementAmount) || 0;
    }

     //Finally return the HTML fragment for this page

    return (

        <div className="obligation">
            <div className="well-bs col-md-12">
                <div className="white-box">
                    <h3>Obligation</h3>
                    <hr/>
                </div>
                { (obligation) ?
                    <div>
                        <h5>Period Key {obligation.periodKey}</h5>
                        <h5>Due {obligation.due}</h5>
                        <h5>Start {obligation.start}</h5>
                        <h5>End {obligation.end}</h5>
                        <h5>Status {obligation.status}</h5>
                        <h5>Received {obligation.received}</h5>
                    </div> :
                    <div>
                        <h3>NOT FOUND</h3>
                    </div> }
                <div>
                    <FileDropZone/>
                </div>
                { (submission) ?
                    <div>
                        <h5>Box1 {submission.box_1}</h5>
                        <h5>Box2 {submission.box_2}</h5>
                        <h5>Box3 {submission.box_3}</h5>
                        <h5>Box4 {submission.box_4}</h5>
                        <h5>Box5 {submission.box_5}</h5>
                        <h5>Box6 {submission.box_6}</h5>
                        <h5>Box7 {submission.box_7}</h5>
                        <h5>Box8 {submission.box_8}</h5>
                        <h5>Box9 {submission.box_9}</h5>
                    </div> :
                    <div>
                        <h3>NO SUBMISSION YET</h3>
                    </div> }
            </div>
        </div>
    );
}



