export async function getProducts() {
    const endpoint = 'http://192.168.1.69:8000/categoria/productos'; // Cambia esto a la URL de tu API

    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró un token de autenticación');
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

        // console.log('Productos transformados:', transformedData);
        return transformedData;
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        throw error;
    }
}