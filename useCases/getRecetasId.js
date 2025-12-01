/**
 * Obtiene una receta específica por su ID
 * @param {string} recipeId - ID de la receta a obtener
 * @returns {Promise<Object>} - Datos de la receta
 */
export const getRecetaById = async (recipeId) => {
    try {
        // Obtener token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró token de autenticación');
        }

        if (!recipeId) {
            throw new Error('ID de receta es requerido');
        }

        const response = await fetch(`https://b880858e3aa6.ngrok-free.app/inventory/recipes/${recipeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al obtener la receta:', error);
        throw error;
    }
};

export default getRecetaById;