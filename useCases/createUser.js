export async function createUser(user) {
    const endpoint = 'http://192.168.1.69:8000/user'; // Reemplaza <your-project-id> con tu ID de proyecto de Firebase

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error('Error al crear el usuario');
        }

        const data = await response.json();
        console.log('Usuario creado con éxito:', data);
        return data;
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        throw error;
    }
}