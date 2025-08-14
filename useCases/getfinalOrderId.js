export async function getFinalOrder(UUID) {
    const endpoint = `https://api.wapifood.com/orders/final/${UUID}`;

    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token. Por favor, inicia sesión.');
        }

        const response = await fetch(endpoint, {
            method: 'GET', // Método GET
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
        });

        if (!response.ok) {
            // Si es un 404, retornar null o un objeto vacío
            if (response.status === 404) {
                // console.log('No se encontró la orden final para este UUID');
                return null;
            }
            
            // Para otros errores, intentar obtener el mensaje de error
            const errorData = await response.json().catch(() => ({}));
            
            // Si el mensaje indica que no se encontró la orden, retornar null
            if (errorData.detail && errorData.detail.includes('No se encontró')) {
                // console.log('No se encontró la orden final para este UUID');
                return null;
            }
            
            throw new Error(`Error al obtener la orden final: ${response.statusText}`);
        }

        const data = await response.json(); // Parsear la respuesta como JSON
        return data; // Devolver los datos obtenidos
    } catch (error) {
        console.error('Error al obtener la orden final:', error.message);
        // No relanzar el error para usuarios nuevos
        return null;
    }
}

// Ejemplo de uso (comentado para evitar ejecución automática)
/*
// Ejemplo de cómo usar la función:
const orderUUID = "tu-uuid-aqui"; // Reemplazar con el UUID real

try {
    const finalOrder = await getFinalOrder(orderUUID);
    
    if (finalOrder) {
        // Procesar la orden final
        console.log('Orden final encontrada:', finalOrder);
    } else {
        // Manejar el caso cuando no hay orden final
        console.log('No hay orden final para este usuario');
    }
} catch (error) {
    console.error('Error al obtener la orden final:', error);
}
*/