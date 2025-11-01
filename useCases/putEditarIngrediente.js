/**
 * Función para editar un ingrediente existente
 * @param {number} ingredientId - ID del ingrediente a editar
 * @param {Object} ingredientData - Datos del ingrediente a actualizar
 * @returns {Promise<Object>} - Respuesta de la API
 */
async function putEditarIngrediente(ingredientId, ingredientData) {
    try {
        // Obtener token de autenticación del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        // Validar que el ingredientId sea válido
        if (!ingredientId || isNaN(ingredientId)) {
            throw new Error('ID de ingrediente inválido');
        }

        // Crear FormData para envío form-urlencoded
        const formData = new URLSearchParams();
        formData.append('name', ingredientData.name || '');
        formData.append('description', ingredientData.description || '');
        formData.append('cost', ingredientData.cost?.toString() || '');
        formData.append('stock', ingredientData.stock?.toString() || '');
        formData.append('unit', ingredientData.unit || '');
        formData.append('category', ingredientData.category || '');

        const url = `https://4db7387f6d3c.ngrok-free.app/inventory/ingredients/${ingredientId}`;
        
        console.log('=== DEBUGGING PUT EDITAR INGREDIENTE ===');
        console.log('URL:', url);
        console.log('Ingredient ID:', ingredientId);
        console.log('Token:', token ? 'Token presente' : 'No token');
        console.log('Datos a enviar:', {
            name: ingredientData.name,
            description: ingredientData.description,
            cost: ingredientData.cost,
            stock: ingredientData.stock,
            unit: ingredientData.unit,
            category: ingredientData.category
        });
        console.log('FormData entries:', Object.fromEntries(formData.entries()));

        // Realizar la petición PUT
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: formData
        });

        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        console.log('Response headers:', response.headers);

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                const textError = await response.text();
                console.error('Error response (text):', textError);
                throw new Error(`Error ${response.status}: ${response.statusText} - ${textError}`);
            }
            
            console.error('Error response (json):', errorData);
            throw new Error(errorData.message || errorData.detail || `Error ${response.status}: ${response.statusText}`);
        }

        // Retornar los datos de la respuesta
        const data = await response.json();
        console.log('Respuesta exitosa de la API:', data);
        return data;

    } catch (error) {
        console.error('=== ERROR EN PUT EDITAR INGREDIENTE ===');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Verificar si es un error de red
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Error de conexión. Verifica que el servidor esté ejecutándose en http://201.137.143.34:8000');
        }
        
        throw error;
    }
}

// Exportar la función
export default putEditarIngrediente;