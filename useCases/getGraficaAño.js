export async function getGraficaAño(fechaInicio, fechaFin) {
  try {
    // Validar que las fechas sean proporcionadas
    if (!fechaInicio || !fechaFin) {
      return {
        success: false,
        error: 'fechas-requeridas',
        message: 'Las fechas de inicio y fin son requeridas'
      };
    }

    // Construir la URL con los parámetros de consulta
    const url = new URL('http://201.137.143.34:8000/analytics/ventas_por_año');
    url.searchParams.append('fecha_inicio', fechaInicio);
    url.searchParams.append('fecha_fin', fechaFin);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Agrega aquí otros headers si son necesarios (como Authorization)
        // 'Authorization': `Bearer ${token}`,
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
    console.error('Error en getGraficaAño:', error);
    
    return {
      success: false,
      error: 'error-red',
      message: error.message || 'Error de conexión al obtener datos de ventas por año'
    };
  }
}