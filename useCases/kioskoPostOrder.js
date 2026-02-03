export async function kioskoPostOrder(productIds, quantities, metodoPago = 'efectivo') {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || localStorage.getItem('kioskoToken') || sessionStorage.getItem('kioskoToken');
    
    if (!token) {
        throw new Error('No se encontró el token de autenticación');
    }

    const formData = new URLSearchParams();
    formData.append('product_ids', productIds);
    formData.append('quantities', quantities);
    formData.append('metodo_pago', metodoPago);

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
        throw new Error(errorData.message || 'Error al crear la orden del kiosko');
    }

    return await response.json();
}
