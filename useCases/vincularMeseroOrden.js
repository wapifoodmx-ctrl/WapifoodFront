/**
 * Vincula un mesero con una orden específica
 * @param {string} orderUuid - UUID de la orden
 * @param {string} waiterUuid - UUID del mesero
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function vincularMeseroOrden(orderUuid, waiterUuid) {
    const endpoint = 'https://api.wapifood.com/waiters/assign/order';

    // console.log('vincularMeseroOrden - Iniciando:', { orderUuid, waiterUuid });

    try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró un token de autenticación');
        }

        // console.log('vincularMeseroOrden - Token encontrado, enviando request...');

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                order_uuid: orderUuid,
                waiter_uuid: waiterUuid
            })
        });

        // console.log('vincularMeseroOrden - Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('vincularMeseroOrden - Error response:', errorData);
            throw new Error(errorData.message || `Error al vincular mesero a la orden: ${response.status}`);
        }

        const data = await response.json();
        // console.log('vincularMeseroOrden - Éxito:', data);
        return data;
    } catch (error) {
        console.error('vincularMeseroOrden - Error:', error.message);
        throw error;
    }
}
