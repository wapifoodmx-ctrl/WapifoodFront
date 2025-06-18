export async function getADataGrafico() {
    const endpoint = 'https://comandapp-api.h-dev.xyz/analytics/get-analytics-basic';

    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            return { 
                success: false, 
                error: 'no-token', 
                message: 'No se encontró un token en el localStorage o sessionStorage' 
            };
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

            // Manejar específicamente el caso de 404 (sin ventas)
            if (response.status === 404) {
                return { 
                    success: false, 
                    error: 'sin-ventas', 
                    message: 'No se encontrarron ventas para este usuario' 
                };
            }

            // Manejar específicamente el caso de un error 403
            if (response.status === 403) {
                return { 
                    success: false, 
                    error: 'sin-permisos', 
                    message: 'No tienes Ventas hasta el momento. Conforme comiences a tener ventas, esta vista se irá actualizando.' 
                };
            }

            // Mostrar el error completo en consola para depuración
            console.error('Error en la respuesta:', response.status, response.statusText, errorData);

            // Devolver error genérico
            return { 
                success: false, 
                error: 'api-error', 
                message: errorData.detail || errorData.message || `Error al obtener las analíticas. Código de estado: ${response.status}` 
            };
        }

        // Parsear la respuesta exitosa como JSON
        const data = await response.json();
        return { 
            success: true, 
            data: data 
        };
    } catch (error) {
        console.error('Error al obtener las analíticas:', error.message);
        return { 
            success: false, 
            error: 'network-error', 
            message: error.message 
        };
    }
}