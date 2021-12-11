package com.pamero.model;

public class SuperResponseClass  {

    String responseCode;
    String message;

    public String getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(String responseCode) {
        this.responseCode = responseCode;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public SuperResponseClass()
    {

    }

    public SuperResponseClass(String responseCode) {
        this.responseCode = responseCode;
    }

    public SuperResponseClass(String responseCode, String message) {
        this.responseCode = responseCode;
        this.message = message;
    }

}
