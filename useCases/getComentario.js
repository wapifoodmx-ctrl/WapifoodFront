/**
 * Obtiene los comentarios de una orden específica
 * @param {string} orderUuid - UUID de la orden
 * @returns {Promise<object>} - Respuesta de la API con los comentarios
 */
async function getOrderComments(orderUuid) {
  try {
    // Intentar obtener el token del localStorage primero, luego sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`https://api.wapifood.com/orders/${orderUuid}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error al obtener los comentarios:', error);
    throw error;
  }
}

// Ejemplo de uso:
// getOrderComments('uuid-de-la-orden')
//   .then(data => console.log('Comentarios:', data))
//   .catch(error => console.error('Error:', error));