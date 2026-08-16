@RestResource(urlMapping='/case/list')
global without sharing class SupportTicketStatusController {

    // ======================================
    // Response Wrapper
    // ======================================
    global class TicketStatusResponse {
        public Id ticketId;
        public Id orderId;
        public String restaurantName;
        public String issueType;
        public String status;
        public String description;
        public String reason;
        public Datetime createdAt;
        public String caseNumber;
    }

    global class ResponseWrapper {
        public Boolean success;
        public String message;
        public List<TicketStatusResponse> tickets;
    }

    // ======================================
    // GET Tickets
    // ======================================
    @HttpGet
    global static ResponseWrapper getTickets() {

        ResponseWrapper res = new ResponseWrapper();

        try {

            RestRequest req = RestContext.request;
            String idToken = req.params.get('idToken');

            // ✅ Validate input
            if(String.isBlank(idToken)){
                return error(res, 'Authentication required.', 401);
            }

            // ===============================
            // 🔐 VERIFY TOKEN
            // ===============================
            String firebaseUid = FirebaseAuthUtil.verifyToken(idToken);

            if(String.isBlank(firebaseUid)){
                return error(res, 'Invalid authentication.', 401);
            }

            // ===============================
            // ✅ Fetch Customer
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

            Id customerId = customers[0].Id;

            // ===============================
            // ✅ Fetch Tickets
            // ===============================
            List<Support_Ticket__c> tickets = [
                SELECT Id,
                       Order__c,
                       Issue_Type__c,
                       Ticket_Status__c,
                       Investigation_Notes__c,
                       Customer_Visible_Notes__c,
                       Reason_for_Issue__c,
                       Created_At__c,
                       Case_No__c,
                       Restaurant__r.Name
                FROM Support_Ticket__c
                WHERE Customer__c = :customerId
                ORDER BY Created_At__c DESC
                LIMIT 50
            ];

            List<TicketStatusResponse> responseList = new List<TicketStatusResponse>();

            for(Support_Ticket__c t : tickets){

                TicketStatusResponse r = new TicketStatusResponse();

                r.ticketId = t.Id;
                r.orderId = t.Order__c;
                r.issueType = t.Issue_Type__c;
                r.status = t.Ticket_Status__c;
                r.reason = t.Reason_for_Issue__c;
                r.createdAt = t.Created_At__c;
                r.caseNumber = t.Case_No__c;

                // ✅ Restaurant name safety
                r.restaurantName =
                    (t.Restaurant__r != null && t.Restaurant__r.Name != null)
                    ? t.Restaurant__r.Name
                    : 'Quick Plate';

                // ======================================
                // Customer Message Logic
                // ======================================
                if(String.isBlank(t.Customer_Visible_Notes__c)){
                    r.description = 'In-Progress';
                } else {
                    r.description = t.Customer_Visible_Notes__c;
                }

                responseList.add(r);
            }

            res.success = true;
            res.tickets = responseList;

            RestContext.response.statusCode = 200;
            return res;

        } catch (Exception e) {

            System.debug('Ticket List Error: ' + e.getMessage());

            return error(res, 'Failed to fetch tickets.', 500);
        }
    }

    // ======================================
    // ERROR HANDLER
    // ======================================
    private static ResponseWrapper error(
        ResponseWrapper res,
        String msg,
        Integer code
    ){
        res.success = false;
        res.message = msg;
        RestContext.response.statusCode = code;
        return res;
    }
}