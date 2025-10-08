/**
 * Función para crear un nuevo ingrediente en el inventario
 * @param {Object} ingredientData - Datos del ingrediente a crear
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const postInventarioIngredientes = async (ingredientData) => {
  try {
    // Obtener token del sessionStorage o localStorage
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const response = await fetch('https://74fa41077d62.ngrok-free.app/inventory/ingredients/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Para evitar advertencias de ngrok
      },
      body: JSON.stringify(ingredientData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('Error al crear ingrediente:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Función de uso alternativo con manejo de errores específicos
export const createIngredient = async (ingredient) => {
  const result = await postInventarioIngredientes(ingredient);
  
  if (!result.success) {
    // Manejar diferentes tipos de errores
    if (result.error.includes('token')) {
      // Redirigir al login o mostrar modal de reautenticación
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    throw new Error(result.error);
  }
  
  return result.data;
};