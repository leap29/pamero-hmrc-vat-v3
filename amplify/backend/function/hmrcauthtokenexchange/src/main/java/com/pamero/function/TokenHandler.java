package com.pamero.function;

import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.amazonaws.services.dynamodbv2.document.spec.PutItemSpec;

public class TokenHandler {
    private DynamoDB dynamoDb;
    private String DYNAMODB_TABLE_NAME = "VATHMRCTokens";
    private Regions REGION;

    public TokenHandler() {
        this.REGION = Regions.EU_WEST_2;
    }

    public Boolean putTokenString(String userName, String hmrcVatTokensJSON) {
        this.initDynamoDbClient();

        PutItemOutcome putItemOutcome =
                this.dynamoDb.getTable(this.DYNAMODB_TABLE_NAME)
                        .putItem((new PutItemSpec()).withItem((new Item())
                                .withString("CustomerID", userName)
                                .withString("hmrcVatTokensJSON", hmrcVatTokensJSON)
                                //TODO THis line below should not be there - need to chang the PUT to an UPDATE so the vat reg not stops getting removed.
                                // and requiring the temp hack below to make sure it is put back in.

                                .withString("userInfoJSON", "{\"vatRegNo\":\"861451333\"}")));

        return true;
    }


    private void initDynamoDbClient() {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        client.setRegion(Region.getRegion(this.REGION));
        this.dynamoDb = new DynamoDB(client);
    }
}
