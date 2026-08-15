@isTest
private class OrderLifecycleControllerTest {

    private static User createTestUser(Boolean withPermission) {
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User' LIMIT 1];
        String uniqueName = 'opuser' + DateTime.now().getTime() + '@testorg.com';
        User u = new User(
            Alias = 'opuser',
            Email = 'opuser@testorg.com',
            EmailEncodingKey = 'UTF-8',
            LastName = 'Testing',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            ProfileId = p.Id,
            TimeZoneSidKey = 'America/Los_Angeles',
            UserName = uniqueName
        );
        insert u;

        if (withPermission) {
            PermissionSet ps = [SELECT Id FROM PermissionSet WHERE Name = 'QuickPlate_Operations_Team' LIMIT 1];
            insert new PermissionSetAssignment(AssigneeId = u.Id, PermissionSetId = ps.Id);
        }
        return u;
    }

    @isTest
    static void testGetActiveOrdersWithPermission() {
        // Arrange
        User u = createTestUser(true);

        System.runAs(u) {
            Customer__c cust = new Customer__c(Name = 'Test Customer');
            insert cust;

            Restaurant__c rest = new Restaurant__c(Name = 'Test Restaurant');
            insert rest;

            Delivery_Agent__c agent = new Delivery_Agent__c(Name = 'Test Agent', Full_Name__c = 'Agent Full Name');
            insert agent;

            // Order 1: Status != DELIVERED (should be returned)
            Order__c o1 = new Order__c(
                Customer__c = cust.Id,
                Restaurant__c = rest.Id,
                Delivery_Agent__c = agent.Id,
                Order_Status__c = 'PREPARING',
                Order_Total__c = 100.00
            );
            insert o1;

            // Order 2: Status = DELIVERED, but created within last 24h (should be returned)
            Order__c o2 = new Order__c(
                Customer__c = cust.Id,
                Restaurant__c = rest.Id,
                Delivery_Agent__c = agent.Id,
                Order_Status__c = 'DELIVERED',
                Order_Total__c = 50.00
            );
            insert o2;

            // Order 3: Status = DELIVERED, created > 24h ago (should NOT be returned)
            Order__c o3 = new Order__c(
                Customer__c = cust.Id,
                Restaurant__c = rest.Id,
                Delivery_Agent__c = agent.Id,
                Order_Status__c = 'DELIVERED',
                Order_Total__c = 75.00
            );
            insert o3;
            // Set created date to 30 hours ago
            Test.setCreatedDate(o3.Id, Datetime.now().addHours(-30));

            // Act
            Test.startTest();
            List<OrderLifecycleController.OrderWrapper> activeOrders = OrderLifecycleController.getActiveOrders();
            Test.stopTest();

            // Assert
            System.assertEquals(2, activeOrders.size(), 'Should return 2 active orders');
            
            Set<Id> returnedOrderIds = new Set<Id>();
            for (OrderLifecycleController.OrderWrapper wrapper : activeOrders) {
                returnedOrderIds.add(wrapper.order.Id);
                System.assertNotEquals(null, wrapper.canEdit, 'wrapper.canEdit should be populated');
            }
            System.assert(returnedOrderIds.contains(o1.Id), 'Should contain o1');
            System.assert(returnedOrderIds.contains(o2.Id), 'Should contain o2');
            System.assert(!returnedOrderIds.contains(o3.Id), 'Should NOT contain o3');
        }
    }

    @isTest
    static void testGetActiveOrdersWithoutPermission() {
        // Arrange
        User u = createTestUser(false);

        System.runAs(u) {
            // Act & Assert
            Test.startTest();
            try {
                OrderLifecycleController.getActiveOrders();
                System.assert(false, 'Should have thrown AuraHandledException');
            } catch (AuraHandledException e) {
                System.assertEquals('Script-thrown exception', e.getMessage(), 'Exception message should indicate script-thrown exception');
            }
            Test.stopTest();
        }
    }

    @isTest
    static void testGetActiveOrdersEmpty() {
        // Arrange
        User u = createTestUser(true);

        System.runAs(u) {
            // Act
            Test.startTest();
            List<OrderLifecycleController.OrderWrapper> activeOrders = OrderLifecycleController.getActiveOrders();
            Test.stopTest();

            // Assert
            System.assertEquals(0, activeOrders.size(), 'Should return empty list');
        }
    }

    @isTest
    static void testUpdateOrderStatusWithPermission() {
        // Arrange
        User u = createTestUser(true);

        System.runAs(u) {
            Customer__c cust = new Customer__c(Name = 'Test Customer');
            insert cust;

            Restaurant__c rest = new Restaurant__c(Name = 'Test Restaurant');
            insert rest;

            Order__c o = new Order__c(
                Customer__c = cust.Id,
                Restaurant__c = rest.Id,
                Order_Status__c = 'PREPARING',
                Order_Total__c = 100.00
            );
            insert o;

            // Act
            Test.startTest();
            OrderLifecycleController.updateOrderStatus(o.Id, 'OUT_FOR_DELIVERY');
            Test.stopTest();

            // Assert
            Order__c updatedOrder = [SELECT Order_Status__c FROM Order__c WHERE Id = :o.Id];
            System.assertEquals('OUT_FOR_DELIVERY', updatedOrder.Order_Status__c, 'Status should be updated');
        }
    }

    @isTest
    static void testUpdateOrderStatusWithoutPermission() {
        // Arrange
        User u = createTestUser(false);

        Customer__c cust = new Customer__c(Name = 'Test Customer');
        insert cust;

        Restaurant__c rest = new Restaurant__c(Name = 'Test Restaurant');
        insert rest;

        Order__c o = new Order__c(
            Customer__c = cust.Id,
            Restaurant__c = rest.Id,
            Order_Status__c = 'PREPARING',
            Order_Total__c = 100.00
        );
        insert o;

        System.runAs(u) {
            // Act & Assert
            Test.startTest();
            try {
                OrderLifecycleController.updateOrderStatus(o.Id, 'OUT_FOR_DELIVERY');
                System.assert(false, 'Should have thrown AuraHandledException');
            } catch (AuraHandledException e) {
                System.assertEquals('Script-thrown exception', e.getMessage());
            }
            Test.stopTest();
        }
    }
}
