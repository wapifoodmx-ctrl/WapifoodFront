export async function resetPass(email) {
    const endpoint = 'http://201.137.169.6:8000/user/password-reset/request';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }) // Enviar el email en el body
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

            // Lanzar un error con un mensaje más específico
            throw new Error(
                errorData.message || `Error al enviar enlace de recuperación. Código de estado: ${response.status}`
            );
        }

        // Parsear la respuesta exitosa como JSON
        const data = await response.json();
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error('Error al enviar enlace de recuperación:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}