/**
 * Obtiene los ingredientes del inventario desde la API
 * @returns {Promise<Object>} Respuesta con los ingredientes del inventario
 */
async function getIngredientesInventario() {
  try {
    // Obtener token de autenticación del storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Realizar petición GET
    const response = await fetch('http://192.168.1.69:8001/docs/inventory/ingredients/', {
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
      message: 'Ingredientes obtenidos exitosamente'
    };

  } catch (error) {
    console.error('Error al obtener ingredientes del inventario:', error);
    
    return {
      success: false,
      data: null,
      message: error.message || 'Error desconocido al obtener ingredientes'
    };
  }
}

// Exportar la función
export default getIngredientesInventario;