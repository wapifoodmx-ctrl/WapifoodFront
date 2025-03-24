export async function getProducts() {
    const endpoint = 'http://192.168.1.69:8000/products';

    try {
        // Obtén el token desde localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró un token de autenticación');
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Aplica el prefijo 'Bearer' correctamente
            },
        });

        if (!response.ok) {
            // Intenta obtener un mensaje de error del servidor
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los productos');
        }

        const data = await response.json();
        console.log('Productos obtenidos con éxito:', data);
        return data;
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        throw error;
    }
}