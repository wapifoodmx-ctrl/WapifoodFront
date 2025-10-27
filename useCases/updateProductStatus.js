/**
 * Actualiza el estado de uno o múltiples detalles de productos en una orden
 * @param {string} orderUuid - UUID de la orden
 * @param {string|string[]} idOrdersDetails - ID del detalle de la orden (puede ser un string o array)
 * @param {string} orderDetailStatus - Estado del detalle ('Preparado', 'Finalizado', 'Cancelado', 'PuntoDeVenta')
 * @returns {Promise<Object>} - Respuesta de la API
 */
async function updateProductStatus(orderUuid, idOrdersDetails, orderDetailStatus) {
  // Validar que el estado sea uno de los permitidos
  const validStatuses = ['Preparado', 'Finalizado', 'Cancelado', 'PuntoDeVenta', 'Pendiente'];
  if (!validStatuses.includes(orderDetailStatus)) {
    throw new Error(`Estado no válido. Debe ser uno de: ${validStatuses.join(', ')}`);
  }

  // Obtener el token del localStorage o sessionStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const url = `http://201.137.184.207:8000/orders/orders/${orderUuid}/cambio_details_status`;

  // Convertir a string si es array (separado por comas)
  const idsString = Array.isArray(idOrdersDetails) 
    ? idOrdersDetails.join(',') 
    : idOrdersDetails.toString();

  // Crear FormData para enviar como form data
  const formData = new FormData();
  formData.append('id_orders_details', idsString);
  formData.append('order_detail_status', orderDetailStatus);

  // Agregar logs para debugging
  // console.log('Datos enviados a la API:', {
  //   url,
  //   orderUuid,
  //   idOrdersDetails,
  //   idsString,
  //   orderDetailStatus,
  //   formDataEntries: Array.from(formData.entries())
  // });

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // No incluir Content-Type para que el navegador lo configure automáticamente para FormData
      },
      body: formData
    });

    // console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(`Error ${response.status}: ${errorData.message || 'Error al actualizar el estado'}`);
    }

    const responseData = await response.json();
    // console.log('Respuesta exitosa:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error al actualizar el estado del producto:', error);
    throw error;
  }
}

export { updateProductStatus };