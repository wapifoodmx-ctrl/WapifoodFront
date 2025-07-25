/**
 * Obtiene los datos de ventas por mes reciente desde la API
 * @returns {Promise<Object>} Datos de ventas por mes reciente
 */
export const getGraficaMes = async () => {
    try {
        // Obtener token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        const response = await fetch('https://api.wapifood.com/analytics/ventas_por_mes_reciente', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Token inválido o expirado');
            }
            if (response.status === 403) {
                throw new Error('No tienes permisos para acceder a esta información');
            }
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        // Convertir respuesta a JSON
        const data = await response.json();
        
        return {
            success: true,
            data: data
        };

    } catch (error) {
        console.error('Error al obtener gráfica de mes:', error);
        
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
};