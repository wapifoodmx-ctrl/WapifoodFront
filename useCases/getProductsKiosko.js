export async function getProductsKiosko() {
    const endpoint = 'https://api.wapifood.com/categoria/productos';

    try {
        const token = localStorage.getItem('kioskoToken') || sessionStorage.getItem('kioskoToken');
        if (!token) {
            throw new Error('No se encontró un token de autenticación para el kiosko');
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener los productos');
        }

        const data = await response.json();

        // Transform the response into a flat list of products with categories
        const transformedData = data.flatMap((category) =>
            category.productos.map((product) => ({
                ...product,
                category_name: category.nombre_categoria,
            }))
        );

        return transformedData;
    } catch (error) {
        console.error('Error al obtener los productos del kiosko:', error.message);
        throw error;
    }
}
