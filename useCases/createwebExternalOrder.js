const createwebExternalOrder = async (idWebOrder) => {
    try {
        // Obtener token de localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró token de autenticación');
        }

        const response = await fetch(`https://api.wapifood.com/orders/web/accept/${idWebOrder}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al aprobar la orden web:', error);
        throw error;
    }
};

export default createwebExternalOrder;
