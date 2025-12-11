/**
 * Obtiene las últimas órdenes generadas de acuerdo al plan del usuario
 * GET https://api.wapifood.com/orders/orders/latest-by-plan
 * @returns {Promise<Array>}
 */
export async function getLatestOrdersByPlan() {
  try {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch('https://api.wapifood.com/orders/orders/latest-by-plan', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Error al obtener las órdenes');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
