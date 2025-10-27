export async function patchUserInfo(userData) {
    const endpoint = 'http://201.137.184.207:8000/user/me/info';

    try {
        // Obtener el token del localStorage o sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token. Por favor, inicia sesión.');
        }

        // Crear FormData para enviar datos incluyendo imagen
        const formData = new FormData();
        
        // Agregar campos de texto al FormData
        if (userData.telefono) formData.append('telefono', userData.telefono);
        if (userData.direccion) formData.append('direccion', userData.direccion);
        if (userData.codigo_postal) formData.append('codigo_postal', userData.codigo_postal);
        if (userData.ciudad) formData.append('ciudad', userData.ciudad);
        if (userData.alcaldia) formData.append('alcaldia', userData.alcaldia);
        if (userData.nombre_restaurante) formData.append('nombre_restaurante', userData.nombre_restaurante);
        if (userData.whatsapp) formData.append('whatsapp', userData.whatsapp);
        if (userData.horario) formData.append('horario', userData.horario);
        if (userData.codigo_confirmacion) formData.append('codigo_confirmacion', userData.codigo_confirmacion);
        
        // Agregar imagen si existe
        if (userData.image && userData.image instanceof File) {
            formData.append('image', userData.image);
        }

        const response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                // No incluir 'Content-Type' para FormData, el navegador lo establece automáticamente
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la información del usuario: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // console.log('Usuario actualizado exitosamente:', data);
        return data;
    } catch (error) {
        console.error('Error al actualizar la información del usuario:', error.message);
        throw error;
    }
}