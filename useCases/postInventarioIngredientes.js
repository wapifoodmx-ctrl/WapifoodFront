/**
 * Función para crear un nuevo ingrediente en el inventario
 * @param {Object} ingredientData - Datos del ingrediente a crear
 * @param {string} ingredientData.name - Nombre del ingrediente (requerido)
 * @param {string} [ingredientData.description] - Descripción del ingrediente (opcional)
 * @param {number} ingredientData.cost - Costo del ingrediente (requerido)
 * @param {number} ingredientData.stock - Stock del ingrediente (requerido)
 * @param {string} ingredientData.unit - Unidad del ingrediente (requerido)
 * @param {string} [ingredientData.category] - Categoría del ingrediente (opcional)
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const postInventarioIngredientes = async (ingredientData) => {
  try {
    // Obtener token del sessionStorage o localStorage
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Crear FormData para envío como form-urlencoded
    const formData = new URLSearchParams();
    formData.append('name', ingredientData.name);
    if (ingredientData.description) {
      formData.append('description', ingredientData.description);
    }
    formData.append('cost', ingredientData.cost.toString());
    formData.append('stock', ingredientData.stock.toString());
    formData.append('unit', ingredientData.unit);
    if (ingredientData.category) {
      formData.append('category', ingredientData.category);
    }

    const response = await fetch('https://755a46a10dc5.ngrok-free.app/docs/inventory/ingredients/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Para evitar advertencias de ngrok
      },
      body: formData
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