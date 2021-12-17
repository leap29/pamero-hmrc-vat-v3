// A mock function to mimic making an async request for data
import {API} from "aws-amplify";

export function buildHMRCURL() {

  const myInit = { // OPTIONAL
    headers: {"local-mode":"false"}, // OPTIONAL
    //response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    //body: {},
    queryStringParameters: {  // OPTIONAL
    },
  };
  //TODO - This is only a note - remember never pass a body (even an empty one) for a GET request or API Gateway
  // will intercept it before it gets to Lambda and all you'll get back is a CORS error as there will be no
  // access-control-allow-origin: * set by the proxy
  return API.get("apihmrcgetauthurl", "/hmrcbuildauthurl", myInit);

//  return new Promise<{ data: number }>((resolve) =>
//    setTimeout(() => resolve({ data: amount }), 500)
//  );
}

export function retrieveHMRCTokens(authCode: string) {

  const myInit = { // OPTIONAL
    //headers: {}, // OPTIONAL
    //response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
    body: {
      "authCode": authCode
    },
    //queryStringParameters: {  // OPTIONAL
    //},
  };
  return API.post("hmrcauth", "/hmrcauth", myInit);
}





