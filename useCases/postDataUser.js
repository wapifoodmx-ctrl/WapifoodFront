import axios from "axios";

/**
 * Obtiene el token de autenticación desde localStorage o sessionStorage.
 * @returns {string|null} El token de autenticación o null si no existe.
 */
function getAuthToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

/**
 * Envía información del usuario con una imagen asociada.
 * @param {Object} userInfo - Datos del usuario en formato JSON.
 * @param {File} imageFile - Archivo de imagen (opcional).
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
export async function postDataUser(userInfo, imageFile) {
    const formData = new FormData();

    // Agregar los campos del usuario individualmente con los nombres correctos
    formData.append("id_user_info", String(userInfo.id_user_info || 0));
    formData.append("nombre", userInfo.nombre || "");
    formData.append("apellido", userInfo.apellido || "");
    formData.append("email", userInfo.email || "");
    formData.append("telefono", userInfo.telefono || "");
    formData.append("direccion", userInfo.direccion || "");
    formData.append("codigo_postal", String(userInfo.codigo_postal || 0));
    formData.append("ciudad", userInfo.ciudad || "");
    formData.append("alcaldia", userInfo.alcaldia || "");

    // Validar y agregar el archivo de imagen si está disponible
    if (imageFile) {
        if (!(imageFile instanceof File)) {
            throw new Error("El archivo de imagen debe ser un objeto File válido.");
        }
        formData.append("file", imageFile);
    } else {
        console.warn("No se proporcionó un archivo de imagen.");
    }

    // Obtener el token desde localStorage o sessionStorage
    const token = getAuthToken();
    if (!token) {
        throw new Error("No se encontró un token de autenticación. Por favor, inicia sesión.");
    }

    const url = "https://comandapp-api.h-dev.xyz/user/me/info";

    console.log("URL de la solicitud:", url);
    console.log("Datos enviados (formData):", Object.fromEntries(formData.entries())); // Log form data

    try {
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al enviar la información del usuario:", error.response?.data || error.message);
        console.error("Detalles del error:", error.response?.data); // Log server response
        if (error.response?.data?.detail) {
            console.error("Campos faltantes o inválidos:", error.response.data.detail);
        }
        throw new Error(
            `Error al enviar la información del usuario: ${error.response?.data?.message || "Verifica los datos enviados."}`
        );
    }
}
