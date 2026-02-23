/**
 * Actualiza el estado de delivery
 * @param {boolean} deliveryStatus - Estado del delivery (true/false)
 * @returns {Promise<Object>} Respuesta de la API
 */
async function putDeliveryOnOff(deliveryStatus) {
  try {
    // Intentar obtener el token del localStorage primero, luego sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch('https://api.wapifood.com/orders/web/status/delivery', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        is_delivery_active: deliveryStatus
      })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar el estado de delivery:', error);
    throw error;
  }
}

module.exports = putDeliveryOnOff;