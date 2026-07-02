@RestResource(urlMapping='/case/create')
global without sharing class SupportTicketController {

    // ================================
    // Request Wrapper
    // ================================
    global class TicketRequest {
        public String idToken; // 🔥 REQUIRED
        public Id orderId;
        public String type;
        public String description;
        public String reason;
        public String caseId;
    }

    // ================================
    // Response Wrapper
    // ================================
    global class TicketResponse {
        public Boolean success;
        public String ticketId;
        public String message;
    }

    @HttpPost
    global static TicketResponse createTicket() {

        TicketResponse res = new TicketResponse();

        try {

            RestRequest req = RestContext.request;

            if(req.requestBody == null){
                return buildError(res,'Request body missing',400);
            }

            TicketRequest input =
                (TicketRequest) JSON.deserialize(
                    req.requestBody.toString(),
                    TicketRequest.class
                );

            // ================================
            // 🔥 VALIDATION
            // ================================
            if(input == null ||
               String.isBlank(input.idToken) ||
               input.orderId == null){
                return buildError(res,'Invalid request',400);
            }

            if(String.isBlank(input.type)){
                return buildError(res,'Issue type is required',400);
            }

            // ================================
            // 🔐 VERIFY TOKEN
            // ================================
            String firebaseUid = FirebaseAuthUtil.verifyToken(input.idToken);

            if(String.isBlank(firebaseUid)){
                return buildError(res,'Invalid authentication',401);
            }

            // ================================
            // ✅ FETCH CUSTOMER FROM UID
            // ================================
            List<Customer__c> customers = [
                SELECT Id
                FROM Customer__c
                WHERE Firebase_UID__c = :firebaseUid
                LIMIT 1
            ];

            if(customers.isEmpty()){
                return buildError(res,'Customer not found',404);
            }

            Id customerId = customers[0].Id;

            // ================================
            // ✅ FETCH ORDER
            // ================================
            List<Order__c> orders = [
                SELECT Id,
                       Customer__c,
                       Restaurant__c,
                       Delivery_Agent__c,
                       Refund_Requested__c
                FROM Order__c
                WHERE Id = :input.orderId
                LIMIT 1
            ];

            if(orders.isEmpty()){
                return buildError(res,'Invalid orderId',404);
            }

            Order__c ord = orders[0];

            // 🔥 CRITICAL SECURITY CHECK
            if(ord.Customer__c != customerId){
                return buildError(res,'Unauthorized access',403);
            }

            // ================================
            // 🔁 REFUND PROTECTION
            // ================================
            if(input.type == 'Refund Request'){

                if(ord.Refund_Requested__c == true){
                    return buildError(res,'Refund already requested',400);
                }

                List<Support_Ticket__c> existingRefund = [
                    SELECT Id
                    FROM Support_Ticket__c
                    WHERE Order__c = :ord.Id
                    AND Issue_Type__c = 'Refund Request'
                    LIMIT 1
                ];

                if(!existingRefund.isEmpty()){
                    return buildError(res,'Refund ticket already exists',400);
                }
            }

            // ================================
            // 📊 ISSUE COUNT
            // ================================
            Integer issueCount = [
                SELECT COUNT()
                FROM Support_Ticket__c
                WHERE Customer__c = :customerId
            ];

            issueCount++;

            // ================================
            // 🧾 CREATE TICKET
            // ================================
            Support_Ticket__c ticket = new Support_Ticket__c(
                Order__c = ord.Id,
                Customer__c = customerId,
                Restaurant__c = ord.Restaurant__c,
                Issue_Type__c = input.type,
                Reason_for_Issue__c = input.reason,
                Investigation_Notes__c = input.description,
                Ticket_Status__c = 'NEW',
                Created_At__c = System.now(),
                Case_No__c = input.caseId,
                Issue_Source__c = 'Customer',
                Customer_Issue_Count__c = issueCount
            );

            // Only set Delivery Agent if one exists
            if(ord.Delivery_Agent__c != null){
                ticket.Delivery_Agent__c = ord.Delivery_Agent__c;
            }

            if(input.type == 'Refund Request'){
                ticket.Priority__c = 'HIGH';
            }

            Id queueId = getQueueId('Customer Service Queue');
            if(queueId != null){
                ticket.OwnerId = queueId;
            }

            insert ticket;

            // ================================
            // 🔄 UPDATE ORDER
            // ================================
            Order__c orderUpdate = new Order__c(
                Id = ord.Id,
                Support_Ticket__c = ticket.Id
            );

            if(input.type == 'Refund Request'){
                orderUpdate.Refund_Requested__c = true;
                orderUpdate.Refund_Type__c = 'CREDIT';
            }

            update orderUpdate;

            res.success = true;
            res.ticketId = ticket.Id;

            RestContext.response.statusCode = 200;
            return res;

        } catch(Exception e){

            System.debug('Ticket Error: ' + e.getMessage() + ' | Stack: ' + e.getStackTraceString());

            return buildError(res,'Ticket creation failed. Please try again later.',500);
        }
    }

    private static Id getQueueId(String queueName) {

        List<Group> queues = [
            SELECT Id
            FROM Group
            WHERE Type = 'Queue'
            AND Name = :queueName
            LIMIT 1
        ];

        return queues.isEmpty() ? null : queues[0].Id;
    }

    private static TicketResponse buildError(
        TicketResponse res,
        String message,
        Integer code
    ){
        res.success = false;
        res.message = message;
        RestContext.response.statusCode = code;
        return res;
    }
}