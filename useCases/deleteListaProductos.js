async function deleteListaProductos(listId) {
    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`https://api.wapifood.com/products/custom-list/${listId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error al eliminar lista de productos:', error);
        throw error;
    }
}

module.exports = deleteListaProductos;