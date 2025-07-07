async function checkPayment() {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Token de autenticación no encontrado');
        }

        // Realizar la petición GET
        const response = await fetch('https://comandapp-api.h-dev.xyz/payments/check-payment', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        // Parsear la respuesta JSON
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al verificar el pago:', error);
        throw error;
    }
}

// Exportar la función
export { checkPayment };