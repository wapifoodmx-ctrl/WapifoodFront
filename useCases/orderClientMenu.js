/**
 * Crea una nueva orden desde el menú del cliente con soporte para descuentos
 * @param {Object} orderData - Datos de la orden
 * @param {Array<string>} orderData.product_ids - Array de IDs de productos
 * @param {Array<number>} orderData.quantities - Array de cantidades correspondientes
 * @param {number} orderData.table_number - Número de mesa (dinámico)
 * @param {string} [orderData.order_uuid] - UUID opcional de la orden (para pedidos adicionales)
 * @param {string} [orderData.discounts_products] - String con descuentos por producto separados por coma (ej: "10%,0,5.50")
 * @param {string} [orderData.discount_order] - Descuento general de la orden (ej: "15%" o "10.00")
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function createClientOrder(orderData) {
    const endpoint = 'http://192.168.1.69:8000/orders';
    
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

    // Validar número de mesa
    if (!orderData.table_number || typeof orderData.table_number !== 'number' || orderData.table_number <= 0) {
        throw new Error('table_number es requerido y debe ser un número mayor a 0');
    }

    // Obtener token del localStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        throw new Error('Token de autenticación no encontrado');
    }

    try {
        // Preparar los datos para form-urlencoded
        const formData = new URLSearchParams();
        
        // Convertir arrays a strings separados por comas
        formData.append('product_ids', orderData.product_ids.join(','));
        formData.append('quantities', orderData.quantities.join(','));
        formData.append('table_number', orderData.table_number.toString());
        
        // Agregar order_uuid solo si se proporciona y no está vacío
        if (orderData.order_uuid && orderData.order_uuid.trim() !== '') {
            formData.append('order_uuid', orderData.order_uuid.trim());
        }

        // Agregar descuentos por producto si se proporcionan
        if (orderData.discounts_products) {
            formData.append('discounts_products', orderData.discounts_products);
        }

        // Agregar descuento general si se proporciona
        if (orderData.discount_order) {
            formData.append('discount_order', orderData.discount_order);
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });

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
        return data;

    } catch (error) {
        console.error('Error al crear la orden del cliente:', error.message);
        throw error;
    }
}

/**
 * Función de conveniencia para crear una orden simple desde el menú del cliente con descuentos
 * @param {Array<Object>} productos - Array de productos con {id, cantidad, descuento}
 * @param {number} tableNumber - Número de mesa
 * @param {string} [orderUuid] - UUID opcional de la orden
 * @param {Object} [descuentoOrden] - Objeto con descuento general {tipo, valor, aplicado}
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function createSimpleClientOrder(productos, tableNumber, orderUuid = null, descuentoOrden = null) {
    // Extraer IDs y cantidades de los productos
    const product_ids = productos.map(producto => producto.id.toString());
    const quantities = productos.map(producto => producto.cantidad);

    // Generar string de descuentos por producto
    const discounts_products = productos.map(producto => {
        if (!producto.descuento || producto.descuento.valor === '' || producto.descuento.valor === '0') {
            return '0';
        }
        return producto.descuento.tipo === 'porcentaje' 
            ? `${producto.descuento.valor}%` 
            : producto.descuento.valor;
    }).join(',');

    // Generar string de descuento de orden
    let discount_order = '0';
    if (descuentoOrden && descuentoOrden.aplicado && descuentoOrden.valor !== '' && descuentoOrden.valor !== '0') {
        discount_order = descuentoOrden.tipo === 'porcentaje' 
            ? `${descuentoOrden.valor}%` 
            : descuentoOrden.valor;
    }

    return await createClientOrder({
        product_ids,
        quantities,
        table_number: tableNumber,
        order_uuid: orderUuid,
        discounts_products,
        discount_order
    });
}

/**
 * Función para agregar productos a una orden existente desde el menú del cliente con descuentos
 * @param {string} orderUuid - UUID de la orden existente
 * @param {Array<Object>} nuevosProductos - Array de nuevos productos con {id, cantidad, descuento}
 * @param {number} tableNumber - Número de mesa
 * @param {Object} [descuentoOrden] - Objeto con descuento general {tipo, valor, aplicado}
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function addProductsToClientOrder(orderUuid, nuevosProductos, tableNumber, descuentoOrden = null) {
    if (!orderUuid || orderUuid.trim() === '') {
        throw new Error('orderUuid es requerido para agregar productos a una orden existente');
    }

    return await createSimpleClientOrder(nuevosProductos, tableNumber, orderUuid, descuentoOrden);
}