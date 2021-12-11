
package com.pamero.function;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import com.pamero.model.HMRCOauth2Tokens;
import com.pamero.model.RequestClass;
import com.pamero.model.ResponseClass;
import org.apache.oltu.oauth2.client.OAuthClient;
import org.apache.oltu.oauth2.client.URLConnectionClient;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.client.response.OAuthJSONAccessTokenResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.types.GrantType;

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

            //Get Username
            logger.log("User List: "+request.getRequestContext().getIdentity().toString());
            logger.log("User Provider: "+request.getRequestContext().getIdentity().getCognitoAuthenticationProvider());
            logger.log("User Arn: "+request.getRequestContext().getIdentity().getUserArn());

            String cognitoAuthenticationProvider = request.getRequestContext().getIdentity().getCognitoAuthenticationProvider();
            String userName = cognitoAuthenticationProvider.split(":CognitoSignIn:")[1];
            logger.log("User Name: "+userName);

            // Use Gson to pare the response body to our LambdaInput class
            RequestClass inputObj = gson.fromJson(body, RequestClass.class);

            // Get the headers so we can check the auth header
            Map<String, String> headers = request.getHeaders();
            logger.log("Headers: "+headers.toString());


            //HMRC Request an OAuth 2.0 authorisation tokens from passed in auth code
            String authorizationCode = inputObj.getAuthCode();
            //String authorizationCode = "679e205b47594cd383f385a5d9dabb36";


            // create OAuth 2.0 Client using Apache HTTP Client
            OAuthClient oAuthClient = new OAuthClient(new URLConnectionClient());

            //TODO - These should be kept securely somewhere in reference data
            String hmrcTokenURL = "https://test-api.service.hmrc.gov.uk/oauth/token";
            String clientId = "CubSFaPgkOWyjPWkZGPBM99uYYRM";
            String clientSecret = "594ad69b-4574-40a0-9a78-1994ecdc257e";
            String redirectUri = "http://localhost:3000/hmrcauthcode";

            // construct OAuth 2.0 Token request for the authorization code
            OAuthClientRequest oAuthClientRequest = OAuthClientRequest
                    .tokenLocation(hmrcTokenURL)
                    .setGrantType(GrantType.AUTHORIZATION_CODE)
                    .setClientId(clientId)
                    .setClientSecret(clientSecret)
                    .setRedirectURI(redirectUri)
                    .setCode(authorizationCode)
                    .buildBodyMessage();

            // request the token via the OAuth 2.0 client
            OAuthJSONAccessTokenResponse oAuthJSONAccessTokenResponse = oAuthClient.accessToken(oAuthClientRequest);

            HMRCOauth2Tokens oauthTokens = new HMRCOauth2Tokens();

            oauthTokens.setAccessToken(oAuthJSONAccessTokenResponse.getAccessToken());
            oauthTokens.setRefreshToken(oAuthJSONAccessTokenResponse.getRefreshToken());
            oauthTokens.setGrantedScope(oAuthJSONAccessTokenResponse.getScope());
            oauthTokens.setExpiresIn(oAuthJSONAccessTokenResponse.getExpiresIn());
            logger.log("accessToken: " + oauthTokens.getAccessToken());
            logger.log("refreshToken: " + oauthTokens.getRefreshToken());
            logger.log("grantedScope: " + oauthTokens.getGrantedScope());
            logger.log("expiresIn: " + oauthTokens.getExpiresIn());


            String oauthTokensJSON = gson.toJson(oauthTokens);

            //TODO - Add oauthTokensJSON to DynamoDB
            TokenHandler tokenHandler = new TokenHandler();
            tokenHandler.putTokenString(userName, oauthTokensJSON);

            //String cognitoAuthenticationProvider = request.getRequestContext().getIdentity().getCognitoAuthenticationProvider();

            // Set the status code and response
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");

            apiGatewayProxyResponseEvent.setStatusCode(200);
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);


            ResponseClass finalResponse = new ResponseClass("Auth code swapped for tokens");
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
/*
    const models = [...results]
    const response = {
      data: models,
      message: 'All models successfully retrieved.',
    }
    //****** needed to add the next 3 lines
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(response)
 */

