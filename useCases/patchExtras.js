import axios from "axios";

/**
 * Obtiene el token de autenticación desde localStorage o sessionStorage.
 * @returns {string|null} El token de autenticación o null si no existe.
 */
function getAuthToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

/**
 * Actualiza extras de forma masiva (bulk update).
 * @param {Object|Array} extrasData - Datos de los extras a actualizar.
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
export async function patchExtras(extrasData) {
    const url = "https://api-micro.wapifood.com/inventory/extras/bulk/update";

    // Obtener el token desde localStorage o sessionStorage
    const token = getAuthToken();
    if (!token) {
        throw new Error("No se encontró un token de autenticación. Por favor, inicia sesión.");
    }

    try {
        const response = await axios.patch(
            url,
            extrasData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar los extras:", error.response?.data || error.message);
        if (error.response?.data?.detail) {
            console.error("Detalles del error:", error.response.data.detail);
        }
        throw new Error(
            `Error al actualizar los extras: ${error.response?.data?.message || error.message}`
        );
    }
}
