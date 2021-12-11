import dateFormat from "dateformat";

export class FraudHeaders {
    connectionMethodText : string = "WEB_APP_VIA_SERVER";
    public doNotTrackText : string = "";
    pluginText : string = "";
    userAgentText : string = "";
    clientScreensText : string = "";
    clientWindowText : string = "width=";
    clientTimezoneText : string = "UTC";
    clientLocalIPTimeStamp : string = "";
    clientDeviceID : string = "";
    clientLocalIP : string = "";
    clientMFA : string = "";

}

export function fraudHeadersToString(currentFraudHeaders : FraudHeaders) : string {
    return currentFraudHeaders.connectionMethodText+", "+
        currentFraudHeaders.doNotTrackText+", "+
        currentFraudHeaders.pluginText+", "+
        currentFraudHeaders.userAgentText+", "+
        currentFraudHeaders.clientScreensText+", "+
        currentFraudHeaders.clientWindowText+", "+
        currentFraudHeaders.clientTimezoneText+", "+
        currentFraudHeaders.clientLocalIPTimeStamp+", "+
        currentFraudHeaders.clientDeviceID+", "+
        currentFraudHeaders.clientLocalIP+", "+
        currentFraudHeaders.clientMFA;
}

export function buildHeaders() : FraudHeaders {

    let currentFraudHeaders : FraudHeaders = new FraudHeaders();

    if (navigator.doNotTrack) {
        currentFraudHeaders.doNotTrackText += navigator.doNotTrack === "" + 1 ? "true" : "false)";
    } else {
        currentFraudHeaders.doNotTrackText += "false";
    }

    for (let i = 0; i < navigator.plugins.length; i++) {
        currentFraudHeaders.pluginText += escape(navigator.plugins[i].name);
        if (i !== navigator.plugins.length - 1) {
            currentFraudHeaders.pluginText += ",";
        }
    }

    currentFraudHeaders.userAgentText += navigator.userAgent

    currentFraudHeaders.clientScreensText += "width=" + window.screen.width;
    currentFraudHeaders.clientScreensText += "&height=" + window.screen.height;
    currentFraudHeaders.clientScreensText += "&scaling-factor=" + window.devicePixelRatio;
    currentFraudHeaders.clientScreensText += "&colour-depth=" + window.screen.colorDepth;


    currentFraudHeaders.clientWindowText += String(window.innerWidth);
    currentFraudHeaders.clientWindowText += "&height="
    currentFraudHeaders.clientWindowText += String(window.innerHeight);

    currentFraudHeaders.clientTimezoneText += dateFormat(new Date(), "p");

    currentFraudHeaders.clientLocalIPTimeStamp += dateFormat(new Date(), "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'");

    let currentCookies : String = document.cookie;
    let deviceUUID : String = "";
    if (currentCookies) {
        console.log(currentCookies);
        let allCookies : String[] = currentCookies.split("; ");
        if (allCookies) {
            let chosenCookie : any = allCookies.find(row => row.startsWith("gov-client-device-id="));
            if (chosenCookie) {
                deviceUUID = chosenCookie.split("=")[1];
            }
        }
    }

    if (deviceUUID && deviceUUID !=="") {
        console.log("UUID Already Set: "+deviceUUID);
    } else {
        deviceUUID = broofa();
        console.log("Created New UUID: "+deviceUUID);
        document.cookie = "gov-client-device-id="+deviceUUID+"; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure";
    }

    currentFraudHeaders.clientDeviceID+=""+deviceUUID;

    return currentFraudHeaders;


}

function broofa() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export async function getIP() : Promise<String> {
    const ip : String = await new Promise((resolve, reject) => {
        const conn = new RTCPeerConnection();
        conn.createDataChannel('');
        conn.createOffer().then(offer => conn.setLocalDescription(offer), reject)
        conn.onicecandidate = ice => {
            if (ice && ice.candidate && ice.candidate.candidate) {
                resolve(ice.candidate.candidate.split(' ')[4])
                conn.close()
            }
        }
    })
    return ip;
}
