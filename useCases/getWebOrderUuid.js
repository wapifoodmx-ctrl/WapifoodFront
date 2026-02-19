/**
 * Obtiene la información de entrega de una orden web
 * @param {string} webOrderUuid - UUID de la orden web
 * @returns {Promise<Object>} Información de entrega de la orden
 */
async function getWebOrderDeliveryInfo(webOrderUuid) {
  try {
    // Intentar obtener el token del localStorage primero, luego del sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    if (!webOrderUuid) {
      throw new Error('El UUID de la orden es requerido');
    }

    const response = await fetch(
      `https://api.wapifood.com/orders/web/delivery-info/${webOrderUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error al obtener información de entrega:', error);
    throw error;
  }
}

export default getWebOrderDeliveryInfo;