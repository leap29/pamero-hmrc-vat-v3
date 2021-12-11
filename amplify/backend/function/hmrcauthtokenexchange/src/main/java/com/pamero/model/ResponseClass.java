

package com.pamero.model;
        
     public class ResponseClass {

         String message;

         public ResponseClass() {}

         public ResponseClass(String message) {
             this.message = message;
         }

         public String getMessage() {
             return message;
         }

         public void setMessage(String message) {
             this.message = message;
         }
     }
