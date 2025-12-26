/**
 * Use case para obtener los datos del kardex (movimientos) de un ingrediente específico
 * @param {number} ingredientId - ID del ingrediente
 * @returns {Promise<Object>} - Objeto con success, data (array de movimientos) y message
 */
export const getKardexData = async (ingredientId) => {
    try {
        // Validar que se proporcione el ID
        if (!ingredientId) {
            throw new Error('Se requiere el ID del ingrediente');
        }

        // Obtener el token de autenticación
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró token de autenticación');
        }

        // Construir la URL con el query parameter
        const url = `https://api-micro.wapifood.com/inventory/movements/?ingredient_id=${ingredientId}`;

        // Realizar la petición GET
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta fue exitosa
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('No autorizado. Por favor inicia sesión nuevamente.');
            }
            if (response.status === 404) {
                throw new Error('No se encontraron movimientos para este ingrediente');
            }
            throw new Error(`Error en la petición: ${response.status}`);
        }

        // Parsear la respuesta JSON
        const data = await response.json();

        // Validar que la respuesta sea un array
        if (!Array.isArray(data)) {
            throw new Error('Formato de respuesta inválido');
        }

        // Retornar los datos en formato exitoso
        return {
            success: true,
            data: data,
            message: 'Movimientos obtenidos correctamente'
        };

    } catch (error) {
        console.error('Error en getKardexData:', error);

        return {
            success: false,
            data: [],
            message: error.message || 'Error al obtener los movimientos del ingrediente'
        };
    }
};

export default getKardexData;
