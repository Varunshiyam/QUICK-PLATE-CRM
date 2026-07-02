@RestResource(urlMapping='/checkout/create-session')
global without sharing class StripeCheckoutController {

    global class SessionRequest {
        public String idToken; // 🔥 REQUIRED
        public String orderId;
    }

    global class SessionResponse {
        public Boolean success;
        public String checkoutUrl;
        public String message;
    }

    // 🔒 Move to Named Credential / Custom Metadata
    private static final String STRIPE_SECRET_KEY = 'PLACEHOLDER_STRIPE_SECRET_KEY';

    @HttpPost
    global static SessionResponse createSession() {

        SessionResponse res = new SessionResponse();

        try {

            RestRequest req = RestContext.request;

            if (req.requestBody == null) {
                return error(res, 'Request body missing.', 400);
            }

            SessionRequest input =
                (SessionRequest) JSON.deserialize(
                    req.requestBody.toString(),
                    SessionRequest.class
                );

            if (input == null || String.isBlank(input.orderId)) {
                return error(res, 'Invalid orderId.', 400);
            }

            if (String.isBlank(input.idToken)) {
                return error(res, 'Authentication required.', 401);
            }

            // ===============================
            // 🔐 VERIFY FIREBASE TOKEN
            // ===============================
            String firebaseUid =
                FirebaseAuthUtil.verifyToken(input.idToken);

            if (String.isBlank(firebaseUid)) {
                return error(res, 'Invalid authentication.', 401);
            }

            // ===============================
            // ✅ RESOLVE CUSTOMER FROM UID
            // ===============================
            List<Customer__c> customers = [
                SELECT Id
                FROM Customer__c
                WHERE Firebase_UID__c = :firebaseUid
                LIMIT 1
            ];

            if (customers.isEmpty()) {
                return error(res, 'Customer not found.', 404);
            }

            Id customerId = customers[0].Id;

            // ===============================
            // ✅ SAFE ORDER FETCH
            // ===============================
            List<Order__c> orders = [
                SELECT Id, Order_Total__c, Payment_Status__c, Order_Number__c,
                       Payment_Transaction__c, Customer__c
                FROM Order__c
                WHERE Id = :input.orderId
                LIMIT 1
            ];

            if (orders.isEmpty()) {
                return error(res, 'Order not found.', 404);
            }

            Order__c order = orders[0];

            // 🔥 CRITICAL SECURITY CHECK
            // Only the customer who owns the order may initiate its payment.
            if (order.Customer__c != customerId) {
                return error(res, 'You are not authorized to pay for this order.', 403);
            }

            // ===============================
            // ✅ VALIDATION
            // ===============================
            if (order.Payment_Status__c == 'PAID') {
                return error(res, 'Order already paid.', 400);
            }

            if (order.Order_Total__c == null || order.Order_Total__c <= 0) {
                return error(res, 'Invalid order amount.', 400);
            }

            // ===============================
            // ✅ IDEMPOTENCY CHECK
            // ===============================
            List<Payment_Transaction__c> existingTxn = [
                SELECT Id, Stripe_Session_Id__c
                FROM Payment_Transaction__c
                WHERE Order__c = :order.Id
                AND Transaction_Status__c = 'PENDING'
                LIMIT 1
            ];

            if (!existingTxn.isEmpty()) {
                return error(res, 'Payment already initiated.', 400);
            }

            // ===============================
            // 🔗 STRIPE CALL
            // ===============================
            
            String frontendUrl = 'https://quick-plate-crm.web.app';

            HttpRequest httpReq = new HttpRequest();
            httpReq.setEndpoint('callout:Stripe_API/v1/checkout/sessions');
            httpReq.setMethod('POST');
            httpReq.setHeader('Authorization', 'Bearer ' + STRIPE_SECRET_KEY);
            httpReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');

            String body =
                'mode=payment' +
                '&success_url=' + EncodingUtil.urlEncode(
                    frontendUrl + '/payment-success?orderId=' + order.Id,
                    'UTF-8'
                ) +
                '&cancel_url=' + EncodingUtil.urlEncode(
                    frontendUrl + '/payment-cancel?orderId=' + order.Id,
                    'UTF-8'
                ) +
                '&line_items[0][price_data][currency]=inr' +
                '&line_items[0][price_data][product_data][name]=' +
                EncodingUtil.urlEncode('Quick Plate Order ' + order.Order_Number__c, 'UTF-8') +
                '&line_items[0][price_data][unit_amount]=' +
                String.valueOf((Integer)(order.Order_Total__c * 100)) +
                '&line_items[0][quantity]=1';

            httpReq.setBody(body);

            Http http = new Http();
            HttpResponse httpRes = http.send(httpReq);

            if (httpRes.getStatusCode() != 200) {
                return error(res, 'Stripe error: ' + httpRes.getBody(), 500);
            }

            Map<String, Object> result =
                (Map<String, Object>) JSON.deserializeUntyped(httpRes.getBody());

            String checkoutUrl = (String) result.get('url');
            String sessionId = (String) result.get('id');

            // ===============================
            // ✅ INSERT PAYMENT TRANSACTION
            // ===============================
            Payment_Transaction__c txn = new Payment_Transaction__c(
                Name = 'PAY-' + order.Order_Number__c,
                Order__c = order.Id,
                Transaction_Type__c = 'PAYMENT',
                Transaction_Status__c = 'PENDING',
                Amount__c = order.Order_Total__c,
                Stripe_Session_Id__c = sessionId
            );

            insert txn;

            // ===============================
            // ✅ LINK ORDER
            // ===============================
            update new Order__c(
                Id = order.Id,
                Payment_Transaction__c = txn.Id
            );

            // ===============================
            // ✅ RESPONSE
            // ===============================
            res.success = true;
            res.checkoutUrl = checkoutUrl;
            return res;

        } catch (Exception e) {

            System.debug('Stripe Error: ' + e.getMessage());

            return error(res, 'Checkout failed: ' + e.getMessage(), 500);
        }
    }

    private static SessionResponse error(SessionResponse res, String msg, Integer code) {
        res.success = false;
        res.message = msg;
        RestContext.response.statusCode = code;
        return res;
    }
}