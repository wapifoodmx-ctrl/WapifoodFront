/**
 * Obtiene los datos de ventas por semana desde la API
 * @returns {Promise<Object>} Datos de ventas por semana
 */
export const getGraficaSemana = async () => {
    try {
        // Obtener token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        const response = await fetch('https://api.wapifood.com/analytics/ventas_por_semana', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            if (response.status === 401) {
                return {
                    success: false,
                    error: 'Token inválido o expirado',
                    data: null
                };
            }
            if (response.status === 402) {
                // No intentar parsear JSON para error 402
                return {
                    success: false,
                    error: 'sin-ventas-402',
                    data: null
                };
            }
            if (response.status === 403) {
                return {
                    success: false,
                    error: 'No tienes permisos para acceder a esta información',
                    data: null
                };
            }
            return {
                success: false,
                error: `Error en la petición: ${response.status} ${response.statusText}`,
                data: null
            };
        }

        // Verificar si hay contenido antes de parsear JSON
        const contentLength = response.headers.get('content-length');
        if (contentLength === '0') {
            return {
                success: false,
                error: 'sin-datos',
                data: null
            };
        }

        // Intentar obtener el texto primero para verificar si hay contenido
        const text = await response.text();
        if (!text || text.trim() === '') {
            return {
                success: false,
                error: 'sin-datos',
                data: null
            };
        }

        // Intentar parsear el JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            return {
                success: false,
                error: 'Error al procesar la respuesta del servidor',
                data: null
            };
        }
        
        return {
            success: true,
            data: data
        };

    } catch (error) {
        console.error('Error al obtener gráfica de semana:', error);
        
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
};