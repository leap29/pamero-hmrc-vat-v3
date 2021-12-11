

package com.pamero.model;
        
     public class RequestClass {
         public String getAuthCode() {
             return authCode;
         }

         public void setAuthCode(String authCode) {
             this.authCode = authCode;
         }

         String authCode;


        public RequestClass(String authCode) {
            this.authCode = authCode;
        }

        public RequestClass() {
        }
    }