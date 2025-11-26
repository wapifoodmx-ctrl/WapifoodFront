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
        new_pin: newPin
      })
    });

    if (!response.ok) {
      let errorData = {};
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = { message: await response.text() };
        }
      } catch (e) {
        errorData = { message: `Error ${response.status}: ${response.statusText}` };
      }

      throw new Error(
        errorData.detail || 
        errorData.message || 
        errorData.error || 
        `Error al actualizar el PIN. Código de estado: ${response.status}`
      );
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