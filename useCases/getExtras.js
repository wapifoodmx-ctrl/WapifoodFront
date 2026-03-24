/**
 * Obtiene los extras del inventario desde la API
 * @returns {Promise<Object>} Respuesta con los extras del inventario
 */
async function getExtras() {
  try {
    // Obtener token de autenticación del storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Realizar petición GET
    const response = await fetch('https://api-micro.wapifood.com/inventory/extras/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // Para evitar warning de ngrok
      }
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    // Convertir respuesta a JSON
    const data = await response.json();

    return {
      success: true,
      data: data,
      message: 'Extras obtenidos exitosamente'
    };

  } catch (error) {
    console.error('Error al obtener extras del inventario:', error);

    return {
      success: false,
      data: null,
      message: error.message || 'Error desconocido al obtener extras'
    };
  }
}

// Exportar la función
export default getExtras;
