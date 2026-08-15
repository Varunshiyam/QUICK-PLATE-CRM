import { createElement } from '@lwc/engine-dom';
import FinanceDashboard from 'c/financeDashboard';

// Mock Custom Permission to false
jest.mock(
    '@salesforce/customPermission/Finance_LWC_Components',
    () => {
        return { default: false };
    },
    { virtual: true }
);

describe('c-finance-dashboard-access-denied', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders access denied message when custom permission is missing', () => {
        // Arrange
        const element = createElement('c-finance-dashboard', {
            is: FinanceDashboard
        });

        // Act
        document.body.appendChild(element);

        // Assert
        const errorCard = element.shadowRoot.querySelector('lightning-card');
        expect(errorCard).not.toBeNull();
        expect(errorCard.textContent).toContain('Access Denied');

        const dashboardContainer = element.shadowRoot.querySelector('.dashboard-container');
        expect(dashboardContainer).toBeNull();
    });
});
