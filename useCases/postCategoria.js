export default async function postCategoria(categoriaData) {
    const endpoint = 'http://201.137.212.172:8000/categoria';

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token en el localStorage');
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
            body: JSON.stringify(categoriaData), // Enviar los datos de la categoría
        });

        if (!response.ok) {
            const errorData = await response.json(); // Parsear el error del servidor
            const errorMessage = errorData.message || 'Error al crear la categoría, la categoría ya existe';
            throw new Error(errorMessage); // Lanzar un error con el mensaje del backend
        }

        const data = await response.json(); // Parsear la respuesta como JSON
        return data; // Devolver la respuesta del servidor
    } catch (error) {
        console.error('Error al crear la categoría:', error.message);
        throw error; // Re-lanzar el error para que sea manejado en el componente
    }
}