export const getTables = async () => {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        console.log('Haciendo petición a la API de mesas...');
        
        const response = await fetch('https://comandapp-api.h-dev.xyz/tables/status', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Status de la respuesta:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response:', errorText);
            
            // Manejar específicamente el error 403 (falta de pago)
            if (response.status === 403) {
                return {
                    error: true,
                    status: 403,
                    message: 'Favor de renovar su suscripción',
                    showModal: true
                };
            }
            
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos recibidos de la API:', data);
        console.log('Max mesas:', data.max_mesas);
        console.log('Estado de las mesas:', data.table_status);
        
        // Contar mesas por estado
        if (data.table_status) {
            const estadisticas = Object.values(data.table_status).reduce((acc, estado) => {
                acc[estado] = (acc[estado] || 0) + 1;
                return acc;
            }, {});
            console.log('Estadísticas de mesas:', estadisticas);
        }
        
        return data;
    } catch (error) {
        console.error('Error detallado en getTables:', error);
        throw error;
    }
};