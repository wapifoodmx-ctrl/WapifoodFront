export async function postMeseros(meseroData) {
    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró un token en el localStorage o sessionStorage');
        }

        // Validar datos requeridos
        if (!meseroData.name || !meseroData.access_code) {
            throw new Error('Nombre y código de acceso son requeridos');
        }

        // Realizar la petición POST
        const response = await fetch('https://api.wapifood.com/waiters', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: meseroData.name,
                access_code: meseroData.access_code
            })
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
        console.error('Error al crear el mesero:', error);
        throw error;
    }
}
