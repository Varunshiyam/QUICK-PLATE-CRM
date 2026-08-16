@RestResource(urlMapping='/auth/firebase')
global with sharing class FirebaseAuthController {

    // =========================================
    // REQUEST WRAPPER
    // =========================================

    global class AuthRequest {
        public String idToken;
    }

    // =========================================
    // RESPONSE WRAPPER
    // =========================================

    global class AuthResponse {
        public Boolean success;
        public Boolean profileComplete;
        public String customerId;
        public String name;
        public String email;
        public String address;
        public String phone;
        public String message;
    }

    // =========================================
    // FIREBASE API KEY
    // =========================================
    // Move this to:
    // - Named Credential
    // - Protected Custom Metadata
    // in production
    // =========================================

    private static final String FIREBASE_API_KEY =
        'AIzaSyAeucTNcAromiBgbhjCQ_HTFFeNkcsK_X4';

    // =========================================
    // MAIN AUTH API
    // =========================================

    @HttpPost
    global static AuthResponse authenticate() {

        AuthResponse response =
            new AuthResponse();

        try {

            RestRequest req =
                RestContext.request;

            // =========================================
            // VALIDATE REQUEST
            // =========================================

            if (req.requestBody == null) {

                return buildError(
                    response,
                    'Request body missing.',
                    400
                );
            }

            AuthRequest authReq =

                (AuthRequest)
                JSON.deserialize(

                    req.requestBody.toString(),
                    AuthRequest.class
                );

            if (
                authReq == null ||
                String.isBlank(authReq.idToken)
            ) {

                return buildError(
                    response,
                    'Missing ID token.',
                    400
                );
            }

            // =========================================
            // VERIFY FIREBASE TOKEN
            // =========================================

            HttpRequest httpReq =
                new HttpRequest();

            httpReq.setEndpoint(

                'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='
                + FIREBASE_API_KEY
            );

            httpReq.setMethod('POST');

            httpReq.setHeader(
                'Content-Type',
                'application/json'
            );

            httpReq.setBody(

                JSON.serialize(

                    new Map<String, String>{

                        'idToken' =>
                            authReq.idToken
                    }
                )
            );

            Http http = new Http();

            HttpResponse httpRes =
                http.send(httpReq);

            System.debug(
                'Firebase Verify Response: '
                + httpRes.getBody()
            );

            if (
                httpRes.getStatusCode() != 200
            ) {

                return buildError(
                    response,
                    'Invalid Firebase token.',
                    401
                );
            }

            // =========================================
            // PARSE FIREBASE RESPONSE
            // =========================================

            Map<String, Object> result =

                (Map<String, Object>)
                JSON.deserializeUntyped(
                    httpRes.getBody()
                );

            List<Object> users =

                (List<Object>)
                result.get('users');

            if (
                users == null ||
                users.isEmpty()
            ) {

                return buildError(
                    response,
                    'Token verification failed.',
                    401
                );
            }

            Map<String, Object> userData =

                (Map<String, Object>)
                users[0];

            String firebaseUid =

                (String)
                userData.get('localId');

            String email =

                (String)
                userData.get('email');

            String name =

                (String)
                userData.get('displayName');

            if (
                String.isBlank(firebaseUid) ||
                String.isBlank(email)
            ) {

                return buildError(
                    response,
                    'Invalid token payload.',
                    400
                );
            }

            // =========================================
            // SYSTEM LEVEL CUSTOMER LOOKUP
            // =========================================

            CustomerResolver resolver =
                new CustomerResolver();

            Customer__c customer =

                resolver.findCustomer(
                    firebaseUid,
                    email
                );

            // =========================================
            // CREATE CUSTOMER IF NOT FOUND
            // =========================================

            if (customer == null) {

                customer =
                    new Customer__c(

                        OwnerId =
                            UserInfo.getUserId(),

                        Firebase_UID__c =
                            firebaseUid,

                        Name =
                            String.isBlank(name)
                            ? email
                            : name,

                        Email__c =
                            email
                    );

                insert customer;
            }

            // =========================================
            // PROFILE COMPLETION CHECK
            // =========================================

            Boolean profileComplete =

                !String.isBlank(
                    customer.Phone__c
                )

                &&

                !String.isBlank(
                    customer.Full_Name__c
                );

            // =========================================
            // SUCCESS RESPONSE
            // =========================================

            response.success = true;

            response.profileComplete =
                profileComplete;

            response.customerId =
                customer.Id;

            response.name =
                customer.Name;

            response.email =
                customer.Email__c;

            response.address =
                customer.Address__c;

            response.phone =
                customer.Phone__c;

            response.message =
                'Authentication successful.';

            RestContext.response.statusCode =
                200;

            return response;

        }
        catch (Exception e) {

            System.debug(
                'Auth Error: '
                + e.getMessage()
            );

            return buildError(
                response,
                'Authentication failed.',
                500
            );
        }
    }

    // =========================================
    // ERROR HANDLER
    // =========================================

    private static AuthResponse buildError(

        AuthResponse response,
        String message,
        Integer statusCode

    ) {

        response.success = false;

        response.profileComplete =
            false;

        response.message =
            message;

        RestContext.response.statusCode =
            statusCode;

        return response;
    }

    // =========================================
    // SYSTEM LEVEL CUSTOMER RESOLVER
    // =========================================

    private without sharing class CustomerResolver {

        public Customer__c findCustomer(

            String firebaseUid,
            String email

        ) {

            // =========================================
            // STEP 1:
            // FIND USING FIREBASE UID
            // =========================================

            List<Customer__c> uidMatch = [

                SELECT Id,
                       Name,
                       Email__c,
                       Phone__c,
                       Full_Name__c,
                       Firebase_UID__c,
                       Address__c

                FROM Customer__c

                WHERE Firebase_UID__c =
                    :firebaseUid

                LIMIT 1
            ];

            if (!uidMatch.isEmpty()) {

                return uidMatch[0];
            }

            // =========================================
            // STEP 2:
            // FIND USING EMAIL
            // =========================================

            List<Customer__c> emailMatch = [

                SELECT Id,
                       Name,
                       Email__c,
                       Phone__c,
                       Full_Name__c,
                       Firebase_UID__c,
                       Address__c

                FROM Customer__c

                WHERE Email__c =
                    :email

                LIMIT 1
            ];

            if (!emailMatch.isEmpty()) {

                Customer__c customer =
                    emailMatch[0];

                // =========================================
                // LINK FIREBASE UID
                // =========================================

                if (
                    String.isBlank(
                        customer.Firebase_UID__c
                    )
                ) {

                    customer.Firebase_UID__c =
                        firebaseUid;

                    update customer;
                }

                return customer;
            }

            return null;
        }
    }
}