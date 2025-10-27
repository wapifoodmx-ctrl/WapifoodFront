export const getRecetas = async () => {
  try {
    // Intentar obtener el token del localStorage primero, luego del sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const response = await fetch('https://219850ab94bd.ngrok-free.app/inventory/recipes/my-recipes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true' // Para evitar el warning de ngrok
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error al obtener las recetas:', error);
    throw error;
  }
};