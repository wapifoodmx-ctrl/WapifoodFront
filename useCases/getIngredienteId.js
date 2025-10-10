async function getIngredienteById(ingredientId) {
    try {
        // Obtener token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        const response = await fetch(`http://192.168.1.69:8001/inventory/ingredients/${ingredientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al obtener ingrediente:', error);
        throw error;
    }
}

// Exportar la función para uso en otros módulos
export { getIngredienteById };

// También como export default si prefieres
export default getIngredienteById;