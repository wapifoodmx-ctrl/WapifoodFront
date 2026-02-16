const getOrdersWebMenu = async () => {
    try {
        const response = await fetch('https://api.wapifood.com/orders/web/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las órdenes del menú web:', error);
        throw error;
    }
};

export default getOrdersWebMenu;
