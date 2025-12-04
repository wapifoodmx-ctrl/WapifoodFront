/**
 * Función para editar un ingrediente existente
 * @param {number} ingredientId - ID del ingrediente a editar
 * @param {Object} ingredientData - Datos del ingrediente a actualizar
 * @param {string} ingredientData.name - Nombre del ingrediente
 * @param {string} ingredientData.description - Descripción del ingrediente
 * @param {string|number} ingredientData.cost - Costo del ingrediente
 * @param {string|number} ingredientData.stock - Stock del ingrediente
 * @param {string} ingredientData.unit - Unidad de medida
 * @param {string} ingredientData.category - Categoría del ingrediente
 * @param {string} ingredientData.confirmation_code - Código de confirmación (4 caracteres, requerido)
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

        // Validar el código de confirmación (requerido, 4 caracteres)
        if (!ingredientData.confirmation_code) {
            throw new Error('Código de confirmación es requerido');
        }
        
        const confirmationCode = ingredientData.confirmation_code.toString().trim();
        if (confirmationCode.length !== 4) {
            throw new Error('El código de confirmación debe tener exactamente 4 caracteres');
        }

        // Crear FormData para envío form-urlencoded
        const formData = new URLSearchParams();
        formData.append('name', ingredientData.name || '');
        formData.append('description', ingredientData.description || '');
        formData.append('cost', ingredientData.cost?.toString() || '');
        formData.append('stock', ingredientData.stock?.toString() || '');
        formData.append('unit', ingredientData.unit || '');
        formData.append('category', ingredientData.category || '');
        formData.append('confirmation_code', confirmationCode);

        const url = `https://api-micro.wapifood.com/inventory/ingredients/${ingredientId}`;
        
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
            category: ingredientData.category,
            confirmation_code: confirmationCode
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
            throw new Error('Error de conexión. Verifica que el servidor esté ejecutándose en https://api.wapifood.com');
        }
        
        throw error;
    }
}

// Exportar la función
export default putEditarIngrediente;