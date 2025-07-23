export async function getGraficaFechas(fechaInicio, fechaFin) {
  try {
    // Validar que las fechas sean proporcionadas
    if (!fechaInicio || !fechaFin) {
      return {
        success: false,
        error: 'fechas-requeridas',
        message: 'Las fechas de inicio y fin son requeridas'
      };
    }

    // Obtener token del localStorage o sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      return {
        success: false,
        error: 'no-token',
        message: 'Token de autenticación no encontrado'
      };
    }

    // Construir la URL con los parámetros de consulta
    const url = new URL('https://comandapp-api.h-dev.xyz/analytics/ventas_por_año');
    url.searchParams.append('fecha_inicio', fechaInicio);
    url.searchParams.append('fecha_fin', fechaFin);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'sin-datos',
          message: 'No se encontraron datos para el rango de fechas especificado'
        };
      }
      
      if (response.status === 401) {
        return {
          success: false,
          error: 'sin-autorizacion',
          message: 'No autorizado para acceder a estos datos'
        };
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validar que la respuesta tenga datos
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return {
        success: false,
        error: 'sin-ventas',
        message: 'No hay datos de ventas para el rango de fechas especificado'
      };
    }

    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('Error en getGraficaFechas:', error);
    
    return {
      success: false,
      error: 'error-red',
      message: error.message || 'Error de conexión al obtener datos de ventas por fechas'
    };
  }
}