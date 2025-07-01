async function getOrderTickets() {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    // Realizar la petición GET
    const response = await fetch('https://comandapp-api.h-dev.xyz/orders/orders/allorders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
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