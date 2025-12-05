async function descontarInventario(productos) {
  try {
    // Obtener token del localStorage o sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const response = await fetch('https://api-micro.wapifood.com/inventory/discount-stock-multiple/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productos)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error) {
    console.error('Error al descontar inventario:', error);
    return { success: false, error: error.message };
  }
}

export default descontarInventario;