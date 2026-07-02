@RestResource(urlMapping='/wallet/add-funds')
global without sharing class WalletAddFundsController {

    // ===============================
    // REQUEST
    // ===============================
    global class AddFundsRequest {
        public String idToken;
        public Decimal amount;
    }

    // ===============================
    // RESPONSE
    // ===============================
    global class AddFundsResponse {
        public Boolean success;
        public Decimal newBalance;
        public String message;
    }

    @HttpPost
    global static AddFundsResponse addFunds(){

        AddFundsResponse res = new AddFundsResponse();

        try{

            RestRequest req = RestContext.request;

            if(req.requestBody == null){
                return error(res, 'Request body missing.', 400);
            }

            AddFundsRequest input =
                (AddFundsRequest) JSON.deserialize(
                    req.requestBody.toString(),
                    AddFundsRequest.class
                );

            // ===============================
            // ✅ VALIDATION
            // ===============================
            if(input == null ||
               String.isBlank(input.idToken) ||
               input.amount == null ||
               input.amount <= 0){

                return error(res, 'Invalid input.', 400);
            }

            // ===============================
            // 🔐 VERIFY FIREBASE TOKEN
            // ===============================
            String firebaseUid =
                FirebaseAuthUtil.verifyToken(input.idToken);

            if(String.isBlank(firebaseUid)){
                return error(res, 'Authentication required.', 401);
            }

            // ===============================
            // ✅ FIND CUSTOMER
            // ===============================
            List<Customer__c> customers = [

                SELECT Id

                FROM Customer__c

                WHERE Firebase_UID__c = :firebaseUid

                LIMIT 1
            ];

            if(customers.isEmpty()){
                return error(res, 'Customer not found.', 404);
            }

            Customer__c customer = customers[0];

            // ===============================
            // 🔒 LOCK CREDIT RECORD
            // ===============================
            List<Customer_Credit__c> credits = [

                SELECT Id,
                       Available_Amount__c,
                       Amount__c

                FROM Customer_Credit__c

                WHERE Customer__c = :customer.Id

                LIMIT 1

                FOR UPDATE
            ];

            Customer_Credit__c credit;

            if(credits.isEmpty()){

                credit = new Customer_Credit__c(

                    Customer__c = customer.Id,

                    Available_Amount__c = input.amount,

                    Amount__c = input.amount
                );

                insert credit;

            }else{

                credit = credits[0];

                Decimal currentAvailable =
                    credit.Available_Amount__c == null
                    ? 0
                    : credit.Available_Amount__c;

                Decimal currentTotal =
                    credit.Amount__c == null
                    ? 0
                    : credit.Amount__c;

                credit.Available_Amount__c =
                    currentAvailable + input.amount;

                credit.Amount__c =
                    currentTotal + input.amount;

                update credit;
            }

            // ===============================
            // ✅ RESPONSE
            // ===============================
            res.success = true;

            res.newBalance =
                credit.Available_Amount__c == null
                ? 0
                : credit.Available_Amount__c;

            RestContext.response.statusCode = 200;

            return res;

        }catch(Exception e){

            System.debug(
                'Wallet Add Funds Error: ' + e.getMessage()
            );

            return error(
                res,
                'Failed to add funds. Please try again later.',
                500
            );
        }
    }

    // ===============================
    // ERROR HANDLER
    // ===============================
    private static AddFundsResponse error(

        AddFundsResponse res,

        String msg,

        Integer code
    ){

        res.success = false;

        res.message = msg;

        RestContext.response.statusCode = code;

        return res;
    }
}