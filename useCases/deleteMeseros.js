export async function deleteMeseros(uuid) {
    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No se encontró un token en el localStorage o sessionStorage');
        }

        // Validar UUID
        if (!uuid) {
            throw new Error('UUID del mesero es requerido');
        }

        // Realizar la petición DELETE
        const response = await fetch(`https://api.wapifood.com/waiters/${uuid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusStatus}`);
        }

        // DELETE puede devolver 204 No Content o 200 con data
        if (response.status === 204) {
            return { success: true };
        }

        // Si hay contenido, parsearlo
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al eliminar el mesero:', error);
        throw error;
    }
}
