const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRestaurants = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/services/apexrest/restaurant/list`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        throw error;
    }
};
