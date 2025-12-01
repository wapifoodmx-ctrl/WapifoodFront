export const getLastOrderByTable = async (tableNumber) => {
    try {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`http://201.137.169.6:8000/orders/orders/last-order-by-table?table=${tableNumber}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Error al obtener la última orden por mesa:', error);
        throw error;
    }
};