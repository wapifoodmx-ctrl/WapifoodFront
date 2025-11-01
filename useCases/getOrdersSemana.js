async function getOrdersSemana() {
    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        // Realizar la petición GET
        const response = await fetch('http://201.137.143.34:8000/orders/orders/ultima-semana', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es exitosa, incluyendo 204 (No Content)
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        // Si es 204 (No Content), retornar array vacío directamente
        if (response.status === 204) {
            return {
                success: true,
                data: []
            };
        }

        // Obtener el texto de la respuesta primero para debuggear
        const responseText = await response.text();
        
        // Verificar si la respuesta está vacía
        if (!responseText) {
            console.warn('Respuesta vacía del servidor');
            return {
                success: true,
                data: []
            };
        }

        // Intentar parsear el JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.error('Respuesta del servidor:', responseText);
            throw new Error('Respuesta del servidor no es JSON válido');
        }
        
        // Retornar en el mismo formato que getOrdersDia
        return {
            success: true,
            data: data
        };

    } catch (error) {
        console.error('Error al obtener las órdenes de la última semana:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Exportar la función
export { getOrdersSemana };