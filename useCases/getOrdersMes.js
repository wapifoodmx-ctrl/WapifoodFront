async function getOrdersMes() {
  try {
    // Intentar obtener el token del localStorage primero, luego del sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch('https://api.wapifood.com/orders/orders/ultimo-mes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error al obtener las órdenes del mes:', error);
    throw error;
  }
}

// Exportar la función
export default getOrdersMes;