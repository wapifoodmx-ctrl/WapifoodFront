export async function cambiarPass(token, newPassword) {
    const endpoint = 'http://201.137.143.34:8000/user/password-reset/confirm';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                token: token,
                new_password: newPassword 
            })
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
                errorData.message || `Error al cambiar la contraseña. Código de estado: ${response.status}`
            );
        }

        // Parsear la respuesta exitosa como JSON
        const data = await response.json();
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error('Error al cambiar contraseña:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}