async function getIngredienteById(ingredientId) {
    try {
        console.log('=== INICIANDO GET INGREDIENTE BY ID ===');
        console.log('ID del ingrediente:', ingredientId);

        // Obtener token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        // Usar la misma URL base que en otros archivos
        const url = `https://bc95be6e78e9.ngrok-free.app/inventory/ingredients/${ingredientId}`;
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
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        // Verificar estructura de la respuesta
        if (data && (data.id_ingredient || data.id)) {
            return data;
        } else {
            throw new Error('Estructura de respuesta inesperada');
        }

    } catch (error) {
        console.error('Error completo al obtener ingrediente:', error);
        
        // Mejorar el mensaje de error
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('No se puede conectar con el servidor. Verifica que esté ejecutándose.');
        }
        
        throw error;
    }
}

export { getIngredienteById };
export default getIngredienteById;