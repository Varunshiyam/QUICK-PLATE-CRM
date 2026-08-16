@isTest
private class OrderStatusControllerTest {

    @isTest
    static void testGetStatusSuccessWithAgent() {
        // Arrange
        Customer__c cust = new Customer__c(Name = 'Test Customer');
        insert cust;

        Restaurant__c rest = new Restaurant__c(Name = 'Test Restaurant');
        insert rest;

        Delivery_Agent__c agent = new Delivery_Agent__c(
            Name = 'A-001',
            Full_Name__c = 'John Doe'
        );
        insert agent;

        Order__c order = new Order__c(
            Customer__c = cust.Id,
            Restaurant__c = rest.Id,
            Delivery_Agent__c = agent.Id,
            Order_Status__c = 'PREPARING',
            Payment_Status__c = 'PAID',
            Order_Total__c = 100.00
        );
        insert order;

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/status/' + order.Id;
        req.httpMethod = 'GET';

        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderStatusController.StatusResponse response = OrderStatusController.getStatus();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response, 'Response should not be null');
        System.assertEquals(true, response.success, 'Status fetch should be successful');
        System.assertEquals(order.Id, response.orderId);
        System.assertEquals('PREPARING', response.orderStatus);
        System.assertEquals('PAID', response.paymentStatus);
        System.assertNotEquals(null, response.agent, 'Agent info should be returned');
        System.assertEquals('John Doe', response.agent.name, 'Should use Full_Name__c if available');
        System.assertEquals(200, res.statusCode);
    }

    @isTest
    static void testGetStatusSuccessWithAgentFallbackName() {
        // Arrange
        Customer__c cust = new Customer__c(Name = 'Test Customer');
        insert cust;

        Restaurant__c rest = new Restaurant__c(Name = 'Test Restaurant');
        insert rest;

        Delivery_Agent__c agent = new Delivery_Agent__c(
            Name = 'A-002' // No Full_Name__c populated
        );
        insert agent;

        Order__c order = new Order__c(
            Customer__c = cust.Id,
            Restaurant__c = rest.Id,
            Delivery_Agent__c = agent.Id,
            Order_Status__c = 'PREPARING',
            Payment_Status__c = 'PAID',
            Order_Total__c = 100.00
        );
        insert order;

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/status/' + order.Id;
        req.httpMethod = 'GET';

        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderStatusController.StatusResponse response = OrderStatusController.getStatus();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(true, response.success);
        System.assertNotEquals(null, response.agent);
        System.assertEquals('A-002', response.agent.name, 'Should fallback to Name if Full_Name__c is null');
        System.assertEquals(200, res.statusCode);
    }

    @isTest
    static void testGetStatusSuccessWithoutAgent() {
        // Arrange
        Customer__c cust = new Customer__c(Name = 'Test Customer');
        insert cust;

        Restaurant__c rest = new Restaurant__c(Name = 'Test Restaurant');
        insert rest;

        Order__c order = new Order__c(
            Customer__c = cust.Id,
            Restaurant__c = rest.Id,
            Delivery_Agent__c = null, // No agent
            Order_Status__c = 'PREPARING',
            Payment_Status__c = 'PAID',
            Order_Total__c = 100.00
        );
        insert order;

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/status/' + order.Id;
        req.httpMethod = 'GET';

        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderStatusController.StatusResponse response = OrderStatusController.getStatus();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(true, response.success);
        System.assertEquals(null, response.agent, 'Agent should be null');
        System.assertEquals(200, res.statusCode);
    }

    @isTest
    static void testGetStatusInvalidRequestURI() {
        // Arrange
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = null; // Invalid URI
        req.httpMethod = 'GET';

        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderStatusController.StatusResponse response = OrderStatusController.getStatus();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Invalid request.', response.message);
        System.assertEquals(400, res.statusCode);
    }

    @isTest
    static void testGetStatusMissingOrderId() {
        // Arrange
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        req.requestURI = '/services/apexrest/order/status/'; // Missing order ID after slash
        req.httpMethod = 'GET';

        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderStatusController.StatusResponse response = OrderStatusController.getStatus();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Missing orderId.', response.message);
        System.assertEquals(400, res.statusCode);
    }

    @isTest
    static void testGetStatusOrderNotFound() {
        // Arrange
        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();
        // Generate a valid fake ID format for Order__c object (prefix 'a01' or similar, but 18 characters)
        String fakeOrderId = 'a00000000000000AAA'; 
        req.requestURI = '/services/apexrest/order/status/' + fakeOrderId;
        req.httpMethod = 'GET';

        RestContext.request = req;
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderStatusController.StatusResponse response = OrderStatusController.getStatus();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Order not found.', response.message);
        System.assertEquals(404, res.statusCode);
    }

    @isTest
    static void testGetStatusException() {
        // Arrange
        // Leave RestContext.request as null to trigger a NullPointerException
        RestContext.request = null;
        RestResponse res = new RestResponse();
        RestContext.response = res;

        // Act
        Test.startTest();
        OrderStatusController.StatusResponse response = OrderStatusController.getStatus();
        Test.stopTest();

        // Assert
        System.assertNotEquals(null, response);
        System.assertEquals(false, response.success);
        System.assertEquals('Failed to fetch order status.', response.message);
        System.assertEquals(500, res.statusCode);
    }
}
