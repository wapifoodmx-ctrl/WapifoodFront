/**
 * Actualiza el PIN de seguridad del inventario
 * @param {string} newPin - El nuevo PIN (debe ser de 4 dígitos)
 * @returns {Promise<Object>} - Respuesta de la API
 */
async function actualizarPinInventario(newPin) {
  try {
    // Validar que el PIN tenga 4 dígitos
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      throw new Error('El PIN debe tener exactamente 4 dígitos numéricos');
    }

    // Obtener token del localStorage o sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch('http://192.168.1.69:8001/inventory/security/pin', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        pin_code: newPin  // Cambiado de "new_pin" a "pin_code"
      })
    });

    if (!response.ok) {
      let errorMessage = `Error al actualizar el PIN. Código de estado: ${response.status}`;
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          
          // Asegurarse de que errorMessage sea un string
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData.detail) {
            errorMessage = typeof errorData.detail === 'string' 
              ? errorData.detail 
              : JSON.stringify(errorData.detail);
          } else if (errorData.message) {
            errorMessage = typeof errorData.message === 'string' 
              ? errorData.message 
              : JSON.stringify(errorData.message);
          } else if (errorData.error) {
            errorMessage = typeof errorData.error === 'string' 
              ? errorData.error 
              : JSON.stringify(errorData.error);
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } else {
          const textError = await response.text();
          errorMessage = textError || errorMessage;
        }
      } catch (e) {
        console.error('Error al parsear respuesta de error:', e);
      }

      throw new Error(String(errorMessage));
    }

    const data = await response.json();
    console.log('PIN actualizado exitosamente:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Error al actualizar el PIN de inventario:', error);
    return { success: false, error: error.message };
  }
}

export default actualizarPinInventario;