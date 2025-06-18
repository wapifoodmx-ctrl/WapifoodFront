/**
 * Crea una nueva orden en el punto de venta
 * @param {Object} orderData - Datos de la orden
 * @param {Array<string>} orderData.product_ids - Array de IDs de productos
 * @param {Array<number>} orderData.quantities - Array de cantidades correspondientes
 * @param {string} [orderData.order_uuid] - UUID opcional de la orden (para pedidos adicionales)
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function createOrder(orderData) {
    const endpoint = 'https://comandapp-api.h-dev.xyz/orders';
    
    // Validaciones básicas
    if (!orderData.product_ids || !Array.isArray(orderData.product_ids) || orderData.product_ids.length === 0) {
        throw new Error('product_ids es requerido y debe ser un array no vacío');
    }
    
    if (!orderData.quantities || !Array.isArray(orderData.quantities) || orderData.quantities.length === 0) {
        throw new Error('quantities es requerido y debe ser un array no vacío');
    }
    
    if (orderData.product_ids.length !== orderData.quantities.length) {
        throw new Error('El número de product_ids debe coincidir con el número de quantities');
    }

    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token de autenticación no encontrado');
    }

    try {
        // Preparar los datos para form-urlencoded
        const formData = new URLSearchParams();
        
        // Convertir arrays a strings separados por comas
        formData.append('product_ids', orderData.product_ids.join(','));
        formData.append('quantities', orderData.quantities.join(','));
        formData.append('table_number', '1'); // Siempre mesa número 1
        
        // Agregar order_uuid solo si se proporciona y no está vacío
        if (orderData.order_uuid && orderData.order_uuid.trim() !== '') {
            formData.append('order_uuid', orderData.order_uuid.trim());
        }

        console.log('Enviando orden:', {
            product_ids: orderData.product_ids.join(','),
            quantities: orderData.quantities.join(','),
            table_number: 1,
            order_uuid: orderData.order_uuid || 'Se generará automáticamente'
        });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

        console.log('Status de respuesta:', response.status);

        if (!response.ok) {
            let errorData = {};
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    errorData = await response.json();
                } else {
                    errorData.message = await response.text();
                }
            } catch (e) {
                console.error('No se pudo parsear la respuesta de error:', e);
                errorData.message = `Error HTTP ${response.status}`;
            }

            console.error('Error en la respuesta:', response.status, response.statusText, errorData);
            
            throw new Error(
                errorData.message || 
                errorData.error || 
                `Error al crear la orden. Código de estado: ${response.status}`
            );
        }

        const data = await response.json();
        console.log('Orden creada exitosamente:', data);
        return data;

    } catch (error) {
        console.error('Error al crear la orden:', error.message);
        throw error;
    }
}

/**
 * Función de conveniencia para crear una orden simple
 * @param {Array<Object>} productos - Array de productos con {id, cantidad}
 * @param {string} [orderUuid] - UUID opcional de la orden
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function createSimpleOrder(productos, orderUuid = null) {
    // Extraer IDs y cantidades de los productos
    const product_ids = productos.map(producto => producto.id.toString());
    const quantities = productos.map(producto => producto.cantidad);

    return await createOrder({
        product_ids,
        quantities,
        order_uuid: orderUuid
    });
}

/**
 * Función para agregar productos a una orden existente
 * @param {string} orderUuid - UUID de la orden existente
 * @param {Array<Object>} nuevosProductos - Array de nuevos productos con {id, cantidad}
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function addProductsToOrder(orderUuid, nuevosProductos) {
    if (!orderUuid || orderUuid.trim() === '') {
        throw new Error('orderUuid es requerido para agregar productos a una orden existente');
    }

    return await createSimpleOrder(nuevosProductos, orderUuid);
}