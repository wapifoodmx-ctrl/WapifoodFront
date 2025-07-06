export const cancelOrder = async (orderUuid) => {
  try {
    // Obtener el token del localStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("No se encontró el token de autenticación");
    }

    // Construir la URL con los parámetros de query
    const endpoint = `https://comandapp-api.h-dev.xyz/orders/orders/${orderUuid}/cambio_estatus?order_status=Cancelado&metodo_pago=efectivo`;

    console.log('Cancelando orden:', endpoint);

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('Orden cancelada exitosamente:', data);
    return data;
  } catch (error) {
    console.error("Error al cancelar la orden:", error);
    throw error;
  }
};
