export async function getwebMenu(uuid) {
    if (!uuid) {
        throw new Error('UUID es requerido');
    }

    const endpoint = `http://201.137.169.6:8000/categoria/web-menu/${uuid}`;
    
    // Debug: Ver qué UUID y endpoint estamos usando
    // console.log('UUID recibido:', uuid);
    // console.log('Endpoint construido:', endpoint);

    try {
       
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Debug: Ver el status de la respuesta
        // console.log('Status de respuesta:', response.status);
        // console.log('Response headers:', response.headers);

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
        // console.log('Datos recibidos de la API:', data); // Debug
        return data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error.message);
        throw error;
    }
}