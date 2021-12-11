/*package example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class LambdaRequestHandler implements RequestHandler<RequestClass, ResponseClass>{

    public ResponseClass handleRequest(RequestClass request, Context context){
        String greetingString = String.format("Hello %s %s!", request.firstName, request.lastName);
        return new ResponseClass(greetingString);
    }
}
*/

package example;

import com.amazonaws.services.lambda.runtime.Context; 
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
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

        try {
            LambdaLogger logger = context.getLogger();

            // Get the response body
            String body = request.getBody();

            // Log the body--'cause, hey, we went through the trouble of getting the logger
            logger.log("BODY: " + body);

            // Use Gson to pare the response body to our LambdaInput class
            //LambdaInput inputObj = gson.fromJson(body, LambdaInput.class);

            // Get the headers so we can check the auth header
            Map<String, String> headers = request.getHeaders();
/*
            if (headers == null) {
                throw new JwtVerificationException("Authorization header empty");
            }

            // Get the auth header
            String authHeader = headers.get("Authorization");

            if (authHeader == null) {
                throw new JwtVerificationException("Authorization header empty");
            }

            String token = authHeader.replaceAll("\\s*Bearer\\s*", "");

            logger.log("TOKEN: " + token);

            // This verifies the token in the auth header and throws an
            // exception if it does't validate
            Jwt jwt = jwtVerifier.decode(token);

            // Strip the spaces!
            String stripped = inputObj.input.replaceAll("\\s", "");
*/
            // Set the status code and response
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");

            apiGatewayProxyResponseEvent.setStatusCode(200);
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);

            //HMRC Request an OAuth 2.0 authorisation code with teh required
            String clientId = "CubSFaPgkOWyjPWkZGPBM99uYYRM";
            String clientSecret = "594ad69b-4574-40a0-9a78-1994ecdc257e";
            String scope = "read:vat+write:vat";
            String redirectUri = "http://localhost:3000/hmrcauthcode";

// construct the OAuth 2.0 Authorize request
            try {
                OAuthClientRequest requestOAuth = OAuthClientRequest
                        .authorizationLocation("https://test-api.service.hmrc.gov.uk/oauth/authorize")
                        .setResponseType("code")
                        .setClientId(clientId)
                        .setScope(scope)
                        .setRedirectURI(redirectUri)
                        .buildQueryMessage();

                logger.log(requestOAuth.getLocationUri());
                //The following is for a redirect that didn't work due to CORS
                //responseHeaders.put("location", requestOAuth.getLocationUri());
                apiGatewayProxyResponseEvent.setBody("{\"response\": \"Hiya from Lambda about to redirect to HMRC\", \"hmrcRedirect\": \""+requestOAuth.getLocationUri()+"\"}");
            } catch (OAuthSystemException oase) {
                logger.log(gson.toJson(oase));
            }

            // Log the full response object, just for fun
            logger.log(gson.toJson(apiGatewayProxyResponseEvent));

            // Return the result
            return apiGatewayProxyResponseEvent;
        } catch (JsonParseException ex) {
            apiGatewayProxyResponseEvent.setStatusCode(400);
            Map<String, String> responseHeaders = new HashMap<String, String>();
            responseHeaders.put("content-type", "application/json");
            responseHeaders.put("Access-Control-Allow-Origin", "*");
            apiGatewayProxyResponseEvent.setHeaders(responseHeaders);
            apiGatewayProxyResponseEvent.setBody("{\"response\": \"Failed to parse JSON\"}" );
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