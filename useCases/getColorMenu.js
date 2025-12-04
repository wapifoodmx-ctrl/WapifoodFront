/**
 * Obtiene la configuración del color/estilo del menú del usuario.
 * 
 * Respuesta de la API:
 * {
 *   "color": "tokyo"  // Este es el valor del estilo
 * }
 * 
 * Para construir el link del menú:
 * const menuLink = `/webmenu/${userUuid}?style=${response.color}`;
 * 
 * @returns {Promise<Object>} Objeto con la configuración del color del menú
 */
export async function getColorMenu() {
    const endpoint = 'https://api.wapifood.com/menucolors/';

    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token. Por favor, inicia sesión.');
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            let errorData = {};
            try {
                // Intentar parsear la respuesta como JSON
                errorData = await response.json();
            } catch (e) {
                console.error('No se pudo parsear la respuesta de error como JSON:', e);
            }

            // Mostrar el error completo en consola para depuración
            console.error('Error en la respuesta:', response.status, response.statusText, errorData);

            // Lanzar un error con un mensaje genérico o el mensaje de la API si está disponible
            throw new Error(
                errorData.message || `Error al obtener el color del menú. Código de estado: ${response.status}`
            );
        }

        // Parsear la respuesta exitosa como JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener el color del menú:', error.message);
        throw error;
    }
}
