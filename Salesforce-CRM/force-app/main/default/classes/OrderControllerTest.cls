@isTest
private class OrderControllerTest {

    // ==========================================
    // HTTP Callout Mock Implementation
    // ==========================================
    private class FirebaseHttpMock implements HttpCalloutMock {
        private Boolean isSuccess;
        private String uid;

        public FirebaseHttpMock(Boolean isSuccess, String uid) {
            this.isSuccess = isSuccess;
            this.uid = uid;
        }

        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            if (isSuccess) {
                res.setStatusCode(200);
                res.setBody('{"users": [{"localId": "' + uid + '"}]}');
            } else {
                res.setStatusCode(400);
                res.setBody('{"error": {"message": "INVALID_ID_TOKEN"}}');
            }
            return res;
        }
    }

    @isTest
    static void testCreateOrderSuccess() {
        // Arrange
        Customer__c cust = new Customer__c(
            Name = 'Test Customer',
            Firebase_UID__c = 'firebase-uid-123',
            Email__c = 'test@example.com'
        );
        insert cust;

        Restaurant__c rest = new Restaurant__c(
            Name = 'Test Restaurant',
            Is_Active__c = true,
            Is_Temporarily_Closed__c = false
        );
        insert rest;

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        
        req.requestURI = '/services/apexrest/order/create';
        req.httpMethod = 'POST';
        
        OrderController.OrderCreateRequest input = new OrderController.OrderCreateRequest();
        input.idToken = 'valid-token';
        input.restaurantId = rest.Id;
        input.orderTotal = 150.50;
        input.creditsUsed = 10.00;

        req.requestBody = Blob.valueOf(JSON.serialize(input));
        
        RestContext.request = req;
        RestContext.response = res;

        // Set the mock callout
        Test.setMock(HttpCalloutMock.class, new FirebaseHttpMock(true, 'firebase-uid-123'));

        // Act
        Test.startTest();
        OrderController.OrderCreateResponse response = OrderController.createOrder();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response, 'Response should not be null');
        System.assertEquals(true, response.success, 'Order creation should be successful');
        System.assertNotEquals(null, response.orderId, 'Order ID should be returned');
        System.assertEquals(200, res.statusCode, 'Status code should be 200');

        Order__c createdOrder = [
            SELECT Customer__c, Restaurant__c, Order_Total__c, Credits_Used__c, Order_Status__c, Payment_Status__c 
            FROM Order__c 
            WHERE Id = :response.orderId
        ];
        System.assertEquals(cust.Id, createdOrder.Customer__c);
        System.assertEquals(rest.Id, createdOrder.Restaurant__c);
        System.assertEquals(150.50, createdOrder.Order_Total__c);
        System.assertEquals(10.00, createdOrder.Credits_Used__c);
        System.assertEquals('PAYMENT_PENDING', createdOrder.Order_Status__c);
        System.assertEquals('UNPAID', createdOrder.Payment_Status__c);
    }

    @isTest
    static void testCreateOrderMissingRequestBody() {
        // Arrange
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/create';
        req.httpMethod = 'POST';
        req.requestBody = null; // Missing body

        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderController.OrderCreateResponse response = OrderController.createOrder();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Request body missing.', response.message);
        System.assertEquals(400, res.statusCode);
    }

    @isTest
    static void testCreateOrderInvalidInputs() {
        // Arrange
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/create';
        req.httpMethod = 'POST';

        OrderController.OrderCreateRequest input = new OrderController.OrderCreateRequest();
        input.idToken = ''; // Invalid
        input.restaurantId = 'someRestId';
        input.orderTotal = -10.0; // Invalid

        req.requestBody = Blob.valueOf(JSON.serialize(input));
        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderController.OrderCreateResponse response = OrderController.createOrder();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Invalid request data.', response.message);
        System.assertEquals(400, res.statusCode);
    }

    @isTest
    static void testCreateOrderInvalidAuthentication() {
        // Arrange
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/create';
        req.httpMethod = 'POST';

        OrderController.OrderCreateRequest input = new OrderController.OrderCreateRequest();
        input.idToken = 'invalid-token';
        input.restaurantId = 'someRestId';
        input.orderTotal = 50.0;

        req.requestBody = Blob.valueOf(JSON.serialize(input));
        RestContext.request = req;
        RestContext.response = res;

        // Set failing callout mock
        Test.setMock(HttpCalloutMock.class, new FirebaseHttpMock(false, null));

        // Act
        Test.startTest();
        OrderController.OrderCreateResponse response = OrderController.createOrder();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Invalid authentication.', response.message);
        System.assertEquals(401, res.statusCode);
    }

    @isTest
    static void testCreateOrderCustomerNotFound() {
        // Arrange
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/create';
        req.httpMethod = 'POST';

        OrderController.OrderCreateRequest input = new OrderController.OrderCreateRequest();
        input.idToken = 'non-existent-customer-token';
        input.restaurantId = 'someRestId';
        input.orderTotal = 50.0;

        req.requestBody = Blob.valueOf(JSON.serialize(input));
        RestContext.request = req;
        RestContext.response = res;

        // Mock returns success but the returned UID does not exist in CRM database
        Test.setMock(HttpCalloutMock.class, new FirebaseHttpMock(true, 'unknown-uid'));

        // Act
        Test.startTest();
        OrderController.OrderCreateResponse response = OrderController.createOrder();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Customer not found.', response.message);
        System.assertEquals(404, res.statusCode);
    }

    @isTest
    static void testCreateOrderRestaurantNotFound() {
        // Arrange
        Customer__c cust = new Customer__c(
            Name = 'Test Customer',
            Firebase_UID__c = 'firebase-uid-123'
        );
        insert cust;

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/create';
        req.httpMethod = 'POST';

        OrderController.OrderCreateRequest input = new OrderController.OrderCreateRequest();
        input.idToken = 'valid-token';
        input.restaurantId = cust.Id; // Use a fake Restaurant Id (Customer's Id)
        input.orderTotal = 50.0;

        req.requestBody = Blob.valueOf(JSON.serialize(input));
        RestContext.request = req;
        RestContext.response = res;

        Test.setMock(HttpCalloutMock.class, new FirebaseHttpMock(true, 'firebase-uid-123'));

        // Act
        Test.startTest();
        OrderController.OrderCreateResponse response = OrderController.createOrder();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Invalid restaurant.', response.message);
        System.assertEquals(400, res.statusCode);
    }

    @isTest
    static void testCreateOrderRestaurantNotAvailable() {
        // Arrange
        Customer__c cust = new Customer__c(
            Name = 'Test Customer',
            Firebase_UID__c = 'firebase-uid-123'
        );
        insert cust;

        Restaurant__c rest = new Restaurant__c(
            Name = 'Test Restaurant',
            Is_Active__c = false, // Inactive
            Is_Temporarily_Closed__c = false
        );
        insert rest;

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/create';
        req.httpMethod = 'POST';

        OrderController.OrderCreateRequest input = new OrderController.OrderCreateRequest();
        input.idToken = 'valid-token';
        input.restaurantId = rest.Id;
        input.orderTotal = 50.0;

        req.requestBody = Blob.valueOf(JSON.serialize(input));
        RestContext.request = req;
        RestContext.response = res;

        Test.setMock(HttpCalloutMock.class, new FirebaseHttpMock(true, 'firebase-uid-123'));

        // Act
        Test.startTest();
        OrderController.OrderCreateResponse response = OrderController.createOrder();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Restaurant not available.', response.message);
        System.assertEquals(400, res.statusCode);
    }

    @isTest
    static void testCreateOrderException() {
        // Arrange
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/create';
        req.httpMethod = 'POST';
        // Passing malformed JSON to force JSON deserialization exception
        req.requestBody = Blob.valueOf('{malformed json}');

        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderController.OrderCreateResponse response = OrderController.createOrder();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Order creation failed.', response.message);
        System.assertEquals(500, res.statusCode);
    }
}
