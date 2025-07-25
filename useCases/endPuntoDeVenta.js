export const endPuntoDeVenta = async (orderUuid, metodoPago) => {
    try {
        // Obtener el token del localStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        // Validar método de pago
        if (!['efectivo', 'tarjeta'].includes(metodoPago)) {
            throw new Error('Método de pago no válido. Debe ser "efectivo" o "tarjeta"');
        }

        // Construir la URL con los parámetros de query
        const endpoint = `https://api.wapifood.com/orders/orders/${orderUuid}/cambio_estatus?order_status=Finalizado&metodo_pago=${metodoPago}`;

        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al finalizar la orden:', error);
        throw error;
    }
};