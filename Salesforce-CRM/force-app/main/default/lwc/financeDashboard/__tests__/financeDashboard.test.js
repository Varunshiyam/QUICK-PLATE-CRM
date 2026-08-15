const mockNavigate = jest.fn();

// Mock lightning/navigation custom implementation
jest.mock(
    'lightning/navigation',
    () => {
        const Navigate = Symbol('Navigate');
        const GenerateUrl = Symbol('GenerateUrl');
        const NavigationMixin = (Base) => {
            return class extends Base {
                [Navigate](pageReference, replace) {
                    const cloned = pageReference ? JSON.parse(JSON.stringify(pageReference)) : pageReference;
                    mockNavigate(cloned, replace);
                }
                [GenerateUrl]() {
                    return Promise.resolve('https://www.example.com');
                }
            };
        };
        NavigationMixin.Navigate = Navigate;
        NavigationMixin.GenerateUrl = GenerateUrl;

        return {
            NavigationMixin,
            CurrentPageReference: jest.fn()
        };
    },
    { virtual: true }
);

import { createElement } from '@lwc/engine-dom';
import FinanceDashboard from 'c/financeDashboard';
import getDashboardData from '@salesforce/apex/FinanceDashboardController.getDashboardData';

// Mock Custom Permission to true
jest.mock(
    '@salesforce/customPermission/Finance_LWC_Components',
    () => {
        return { default: true };
    },
    { virtual: true }
);

// Mock Apex method
jest.mock(
    '@salesforce/apex/FinanceDashboardController.getDashboardData',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

import { NavigationMixin } from 'lightning/navigation';

const MOCK_DATA = {
    netRevenue: 50000,
    grossRevenue: 60000,
    totalRefunds: 10000,
    refundPercentage: 16.7,
    priorWeekRefundPercentage: 15.0,
    failedTransactions: 5,
    failureRate: 2.5,
    aov: 50,
    refundPerOrder: 8,
    successRate: 85.0,
    failedRate: 5.0,
    pendingRate: 10.0,
    dailyTrends: [
        { day: 'Mon', revenue: 1000, refund: 100 },
        { day: 'Tue', revenue: 1200, refund: 200 }
    ],
    topRestaurants: [
        { name: 'Pizza Palace', amount: 500, recordId: '001xx000003D1aaAAA' }
    ],
    topCustomers: [
        { name: 'John Doe', amount: 200, recordId: '003xx000004Y2bbBBB' }
    ],
    highRefundOrders: [
        { name: 'ORD-001', amount: 150, recordId: '801xx000005Z3ccCCC' }
    ],
    recentTransactions: [
        { Id: 'tx1', OrderId: 'ORD-001', isRefund: false, Amount: 150, Status: 'Success', TimeStr: '12:00 PM' },
        { Id: 'tx2', OrderId: 'ORD-002', isRefund: true, Amount: 50, Status: 'Success', TimeStr: '12:30 PM' }
    ]
};

describe('c-finance-dashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default Apex mock resolved value
        getDashboardData.mockResolvedValue(MOCK_DATA);
    });

    afterEach(() => {
        // Reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper to resolve promises
    async function flushPromises() {
        for (let i = 0; i < 5; i++) {
            await Promise.resolve();
        }
    }

    it('renders loading spinner when data is fetching', async () => {
        // Arrange
        getDashboardData.mockReturnValue(new Promise(() => {})); // Unresolved promise
        const element = createElement('c-finance-dashboard', {
            is: FinanceDashboard
        });

        // Act
        document.body.appendChild(element);

        // Assert
        const spinner = element.shadowRoot.querySelector('lightning-spinner');
        expect(spinner).not.toBeNull();
        expect(getDashboardData).toHaveBeenCalledTimes(1);
    });

    it('renders dashboard UI and KPI cards once data is loaded successfully', async () => {
        // Arrange
        const element = createElement('c-finance-dashboard', {
            is: FinanceDashboard
        });

        // Act
        document.body.appendChild(element);
        await flushPromises();

        // Assert
        const spinner = element.shadowRoot.querySelector('lightning-spinner');
        expect(spinner).toBeNull();

        // Verify some KPI elements are rendered
        const kpiTitles = Array.from(element.shadowRoot.querySelectorAll('.kpi-title')).map(el => el.textContent);
        expect(kpiTitles).toContain('Company Balance');
        expect(kpiTitles).toContain('Total Refunds');
        expect(kpiTitles).toContain('Refund Percentage');

        const numberFormatters = element.shadowRoot.querySelectorAll('lightning-formatted-number');
        expect(numberFormatters.length).toBeGreaterThan(0);
    });

    it('refetches data when time filter dropdown changes', async () => {
        // Arrange
        const element = createElement('c-finance-dashboard', {
            is: FinanceDashboard
        });

        // Act
        document.body.appendChild(element);
        await flushPromises();

        expect(getDashboardData).toHaveBeenCalledTimes(1);
        expect(getDashboardData).toHaveBeenLastCalledWith({ timeFilter: 'THIS_MONTH' });

        // Trigger filter change
        const combobox = element.shadowRoot.querySelector('lightning-combobox');
        combobox.dispatchEvent(
            new CustomEvent('change', {
                detail: { value: 'TODAY' }
            })
        );
        await flushPromises();

        // Assert
        expect(getDashboardData).toHaveBeenCalledTimes(2);
        expect(getDashboardData).toHaveBeenLastCalledWith({ timeFilter: 'TODAY' });
    });

    it('navigates to record detail page when view button is clicked', async () => {
        // Arrange
        const element = createElement('c-finance-dashboard', {
            is: FinanceDashboard
        });

        // Act
        document.body.appendChild(element);
        await flushPromises();

        // Find and click the first recent transaction view button
        const viewBtn = element.shadowRoot.querySelector('table tr button');
        expect(viewBtn).not.toBeNull();
        viewBtn.click();

        // Assert navigation call
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate.mock.calls[0][0]).toEqual({
            type: 'standard__recordPage',
            attributes: {
                recordId: 'tx1',
                actionName: 'view'
            }
        });
    });
});