// useCases/externalOrderDelivery.js
// Crea una orden a domicilio desde el menú web externo

const externalOrderDelivery = async (restaurantUuid, orderData) => {
    try {
        const response = await fetch(
            `https://api.wapifood.com/orders/web/create?restaurant_uuid=${restaurantUuid}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error al crear orden: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en externalOrderDelivery:', error);
        throw error;
    }
};

export default externalOrderDelivery;
