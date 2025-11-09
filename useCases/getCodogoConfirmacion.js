async function getCodigoConfirmacion() {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        // Realizar la petición GET
        const response = await fetch('http://201.137.212.172:8000/user/me/confirmation-code', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Parsear la respuesta JSON
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al obtener el código de confirmación:', error);
        throw error;
    }
}

export default getCodigoConfirmacion;