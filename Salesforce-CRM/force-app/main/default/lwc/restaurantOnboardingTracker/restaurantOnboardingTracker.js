import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getMySubmittedRestaurants from '@salesforce/apex/RestaurantOnboardingTrackerCtrl.getMySubmittedRestaurants';
import submitRestaurantForApproval from '@salesforce/apex/RestaurantOnboardingTrackerCtrl.submitRestaurantForApproval';

export default class RestaurantOnboardingTracker extends LightningElement {
    @track isSubmitting = false;
    @track submissions = [];
    @track isLoading = true;

    wiredTrackerResult;

    @wire(getMySubmittedRestaurants)
    wiredSubmissions(result) {
        this.wiredTrackerResult = result;
        if (result.data) {
            this.submissions = result.data.map(sub => {
                let badgeClass = 'badge badge-default';
                if(sub.approvalStatus === 'Approved') badgeClass = 'badge badge-approved';
                else if(sub.approvalStatus === 'Rejected') badgeClass = 'badge badge-rejected';
                else if(sub.approvalStatus === 'Pending') badgeClass = 'badge badge-pending';
                
                return {
                    ...sub,
                    statusBadgeClass: badgeClass
                };
            });
            this.isLoading = false;
        } else if (result.error) {
            this.isLoading = false;
            this.showToast('Error', 'Error loading tracker data', 'error');
            console.error(result.error);
        }
    }

    handleSubmit(event) {
        event.preventDefault(); 
        const fields = event.detail.fields;

        // Input validation
        let isValid = true;
        let errorMessage = '';

        if (!fields.Name || fields.Name.trim() === '') {
            isValid = false;
            errorMessage = 'Restaurant Name is required.';
        } else if (!fields.Restaurant_Code__c || fields.Restaurant_Code__c.trim() === '') {
            isValid = false;
            errorMessage = 'Restaurant Code is required.';
        } else if (!fields.Restaurant_Owner__c) {
            isValid = false;
            errorMessage = 'Restaurant Owner is required.';
        } else if (!fields.City__c) {
            isValid = false;
            errorMessage = 'City is required.';
        } else if (fields.Avg_Prep_Time_Min__c === null || fields.Avg_Prep_Time_Min__c === undefined || String(fields.Avg_Prep_Time_Min__c).trim() === '') {
            isValid = false;
            errorMessage = 'Average Prep Time is required.';
        } else if (Number(fields.Avg_Prep_Time_Min__c) <= 0) {
            isValid = false;
            errorMessage = 'Average preparation time must be greater than zero.';
        }

        // Trigger LWC validity styling
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if (inputFields) {
            inputFields.forEach(field => {
                if (typeof field.reportValidity === 'function') {
                    field.reportValidity();
                }
            });
        }

        if (!isValid) {
            this.showToast('Validation Error', errorMessage, 'error');
            return;
        }

        this.isSubmitting = true;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event) {
        const recordId = event.detail.id;
        
        submitRestaurantForApproval({ restaurantId: recordId })
            .then(() => {
                this.showToast('Success', 'Restaurant created and submitted for approval!', 'success');
                const inputFields = this.template.querySelectorAll('lightning-input-field');
                if (inputFields) {
                    inputFields.forEach(field => field.reset());
                }
                return refreshApex(this.wiredTrackerResult);
            })
            .catch(error => {
                console.error(error);
                let message = error.body ? error.body.message : error.message;
                // Sometimes Salesforce might throw a specific error if process definition isn't found
                this.showToast('Submit Error', message, 'error');
            })
            .finally(() => {
                this.isSubmitting = false;
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title, message, variant
        }));
    }
}