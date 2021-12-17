package com.pamero.function;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import com.pamero.model.RequestClass;
import com.pamero.model.ResponseClass;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;

import java.util.HashMap;
import java.util.Map;

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

            logger.log("We're here");

            //Get Username
/*
            if  (request.getRequestContext() != null ) {
                logger.log("Request.getRequestContext: " + request.getRequestContext());

                if (request.getRequestContext().getIdentity() != null) {
                    logger.log("Request.getRequestContext.getIdentity: " + request.getRequestContext().getIdentity());

                    if (request.getRequestContext().getIdentity().getCognitoAuthenticationProvider() != null) {
                        logger.log("Request.getRequestContext.getIdentity.getCognitoAuthenticationProvider: " + request.getRequestContext().getIdentity().getCognitoAuthenticationProvider());
                    } else {
                        logger.log("Request.getRequestContext.getIdentity.getCognitoAuthenticationProvider is null");
                    }

                } else {
                    logger.log("Request.getRequestContext.getIdentity is null");
                }

            } else {
                logger.log("Request.getRequestContext is null");
            }
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

            boolean localMode = false;
            String localModeString = headers.get("local-mode");
            if (localModeString != null && localModeString.equalsIgnoreCase("true")) {
                logger.log("Setting local mode to true");
                localMode = true;
            } else {
                logger.log("Local mode is false");
            }


            //////////////////////////////// DO SPECIFIC STUFF HERE ///////////////////////////////////

            //TODO - Get these from reference data
            String clientId = "CubSFaPgkOWyjPWkZGPBM99uYYRM";
            String clientSecret = "594ad69b-4574-40a0-9a78-1994ecdc257e";
            String scope = "read:vat+write:vat";
            String redirectUri;
            if (localMode) {
                redirectUri = "http://localhost:3000/hmrcauthcode";
            } else {
                redirectUri = "https://www.acrovat.co.uk/hmrcauthcode";
            }

            // construct the OAuth 2.0 Authorize request

            OAuthClientRequest requestOAuth = OAuthClientRequest
                    .authorizationLocation("https://test-api.service.hmrc.gov.uk/oauth/authorize")
                    .setResponseType("code")
                    .setClientId(clientId)
                    .setScope(scope)
                    .setRedirectURI(redirectUri)
                    .buildQueryMessage();

            logger.log(requestOAuth.getLocationUri());

            ResponseClass finalResponse = new ResponseClass(requestOAuth.getLocationUri(), "Auth code URL built");


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
        } catch (OAuthSystemException oase) {
            logger.log(gson.toJson(oase));
            apiGatewayProxyResponseEvent.setStatusCode(400);
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);
            ResponseClass finalResponse = new ResponseClass(oase.getMessage());
            String finalResponseJSON = gson.toJson(finalResponse);
            apiGatewayProxyResponseEvent.setBody(finalResponseJSON);
            return apiGatewayProxyResponseEvent;
 /*
        } catch (OAuthProblemException oape) {

            logger.log(gson.toJson(oape));
            apiGatewayProxyResponseEvent.setStatusCode(400);
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);
            ResponseClass finalResponse = new ResponseClass(oape.getMessage());
            String finalResponseJSON = gson.toJson(finalResponse);
            apiGatewayProxyResponseEvent.setBody(finalResponseJSON);
            return apiGatewayProxyResponseEvent;

  */
        } catch (JsonParseException ex) {
            logger.log(gson.toJson(ex));
            apiGatewayProxyResponseEvent.setStatusCode(400);
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);
            ResponseClass finalResponse = new ResponseClass(ex.getMessage());
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
            ResponseClass finalResponse = new ResponseClass(e.getMessage());
            String finalResponseJSON = gson.toJson(finalResponse);
            apiGatewayProxyResponseEvent.setBody(finalResponseJSON);
            return apiGatewayProxyResponseEvent;

        }
    }
}
