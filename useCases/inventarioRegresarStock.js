/**
 * Regresa stock de un producto al inventario
 * @param {Object} payload - Datos del producto a regresar
 * @param {number} payload.product_id - ID del producto
 * @param {number} payload.quantity - Cantidad a devolver
 * @param {string} payload.description - Descripción de la devolución (ej: "Devolución de cliente")
 * @param {number} payload.ticket_number - Número de ticket
 * @param {Object} options - Opciones adicionales (token, tokenKey, signal)
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const inventarioRegresarStock = async (payload, options = {}) => {
  const endpoint = 'https://api-micro.wapifood.com/inventory/return-product/';
  
  // Validar que el payload tenga los campos requeridos
  const camposRequeridos = ['product_id', 'quantity', 'description', 'ticket_number'];
  for (const campo of camposRequeridos) {
    if (payload[campo] === undefined || payload[campo] === null) {
      throw new Error(`El campo '${campo}' es requerido`);
    }
  }
  
  // Intentar obtener el token de localStorage o sessionStorage
  let token = options.token;
  
  if (!token && typeof window !== 'undefined') {
    const tokenKeys = ['token', 'authToken', 'accessToken', 'auth_token', 'access_token'];
    
    for (const key of tokenKeys) {
      try {
        token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) break;
      } catch (e) {
        console.warn(`Error al leer storage con clave ${key}:`, e);
      }
    }
    
    // Si se especificó una clave personalizada
    if (options.tokenKey) {
      token = localStorage.getItem(options.tokenKey) || sessionStorage.getItem(options.tokenKey);
    }
  }
  
  if (!token) {
    throw new Error('No se encontró token de autenticación. Inicia sesión primero.');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  
  const config = {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  };
  
  // Soporte para AbortController
  if (options.signal) {
    config.signal = options.signal;
  }
  
  try {
    const response = await fetch(endpoint, config);
    
    // Intentar parsear la respuesta como JSON
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }
    
    if (!response.ok) {
      const error = new Error(data.message || `Error HTTP ${response.status}`);
      error.status = response.status;
      error.response = data;
      throw error;
    }
    
    return data;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('La petición fue cancelada');
    }
    
    if (!error.status) {
      throw new Error(`Error de red: ${error.message}`);
    }
    
    throw error;
  }
};

export default inventarioRegresarStock;