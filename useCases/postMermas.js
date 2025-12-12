/**
 * Procesa una orden en el inventario
 * @param {Object} orderData - Datos de la orden a procesar
 * @returns {Promise<Object>} - Respuesta de la API
 */
async function postProcessOrder(orderData) {
    try {
        // Intentar obtener el token del localStorage primero, luego del sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://api-micro.wapifood.com/inventory/process-order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al procesar la orden:', error);
        throw error;
    }
}

// Exportar la función
export default postProcessOrder;