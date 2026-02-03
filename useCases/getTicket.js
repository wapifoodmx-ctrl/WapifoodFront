export const getTicket = async (orderUuid) => {
    try {
        // Obtener el token del localStorage o sessionStorage (incluyendo kioskoToken)
        const token = localStorage.getItem('token') || sessionStorage.getItem('token') || localStorage.getItem('kioskoToken') || sessionStorage.getItem('kioskoToken');
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        // Validar que se proporcione el orderUuid
        if (!orderUuid) {
            throw new Error('El UUID de la orden es requerido');
        }

        // Construir la URL del endpoint
        const endpoint = `https://api.wapifood.com/orders/${orderUuid}`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        const ticketData = await response.json();
        return ticketData;

    } catch (error) {
        console.error('Error al obtener los datos del ticket:', error);
        throw error;
    }
};