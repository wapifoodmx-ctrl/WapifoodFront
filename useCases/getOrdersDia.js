/**
 * Obtiene las órdenes de las últimas 24 horas
 * @returns {Promise<Object>} Respuesta con las órdenes del día
 */
async function getOrdersDia() {
  try {
    // Intentar obtener el token del localStorage primero, luego del sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const response = await fetch('https://api.wapifood.com/orders/orders/ordenes-ultimas-24-hrs', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    // Si es 204 (No Content), retornar array vacío directamente
    if (response.status === 204) {
      return {
        success: true,
        data: []
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('Error al obtener órdenes del día:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Exportar la función
export default getOrdersDia;

// También puedes exportarla de forma nombrada si prefieres
// export { getOrdersDia };