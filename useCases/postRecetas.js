import axios from "axios";

/**
 * Obtiene el token de autenticación desde localStorage o sessionStorage.
 * @returns {string|null} El token de autenticación o null si no existe.
 */
function getAuthToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

/**
 * Crea una nueva receta en el sistema.
 * @param {Object} recipeData - Datos de la receta.
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
export async function postRecetas(recipeData) {
    // Obtener el token desde localStorage o sessionStorage
    const token = getAuthToken();
    if (!token) {
        throw new Error("No se encontró un token de autenticación. Por favor, inicia sesión.");
    }

    const url = "https://bc95be6e78e9.ngrok-free.app/inventory/recipes/";

    try {
        const response = await axios.post(url, recipeData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear la receta:", error.response?.data || error.message);
        console.error("Detalles del error:", error.response?.data);
        
        if (error.response?.data?.detail) {
            console.error("Campos faltantes o inválidos:", error.response.data.detail);
        }
        
        throw new Error(
            `Error al crear la receta: ${error.response?.data?.message || "Verifica los datos enviados."}`
        );
    }
}