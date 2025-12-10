export async function updateMeseros(uuid, meseroData) {
    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró un token en el localStorage o sessionStorage');
        }

        // Validar UUID
        if (!uuid) {
            throw new Error('UUID del mesero es requerido');
        }

        // Construir el cuerpo de la petición solo con datos proporcionados
        const body = {};
        if (meseroData.name) body.name = meseroData.name;
        if (meseroData.access_code) body.access_code = meseroData.access_code;

        // Realizar la petición PATCH
        const response = await fetch(`https://api.wapifood.com/waiters/${uuid}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            // Intentar obtener el mensaje de error del servidor
            let errorMessage = `Error HTTP: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {
                // Si no se puede parsear el JSON, usar el mensaje por defecto
            }
            throw new Error(errorMessage);
        }

        // Parsear la respuesta JSON
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al actualizar el mesero:', error);
        throw error;
    }
}
