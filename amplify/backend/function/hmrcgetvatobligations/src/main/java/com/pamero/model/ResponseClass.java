

package com.pamero.model;
        
     public class ResponseClass extends SuperResponseClass{
         Obligation[] obligations;

         public ResponseClass(String responseCode) {
             super(responseCode);
         }


         public ResponseClass(String responseCode, String message) {
             super (responseCode, message);
         }
         public ResponseClass(Obligation[] obligations) {
             super ("OBLIGATIONS_FOUND_OK", "The obligations were found");

             this.obligations = obligations;
         }

         public ResponseClass(String responseCode, Obligation[] obligations) {
             super (responseCode, "Blank message from constructor");
             this.obligations = obligations;
         }

         public ResponseClass(String responseCode, String message, Obligation[] obligations) {
             super (responseCode, message);
             this.obligations = obligations;
         }


         public Obligation[] getObligations() {
             return obligations;
         }

         public void setObligations(Obligation[] obligations) {
             this.obligations = obligations;
         }
    }