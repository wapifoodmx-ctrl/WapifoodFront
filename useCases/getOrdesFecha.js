async function getOrdersFecha(fechaInicio, fechaFin) {
  try {
    // Obtener el token del localStorage o sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    // Validar que se proporcionen ambas fechas
    if (!fechaInicio || !fechaFin) {
      throw new Error('Las fechas de inicio y fin son requeridas');
    }

    // Construir la URL con los query parameters
    const baseUrl = 'https://api.wapifood.com/orders/orders/entre-fechas';
    const url = new URL(baseUrl);
    url.searchParams.append('fecha_inicio', fechaInicio);
    url.searchParams.append('fecha_fin', fechaFin);

    const response = await fetch(url.toString(), {
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
      return [];
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error al obtener las órdenes por fecha:', error);
    throw error;
  }
}

// Exportar la función para uso en otros módulos
export { getOrdersFecha };