export async function loginUser(user) {
    const endpoint = 'http://192.168.1.69:8000/products/top';

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token en el localStorage');
        }

        const response = await fetch(endpoint, {
            method: 'GET', // Cambiado a mayúsculas por convención
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
            body: JSON.stringify(user), // Este cuerpo no es necesario para una solicitud GET
        });

        if (!response.ok) {
            throw new Error('Error al encontrar el usuario');
        }

        return response;
    } catch (error) {
        console.error('Error en el log-in', error.message);
        throw error;
    }
}