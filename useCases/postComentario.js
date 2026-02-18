/**
 * Envía un comentario a una orden específica
 * @param {string} orderUuid - UUID de la orden
 * @param {object} commentData - Datos del comentario a enviar
 * @returns {Promise<object>} - Respuesta de la API
 */
export default async function postOrderComment(orderUuid, commentData) {
  try {
    // Intentar obtener el token del localStorage/sessionStorage
    // Soportar tanto 'token' como 'kioskoToken' para compatibilidad con diferentes módulos
    const token = localStorage.getItem('token') || 
                  sessionStorage.getItem('token') ||
                  localStorage.getItem('kioskoToken') ||
                  sessionStorage.getItem('kioskoToken');
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch(`https://api.wapifood.com/orders/${orderUuid}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error al enviar el comentario:', error);
    throw error;
  }
}