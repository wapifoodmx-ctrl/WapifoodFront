export async function sendChatMessage(pregunta) {
    const endpoint = 'https://api.wapifood.com/api/chatbot';

    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró un token en el localStorage o sessionStorage');
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pregunta }),
        });

        if (!response.ok) {
            throw new Error('Error al comunicarse con el chatbot');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en el chatbot:', error.message);
        throw error;
    }
}
