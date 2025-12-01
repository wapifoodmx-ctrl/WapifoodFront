import axios from "axios";

/**
 * Obtiene el token de autenticación desde localStorage o sessionStorage.
 * @returns {string|null} El token de autenticación o null si no existe.
 */
function getAuthToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

/**
 * Envía el estilo/color del menú al servidor.
 * 
 * Estilos disponibles (ver menuStyles.js):
 * - default: "Clásico"
 * - tokyo: "Tokyo Nights"
 * - midnight: "Midnight"
 * - sunset: "Sunset Grill"
 * - ocean: "Ocean Deep"
 * - luxury: "Golden Luxury"
 * - garden: "Fresh Garden"
 * - berry: "Berry Sweet"
 * - espresso: "Espresso"
 * - aurora: "Aurora"
 * - latte: "Café Latte"
 * - mocha: "Mocha"
 * - cappuccino: "Cappuccino"
 * - fiesta: "Fiesta Mexicana"
 * - azteca: "Azteca"
 * - mariachi: "Mariachi"
 * - tequila: "Tequila Sunrise"
 * 
 * @param {string} colorValue - Valor del estilo (ej: "tokyo", "default", "sunset", etc.)
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
export async function postColorMenu(colorValue) {
    const url = "http://201.137.169.6:8000/menucolors/";

    // Obtener el token desde localStorage o sessionStorage
    const token = getAuthToken();
    if (!token) {
        throw new Error("No se encontró un token de autenticación. Por favor, inicia sesión.");
    }

    try {
        const response = await axios.post(url, 
            { color: colorValue }, // Formato simplificado
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al enviar el color del menú:", error.response?.data || error.message);
        if (error.response?.data?.detail) {
            console.error("Detalles del error:", error.response.data.detail);
        }
        throw new Error(
            `Error al enviar el color del menú: ${error.response?.data?.message || error.message}`
        );
    }
}
