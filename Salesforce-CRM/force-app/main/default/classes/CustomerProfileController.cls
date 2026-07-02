@RestResource(urlMapping='/customer/profile')
global without sharing class CustomerProfileController {

    private static final String FIREBASE_API_KEY = 'AIzaSyAeucTNcAromiBgbhjCQ_HTFFeNkcsK_X4';

    public class ProfileRequest {
        public String idToken;
        public String fullName;
        public String phone;
        public String address;
    }

    public class ProfileResponse {
        public Boolean success;
        public String message;
    }

    @HttpPatch
    global static void completeProfile() {

        try {

            RestRequest req = RestContext.request;
            String rawBody = req.requestBody.toString();

            ProfileRequest input =
                (ProfileRequest) JSON.deserialize(rawBody, ProfileRequest.class);

            if (input == null || String.isBlank(input.idToken)) {
                sendError('Missing token', 400);
                return;
            }

            // 🔒 Verify Firebase Token
            String endpoint =
                'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='
                + FIREBASE_API_KEY;

            HttpRequest httpReq = new HttpRequest();
            httpReq.setEndpoint(endpoint);
            httpReq.setMethod('POST');
            httpReq.setHeader('Content-Type', 'application/json');
            httpReq.setBody(JSON.serialize(
                new Map<String, String>{ 'idToken' => input.idToken }
            ));

            Http http = new Http();
            HttpResponse httpRes = http.send(httpReq);

            if (httpRes.getStatusCode() != 200) {
                sendError('Invalid Firebase token', 401);
                return;
            }

            Map<String, Object> result =
                (Map<String, Object>) JSON.deserializeUntyped(httpRes.getBody());

            List<Object> users = (List<Object>) result.get('users');

            if (users == null || users.isEmpty()) {
                sendError('User not found', 401);
                return;
            }

            Map<String, Object> userData =
                (Map<String, Object>) users[0];

            String firebaseUid = (String) userData.get('localId');

            // 🔎 Find Customer
            Customer__c customer = [
                SELECT Id, Full_Name__c, Phone__c, Address__c
                FROM Customer__c
                WHERE Firebase_UID__c = :firebaseUid
                LIMIT 1
            ];

            // ✅ Update fields
            customer.Full_Name__c = input.fullName;
            customer.Phone__c = input.phone;
            customer.Address__c = input.address;

            update customer;

            ProfileResponse res = new ProfileResponse();
            res.success = true;
            res.message = 'Profile updated successfully';

            sendResponse(res, 200);

        } catch (Exception e) {

            System.debug('Profile Update Error: ' + e.getMessage());

            sendError('Profile update failed. Please try again later.', 500);
        }
    }

    // 🔁 Success Response
    private static void sendResponse(Object body, Integer statusCode) {
        RestContext.response.statusCode = statusCode;
        RestContext.response.addHeader('Content-Type', 'application/json');
        RestContext.response.responseBody =
            Blob.valueOf(JSON.serialize(body));
    }

    // ❌ Error Response
    private static void sendError(String message, Integer statusCode) {

        ProfileResponse err = new ProfileResponse();
        err.success = false;
        err.message = message;

        sendResponse(err, statusCode);
    }
}