/**
 * Crea una nueva orden en el punto de venta
 * @param {Object} orderData - Datos de la orden
 * @param {Array<string>} orderData.product_ids - Array de IDs de productos
 * @param {Array<number>} orderData.quantities - Array de cantidades correspondientes
 * @param {string} [orderData.descuento] - Descuento para toda la orden (ej: '10%' o '5.00')
 * @param {string} [orderData.descuento_details] - Descuentos por producto (ej: '0,20%,0,30.00,0')
 * @param {string} [orderData.metodo_pago] - Método de pago (efectivo, tarjeta, pasarela)
 * @param {string} [orderData.order_uuid] - UUID opcional de la orden (para pedidos adicionales)
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function createOrder(orderData) {
    const endpoint = 'http://201.137.169.6:8000/orders';
    
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
        formData.append('table_number', '1'); // Siempre mesa número 1
        
        // Agregar descuento para toda la orden si se proporciona (enviar string vacío si no hay descuento)
        const descuentoGeneral = orderData.descuento && orderData.descuento.trim() !== '' && orderData.descuento !== '0' 
            ? orderData.descuento.trim() 
            : '';
        formData.append('descuento', descuentoGeneral);
        
        // Agregar descuentos por producto (enviar string vacío si no hay descuentos)
        const descuentoDetails = orderData.descuento_details && orderData.descuento_details.trim() !== '' 
            ? orderData.descuento_details.trim() 
            : '';
        formData.append('descuento_details', descuentoDetails);
        
        // Agregar método de pago si se proporciona (enviar string vacío si no se especifica)
        const metodoPago = orderData.metodo_pago && orderData.metodo_pago.trim() !== '' 
            ? orderData.metodo_pago.trim() 
            : '';
        formData.append('metodo_pago', metodoPago);
        
        // Agregar order_uuid solo si se proporciona y no está vacío (enviar string vacío si no se especifica)
        const orderUuid = orderData.order_uuid && orderData.order_uuid.trim() !== '' 
            ? orderData.order_uuid.trim() 
            : '';
        formData.append('order_uuid', orderUuid);

        console.log('Enviando orden con descuentos:', {
            product_ids: orderData.product_ids.join(','),
            quantities: orderData.quantities.join(','),
            table_number: 1,
            descuento: descuentoGeneral || '(envío vacío)',
            descuento_details: descuentoDetails || '(envío vacío)',
            metodo_pago: metodoPago || '(envío vacío)',
            order_uuid: orderUuid || '(envío vacío - se generará automáticamente)'
        });

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
        console.log('Orden creada exitosamente:', data);
        return data;

    } catch (error) {
        console.error('Error al crear la orden:', error.message);
        throw error;
    }
}

/**
 * Función de conveniencia para crear una orden simple con descuentos
 * @param {Array<Object>} productos - Array de productos con {id, cantidad, descuento}
 * @param {string} [orderUuid] - UUID opcional de la orden
 * @param {Object} [descuentoOrden] - Descuento para toda la orden {tipo, valor, aplicado}
 * @param {string} [metodoPago] - Método de pago
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function createSimpleOrder(productos, orderUuid = null, descuentoOrden = null, metodoPago = null) {
    // Extraer IDs y cantidades de los productos
    const product_ids = productos.map(producto => producto.id.toString());
    const quantities = productos.map(producto => producto.cantidad);

    // Generar string de descuentos por producto
    const descuento_details = generateDescuentoDetails(productos);
    
    // Generar string de descuento general
    const descuento = generateDescuentoOrden(descuentoOrden);

    return await createOrder({
        product_ids,
        quantities,
        descuento,
        descuento_details,
        metodo_pago: metodoPago,
        order_uuid: orderUuid
    });
}

/**
 * Genera el string de descuentos por producto para la API
 * Formato esperado: "0,20%,0,30.00,0,0,0" (separado por comas, una posición por cada producto)
 * @param {Array<Object>} productos - Array de productos con descuentos
 * @returns {string} - String de descuentos separados por comas o string vacío si no hay descuentos
 */
function generateDescuentoDetails(productos) {
    // Verificar si algún producto tiene descuento
    const tieneDescuentos = productos.some(producto => 
        producto.descuento && 
        producto.descuento.valor !== '' && 
        producto.descuento.valor !== '0' &&
        parseFloat(producto.descuento.valor) > 0
    );

    // Si no hay descuentos, retornar string vacío
    if (!tieneDescuentos) {
        return '';
    }

    // Generar array de descuentos para cada producto
    const descuentos = productos.map(producto => {
        // Si el producto no tiene descuento o el valor es 0 o vacío
        if (!producto.descuento || 
            producto.descuento.valor === '' || 
            producto.descuento.valor === '0' ||
            parseFloat(producto.descuento.valor) <= 0) {
            return '0';
        }
        
        const valor = parseFloat(producto.descuento.valor);
        
        if (producto.descuento.tipo === 'porcentaje') {
            return `${valor}%`;
        } else {
            // Para pesos, asegurar formato .00 si es número entero
            if (valor % 1 === 0) {
                return `${valor}.00`;
            } else {
                return valor.toFixed(2);
            }
        }
    });

    return descuentos.join(',');
}

/**
 * Genera el string de descuento general para la API
 * Formato: "10%" para porcentaje, "10.00" para pesos
 * @param {Object} descuentoOrden - Objeto con tipo, valor y aplicado
 * @returns {string} - String del descuento o string vacío si no hay descuento
 */
function generateDescuentoOrden(descuentoOrden) {
    // Si no hay descuento aplicado, retornar string vacío
    if (!descuentoOrden || 
        !descuentoOrden.aplicado || 
        descuentoOrden.valor === '' || 
        descuentoOrden.valor === '0' ||
        parseFloat(descuentoOrden.valor) <= 0) {
        return '';
    }
    
    const valor = parseFloat(descuentoOrden.valor);
    
    if (descuentoOrden.tipo === 'porcentaje') {
        return `${valor}%`;
    } else {
        // Para pesos, asegurar formato .00 si es número entero
        if (valor % 1 === 0) {
            return `${valor}.00`;
        } else {
            return valor.toFixed(2);
        }
    }
}

/**
 * Función para agregar productos a una orden existente
 * @param {string} orderUuid - UUID de la orden existente
 * @param {Array<Object>} nuevosProductos - Array de nuevos productos con {id, cantidad, descuento}
 * @param {Object} [descuentoOrden] - Descuento para toda la orden
 * @param {string} [metodoPago] - Método de pago
 * @returns {Promise<Object>} - Respuesta de la API
 */
export async function addProductsToOrder(orderUuid, nuevosProductos, descuentoOrden = null, metodoPago = null) {
    if (!orderUuid || orderUuid.trim() === '') {
        throw new Error('orderUuid es requerido para agregar productos a una orden existente');
    }

    return await createSimpleOrder(nuevosProductos, orderUuid, descuentoOrden, metodoPago);
}