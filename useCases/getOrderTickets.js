async function getOrderTickets() {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    // Realizar la petición GET
    const response = await fetch('http://201.137.169.6:8000/orders/orders/allorders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Si es un 404 o el mensaje indica que no hay órdenes, retornar array vacío
      if (response.status === 404) {
        // console.log('No se encontraron órdenes para este usuario');
        return [];
      }
      
      // Para otros errores, intentar obtener el mensaje de error
      const errorData = await response.json().catch(() => ({}));
      
      // Si el mensaje indica que no hay órdenes, retornar array vacío
      if (errorData.detail && errorData.detail.includes('No se encontraron órdenes')) {
        // console.log('No se encontraron órdenes para este usuario');
        return [];
      }
      
      throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    // Parsear la respuesta JSON
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    throw error;
  }
}

export default getOrderTickets;