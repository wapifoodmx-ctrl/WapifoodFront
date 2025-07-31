export async function resetPass() {
    const endpoint = 'https://api.wapifood.com/user/password-reset/request';

    try {
       
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let errorData = {};
            try {
                // Intentar parsear la respuesta como JSON
                errorData = await response.json();
            } catch (e) {
                console.error('No se pudo parsear la respuesta de error como JSON:', e);
            }

            // Mostrar el error completo en consola para depuración
            console.error('Error en la respuesta:', response.status, response.statusText, errorData);

            // Lanzar un error con un mensaje genérico o el mensaje de la API si está disponible
            throw new Error(
                errorData.message || `Error al obtener las categorías. Código de estado: ${response.status}`
            );
        }

        // Parsear la respuesta exitosa como JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error.message);
        throw error;
    }
}