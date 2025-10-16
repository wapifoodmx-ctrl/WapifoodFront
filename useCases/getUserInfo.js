
export async function getUserInfo() {
    const endpoint = 'http://192.168.1.69:8000/user/me/info';

    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token. Por favor, inicia sesión.');
        }

        const response = await fetch(endpoint, {
            method: 'GET', // Método GET
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la información del usuario: ${response.statusText}`);
        }

        const data = await response.json(); // Parsear la respuesta como JSON
        return data; // Devolver los datos obtenidos
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error.message);
        throw error;
    }
}