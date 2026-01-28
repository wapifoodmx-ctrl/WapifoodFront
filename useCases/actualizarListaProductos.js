export default async function actualizarListaProductos(productIds) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
        throw new Error('No se encontró el token de autenticación');
    }

    try {
        const response = await fetch('https://api.wapifood.com/products/custom-list', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_ids: productIds
            })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la lista de productos');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en actualizarListaProductos:', error);
        throw error;
    }
}
