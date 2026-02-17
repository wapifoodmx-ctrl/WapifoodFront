const createwebExternalOrder = async (orderUuid, accion) => {
    try {
        // Obtener token de localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró token de autenticación');
        }

        // Validar acción
        if (!['ACEPTAR', 'DESCARTAR'].includes(accion)) {
            throw new Error('Acción inválida. Debe ser ACEPTAR o DESCARTAR');
        }

        const response = await fetch(`https://api.wapifood.com/orders/web/process/${orderUuid}?accion=${accion}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al procesar la orden web:', error);
        throw error;
    }
};

export default createwebExternalOrder;
