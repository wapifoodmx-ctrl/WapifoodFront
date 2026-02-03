export async function puntoVentaPostOrder(products, descuentoOrden = null, metodoPago = 'efectivo') {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
        throw new Error('No se encontró el token de autenticación');
    }

    // Preparar los datos de productos con descuentos
    const productIds = products.map(p => p.id).join(',');
    const quantities = products.map(p => p.cantidad).join(',');
    
    // Preparar descuentos por producto (si existen)
    const productDiscounts = products.map(p => {
        if (p.descuento && p.descuento.valor && p.descuento.valor !== '0') {
            return JSON.stringify({
                tipo: p.descuento.tipo,
                valor: p.descuento.valor
            });
        }
        return '';
    }).join('|||');

    const formData = new URLSearchParams();
    formData.append('product_ids', productIds);
    formData.append('quantities', quantities);
    formData.append('metodo_pago', metodoPago);
    
    // Agregar descuentos por producto si existen
    if (productDiscounts && productDiscounts.trim() !== '') {
        formData.append('product_discounts', productDiscounts);
    }
    
    // Agregar descuento de orden si existe
    if (descuentoOrden && descuentoOrden.valor && descuentoOrden.valor !== '0') {
        formData.append('order_discount_type', descuentoOrden.tipo);
        formData.append('order_discount_value', descuentoOrden.valor);
    }

    const response = await fetch('https://api.wapifood.com/orders/kiosko', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la orden del punto de venta');
    }

    const result = await response.json();
    
    // La respuesta debe incluir: order_uuid, ticket_number, etc.
    return result;
}
