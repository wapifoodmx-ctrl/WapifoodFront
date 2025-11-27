async function getIngredienteById(ingredientId) {
    try {
        console.log('=== INICIANDO GET INGREDIENTE BY ID ===');
        console.log('ID del ingrediente:', ingredientId);

        // Obtener token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            return {
                success: false,
                error: 'Token de autenticación no encontrado'
            };
        }

        // Usar la misma URL base que en otros archivos
        const url = `http://192.168.1.69:8001/inventory/ingredients/${ingredientId}`;
        console.log('URL de la petición:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'ngrok-skip-browser-warning': 'true' // Si usas ngrok
            }
        });

        console.log('Respuesta HTTP:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error de respuesta:', errorText);
            return {
                success: false,
                error: `Error HTTP: ${response.status} - ${response.statusText}`
            };
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        // Verificar estructura de la respuesta
        if (data && (data.id_ingredient || data.id)) {
            return {
                success: true,
                data: data
            };
        } else {
            return {
                success: false,
                error: 'Estructura de respuesta inesperada'
            };
        }

    } catch (error) {
        console.error('Error completo al obtener ingrediente:', error);
        
        // Mejorar el mensaje de error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return {
                success: false,
                error: 'No se puede conectar con el servidor. Verifica que esté ejecutándose.'
            };
        }
        
        return {
            success: false,
            error: error.message
        };
    }
}

export { getIngredienteById };
export default getIngredienteById;