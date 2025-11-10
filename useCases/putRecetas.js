/**
 * Actualiza una receta existente
 * @param {string} recipeId - ID de la receta a actualizar
 * @param {Object} recipeData - Datos de la receta a actualizar
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const putReceta = async (recipeId, recipeData) => {
    try {
        // Obtener token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró token de autenticación');
        }

        const response = await fetch(`https://755a46a10dc5.ngrok-free.app/docs/inventory/recipes/${recipeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(recipeData)
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al actualizar la receta:', error);
        throw error;
    }
};

export default putReceta;
