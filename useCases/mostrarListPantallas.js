export async function getCustomListPantallas() {
  const endpoint = 'https://api.wapifood.com/products/custom-list';
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token en el localStorage o sessionStorage');
    }
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}
      const message = errorData.message || 'Error al obtener la lista personalizada de productos';
      throw new Error(message);
    }
    const data = await response.json();
    const transformed = Array.isArray(data)
      ? data.map((p) => ({
          ...p,
          category_name: p.nombre_categoria,
        }))
      : [];
    return transformed;
  } catch (error) {
    console.error('Error al obtener la lista personalizada:', error.message);
    throw error;
  }
}

export async function addToCustomList(productIds) {
  const endpoint = 'https://api.wapifood.com/products/custom-list';
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró un token en el localStorage o sessionStorage');
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_ids: productIds }),
    });
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {}
      const message = errorData.message || 'Error al añadir productos a la lista personalizada';
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al añadir a la lista personalizada:', error.message);
    throw error;
  }
}
