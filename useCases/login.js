export async function loginUser(user) {
    const endpoint = 'https://469db86c1b78.ngrok-free.app/proxy/login'; // Reemplaza <your-project-id> con tu ID de proyecto de Firebase

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Error al encontrar el usuario');
        }

        //const data = await response.json();
        //console.log('log-in exitoso', data);
        return response;
    } catch (error) {
        console.error('Error en el log-in', error.message);
        throw error;
    }
}