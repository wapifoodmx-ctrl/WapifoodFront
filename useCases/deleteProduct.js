export async function deleteProduct(productId) {
    const endpoint = `http://201.137.184.207:8000/products/${productId}`;

    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token. Por favor, inicia sesión.');
        }

        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el producto: ${response.status} ${response.statusText}`);
        }

        // Si la respuesta es exitosa, devolver true o los datos de respuesta
        const data = await response.json().catch(() => null); // Algunos endpoints DELETE no devuelven JSON
        // console.log('Producto eliminado exitosamente:', productId);
        return data || { success: true, productId };
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        throw error;
    }
}