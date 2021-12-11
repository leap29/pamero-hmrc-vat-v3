

package com.pamero.function;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import com.pamero.model.*;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class LambdaRequestHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent>{

    // Parse and create JSON
    Gson gson = new GsonBuilder().create();

    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context){
        APIGatewayProxyResponseEvent apiGatewayProxyResponseEvent = new APIGatewayProxyResponseEvent();
        // Get the logger from the context

        LambdaLogger logger = context.getLogger();
        try {

            // Get the response body
            String body = request.getBody();

            // Log the body--'cause, hey, we went through the trouble of getting the logger
            logger.log("BODY: " + body);


            //Get Username
/*            logger.log("User List: "+request.getRequestContext().getIdentity().toString());
            logger.log("User Provider: "+request.getRequestContext().getIdentity().getCognitoAuthenticationProvider());
            logger.log("User Arn: "+request.getRequestContext().getIdentity().getUserArn());
*/
            logger.log("Request: "+request);


            String cognitoAuthenticationProvider = request.getRequestContext().getIdentity().getCognitoAuthenticationProvider();
            String userName = cognitoAuthenticationProvider.split(":CognitoSignIn:")[1];
            logger.log("User Name: "+userName);

            // Use Gson to pare the response body to this functions specific RequestClass object
            if (body != null ) {
                RequestClass inputObj = gson.fromJson(body, RequestClass.class);
            }

            // Get the headers so we can check the auth header
            Map<String, String> headers = request.getHeaders();
            logger.log("Headers: "+headers.toString());

            ResponseClass finalResponse = null;

            //////////////////////////////// DO SPECIFIC STUFF HERE ///////////////////////////////////

            //Get tokens from DynamoDB
            //TODO - Get tokens from DynamoDB based on user name


            TokenHandler tokenHandler = new TokenHandler();
            String tokensJSONString = tokenHandler.getTokenString(userName);

            logger.log("TokensJSONString: "+tokensJSONString);


            //TODO - Get this from DynamoDB as they shouldn't be passed in
            // Use Gson to parse the request body to the HMRCOauth2Tokens class
            //HMRCOauth2Tokens tokensInputObj = gson.fromJson(body, HMRCOauth2Tokens.class);
            HMRCOauth2Tokens tokensInputObj = gson.fromJson(tokensJSONString, HMRCOauth2Tokens.class);

            logger.log("accessToken: " + tokensInputObj.getAccessToken());
            logger.log("refreshToken: " + tokensInputObj.getRefreshToken());
            logger.log("grantedScope: " + tokensInputObj.getGrantedScope());
            logger.log("expiresIn: " + tokensInputObj.getExpiresIn());

            //Get VAT Reg Number from DB
            UserInfoApplicationHeldHandler userInfoApplicationHeldHandler = new UserInfoApplicationHeldHandler();
            String userInfoJSON = userInfoApplicationHeldHandler.getUserInfoJSON(userName);

            if (userInfoJSON != null) {
                UserInfoApplicationHeld userInfoApplicationHeld = gson.fromJson(userInfoJSON, UserInfoApplicationHeld.class);

                String vatRegNo = userInfoApplicationHeld.getVatRegNo();
                logger.log("Vat number retrieved from DynamoDB: "+vatRegNo);

            //

                //Construct the get request to retrieve the obligations
                HttpClient client = HttpClientBuilder.create().build();
                //TODO - Remove the hardcoded dates and use values passed from the client
                //HttpGet vatObligationsRequest = new HttpGet("https://test-api.service.hmrc.gov.uk/organisations/vat/"+vatRegNo+"/obligations?from=2020-08-16&to=2021-08-16");
                HttpGet vatObligationsRequest = new HttpGet("https://test-api.service.hmrc.gov.uk/test/fraud-prevention-headers/validate");
                vatObligationsRequest.addHeader("Accept", "application/vnd.hmrc.1.0+json");
                vatObligationsRequest.addHeader("Authorization", "Bearer " + tokensInputObj.getAccessToken());

                //Add all Government HMRC Headers
                Set<String> headerKeys = headers.keySet();
                headerKeys.forEach(s -> {
                    if ("Gov".equalsIgnoreCase(s.substring(0,3))) {
                        vatObligationsRequest.addHeader(s, headers.get(s));
                        logger.log(s+": "+headers.get(s));
                    }
                });

                //Get the current IP of this to check some header info
                InetAddress myIP=InetAddress.getLocalHost();

                /* public String getHostAddress(): Returns the IP
                 * address string in textual presentation.
                 */
                logger.log("My IP Address is: "+myIP.getHostAddress());

                // execute the request
                HttpResponse vatObligationsResponse = client.execute(vatObligationsRequest);

                // extract the HTTP status code and response body
                int vatObligationsStatusCode = vatObligationsResponse.getStatusLine().getStatusCode();

                //TODO - Check vatObligationsStatusCode to see what to return to the front end
                // Generic error codes are here: https://developer.service.hmrc.gov.uk/api-documentation/docs/reference-guide#errors
                // API specific codes are here: https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/vat-api/1.0#Retrieve%20VAT%20obligations


                logger.log("Get VAT Obligations Status Code: "+vatObligationsStatusCode);

                String obligationsJSON = EntityUtils.toString(vatObligationsResponse.getEntity());

                logger.log("Response From API: " + obligationsJSON);

                if (vatObligationsStatusCode == 401 ) {

                    ErrorResponseClass errorResponseClass = gson.fromJson(obligationsJSON, ErrorResponseClass.class);

                    if (errorResponseClass.getCode() != null && errorResponseClass.getCode().equalsIgnoreCase("INVALID_CREDENTIALS" ) ) {
                        //TODO - Here we need to trigger the refresh of the tokens and if that fails then send to redirect
                        logger.log("TOKEN REFRESH REQUIRED");
                    }

                } else if (vatObligationsStatusCode == 403 ) {

                    ErrorResponseClass errorResponseClass = gson.fromJson(obligationsJSON, ErrorResponseClass.class);

                    if (errorResponseClass.getCode() != null && errorResponseClass.getCode().equalsIgnoreCase("CLIENT_OR_AGENT_NOT_AUTHORISED" ) ) {
                        //TODO - Here we need to check what is going on because the person logged in has given an incorrect VAT NUMBER
                        logger.log("LOGGED IN USER NOT AUTHORISED ON THIS VAT NUMBER");
                    }
                    finalResponse = new ResponseClass("ERROR_VAT_REG_NO_NOT_AUTHORISED_FOR_USER");

                } else {


                    // Use Gson to pare the response JSON body to a class
                    Obligations obligations = gson.fromJson(obligationsJSON, Obligations.class);

                    //TODO SETUP RESPONSE CODES
                    finalResponse = new ResponseClass(obligations.getObligations());
                }
            } else {
                logger.log("Vat Reg Number not found in DynamoDB");

                //TODO Return a code stating the reg number wasn't found in the DB and needs to be setup.
                finalResponse = new ResponseClass("ERROR_NO_VAT_REG_NO_FOUND");
            }

            //////////////////////////////// DO SPECIFIC STUFF HERE ///////////////////////////////////



            // Set the status code and response
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");

            apiGatewayProxyResponseEvent.setStatusCode(200);
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);

            String finalResponseJSON = gson.toJson(finalResponse);
            apiGatewayProxyResponseEvent.setBody(finalResponseJSON);

            // Log the full response object, just for fun
            logger.log(gson.toJson(apiGatewayProxyResponseEvent));

            // Return the result
            return apiGatewayProxyResponseEvent;

        } catch (JsonParseException ex) {
            logger.log(gson.toJson(ex));
            apiGatewayProxyResponseEvent.setStatusCode(400);
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);
            ResponseClass finalResponse = new ResponseClass("ERROR", ex.getMessage());
            String finalResponseJSON = gson.toJson(finalResponse);
            apiGatewayProxyResponseEvent.setBody(finalResponseJSON);
            return apiGatewayProxyResponseEvent;
        } catch (ClientProtocolException cpe) {
            logger.log(gson.toJson(cpe));
            cpe.printStackTrace();
            apiGatewayProxyResponseEvent.setStatusCode(400);
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);
            ResponseClass finalResponse = new ResponseClass("ERROR", cpe.getMessage());
            String finalResponseJSON = gson.toJson(finalResponse);
            apiGatewayProxyResponseEvent.setBody(finalResponseJSON);
            return apiGatewayProxyResponseEvent;
        } catch (IOException ioe) {
            logger.log(gson.toJson(ioe));
            ioe.printStackTrace();
            apiGatewayProxyResponseEvent.setStatusCode(400);
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);
            ResponseClass finalResponse = new ResponseClass("ERROR", ioe.getMessage());
            String finalResponseJSON = gson.toJson(finalResponse);
            apiGatewayProxyResponseEvent.setBody(finalResponseJSON);
            return apiGatewayProxyResponseEvent;
        } catch (Exception e) {
            logger.log(gson.toJson(e));
            e.printStackTrace();
            apiGatewayProxyResponseEvent.setStatusCode(400);
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);
            ResponseClass finalResponse = new ResponseClass("ERROR", e.getMessage());
            String finalResponseJSON = gson.toJson(finalResponse);
            apiGatewayProxyResponseEvent.setBody(finalResponseJSON);
            return apiGatewayProxyResponseEvent;
        }
    }
}
