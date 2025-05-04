export async function getAnalitics() {
    const endpoint = 'http://192.168.1.69:8000/analytics/dashboard';

    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró un token en el localStorage');
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                console.error('No se pudo parsear la respuesta de error:', e);
            }
            console.error('Error en la respuesta:', errorData);
            throw new Error(errorData.message || 'Error al obtener las analíticas. Verifica el servidor.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las analíticas:', error.message);
        throw error;
    }
}