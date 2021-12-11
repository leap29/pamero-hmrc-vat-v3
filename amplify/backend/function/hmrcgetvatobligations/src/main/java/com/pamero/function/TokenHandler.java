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
                                .withString("hmrcVatTokensJSON", hmrcVatTokensJSON)));

        return true;
    }


    public String getTokenString(String userName) {
        this.initDynamoDbClient();

        Item itemFromDB =
                this.dynamoDb.getTable(this.DYNAMODB_TABLE_NAME)
                        .getItem("CustomerID", userName);

        if (itemFromDB != null) {
            return itemFromDB.getString("hmrcVatTokensJSON");
        } else {
            return null;
        }
    }

    private void initDynamoDbClient() {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        client.setRegion(Region.getRegion(this.REGION));
        this.dynamoDb = new DynamoDB(client);
    }
}
