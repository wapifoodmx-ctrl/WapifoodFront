export async function getCategoria() {
    const endpoint = 'http://192.168.1.69:8000/categoria';

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token en el localStorage');
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener las categorías');
        }

        const data = await response.json(); // Parsear la respuesta como JSON
        return data; // Devolver las categorías
    } catch (error) {
        console.error('Error al obtener las categorías:', error.message);
        throw error;
    }
}