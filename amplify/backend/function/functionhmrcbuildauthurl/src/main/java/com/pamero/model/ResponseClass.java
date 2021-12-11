package com.pamero.model;
        
     public class ResponseClass {

         String authCodeURL;
         String message;

         public ResponseClass() {}


         public ResponseClass(String message) {
             this.message = message;
         }

         public ResponseClass(String authCodeURL, String message) {
             this.authCodeURL = authCodeURL;
             this.message = message;
         }

         public String getAuthCodeURL() {
             return authCodeURL;
         }

         public void setAuthCodeURL(String authCodeURL) {
             this.authCodeURL = authCodeURL;
         }

         public String getMessage() {
             return message;
         }

         public void setMessage(String message) {
             this.message = message;
         }

    }