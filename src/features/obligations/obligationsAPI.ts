// A mock function to mimic making an async request for data
import {Obligation} from "./obligationsSlice";
import {API} from "aws-amplify";
import {buildHeaders, FraudHeaders, fraudHeadersToString, getIP} from "../../common/FraudHeaderBuilder";

export function fetchObligations() {

    console.log("Loading Obligations");
  return new Promise<{ data: Obligation[] }>((resolve) =>
    setTimeout(() => resolve({ data: [
        {periodKey: 'FG06', start: '02032001', end: '03032001', due: '08032001', status: 'C', received: 'Y'},
        {periodKey: 'FG07', start: '02042001', end: '03042001', due: '08042001', status: 'O', received: 'N'}
      ] }), 2000)
  );
}

export function listObligations() {


    //TODO - Move the below code to the correct place that sends method calls to lambda for forwarding to HMRC
    let fraudHeadersToPass : FraudHeaders = buildHeaders();
    let theIP : Promise<String> = getIP();
    theIP.then(function(anIP: String) {
        //alert("an IP: "+anIP);
        fraudHeadersToPass.clientLocalIP+=""+anIP;
        //alert(connectionMethodText+"\n"+doNotTrackText+"\n"+userAgentText+"\n"+pluginText+"\n"+clientDeviceID+
        //    "\n"+clientLocalIP+"\n"+clientLocalIPTimeStamp+"\n"+clientMFA+"\n"+clientScreensText+"\n"+clientTimezoneText+
        //    "\n"+clientWindowText);
        //console.log(connectionMethodText+"\n"+doNotTrackText+"\n"+userAgentText+"\n"+pluginText+"\n"+clientDeviceID+
        //    "\n"+clientLocalIP+"\n"+clientLocalIPTimeStamp+"\n"+clientMFA+"\n"+clientScreensText+"\n"+clientTimezoneText+
        //    "\n"+clientWindowText);
        console.log("Fraud Headers: "+fraudHeadersToPass);
    });

    let fraudHeaderString = fraudHeadersToString(fraudHeadersToPass);

    const myInit = { // OPTIONAL
        //headers: {fraudHeaderString.toString()}, // OPTIONAL
        headers: {"Gov-Client-Connection-Method": fraudHeadersToPass.connectionMethodText,
            "Gov-Client-Browser-Do-Not-Track": fraudHeadersToPass.doNotTrackText,
            "Gov-Client-Browser-Plugins": fraudHeadersToPass.pluginText,
            "Gov-Client-Browser-JS-User-Agent": fraudHeadersToPass.userAgentText,
            "Gov-Client-Screens": fraudHeadersToPass.clientScreensText,
            "Gov-Client-Window-Size": fraudHeadersToPass.clientWindowText,
            "Gov-Client-Timezone": fraudHeadersToPass.clientTimezoneText,
            "Gov-Client-Local-IPs-Timestamp": fraudHeadersToPass.clientLocalIPTimeStamp,
            "Gov-Client-Device-ID": fraudHeadersToPass.clientDeviceID,
            "Gov-Client-Local-IPs": fraudHeadersToPass.clientLocalIP,
            "Gov-Client-Multi-Factor": fraudHeadersToPass.clientMFA,
        }, // OPTIONAL
        //headers: {"Gov-Client-Connection-Method": "WEB_APP_VIA_SERVER"}, // OPTIONAL
        //response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
        //body: {},
        queryStringParameters: {  // OPTIONAL
        },
    };
    //TODO - This is only a note - remember never pass a body (even an empty one) for a GET request or API Gateway
    // will intercept it before it gets to Lambda and all you'll get back is a CORS error as there will be no
    // access-control-allow-origin: * set by the proxy
    return API.get("apihmrcvatobligations", "/vatobligations", myInit);
}
