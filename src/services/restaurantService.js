const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRestaurants = async () => {
    try {
        if (!API_BASE_URL) {
            throw new Error("VITE_API_BASE_URL is not configured.");
        }
        const response = await fetch(`${API_BASE_URL}/services/apexrest/restaurant/list`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('Failed to fetch restaurants from backend, falling back to mock data:', error);
        return [
          { id: 'r1', name: 'The Luminary Grill', city: 'Coimbatore', avgPrepTime: 30 },
          { id: 'r2', name: 'Masala Tango', city: 'Coimbatore', avgPrepTime: 20 },
          { id: 'r3', name: 'Sakura Omakase', city: 'Coimbatore', avgPrepTime: 35 },
          { id: 'r4', name: 'Smokehouse BBQ Co.', city: 'Coimbatore', avgPrepTime: 25 },
          { id: 'r5', name: 'Green & Grain', city: 'Coimbatore', avgPrepTime: 18 },
          { id: 'r6', name: 'Morning Bliss Bakery', city: 'Coimbatore', avgPrepTime: 20 },
          { id: 'r7', name: 'Sweet Tooth Confections', city: 'Coimbatore', avgPrepTime: 25 },
          { id: 'r8', name: 'Napoli Woodfired Pizza', city: 'Coimbatore', avgPrepTime: 30 },
          { id: 'r9', name: 'Slice & Stone', city: 'Coimbatore', avgPrepTime: 35 },
          { id: 'r10', name: 'Zen Sushi Lounge', city: 'Coimbatore', avgPrepTime: 40 },
          { id: 'r11', name: 'Tokyo Nights Rollhouse', city: 'Coimbatore', avgPrepTime: 25 },
          { id: 'r12', name: 'Smash & Stack Burgers', city: 'Coimbatore', avgPrepTime: 18 },
          { id: 'r13', name: 'The Meltdown Grill', city: 'Coimbatore', avgPrepTime: 25 }
        ];
    }
};
