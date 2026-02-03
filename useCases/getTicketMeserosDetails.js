/**
 * Obtiene el historial de órdenes con los meseros que participaron en cada una.
 * @returns {Promise<Array>} - Array de órdenes con información de meseros y detalles.
 */
export async function getTicketMeserosDetails() {
    try {
        // Obtener el token del localStorage o sessionStorage (incluyendo kioskoToken)
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || localStorage.getItem("kioskoToken") || sessionStorage.getItem("kioskoToken");

        if (!token) {
            throw new Error("No se encontró el token de autenticación. Por favor, inicia sesión.");
        }

        const response = await fetch("https://api.wapifood.com/waiters/orders-history", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `Error ${response.status}: ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener el historial de meseros:", error);
        throw error;
    }
}
