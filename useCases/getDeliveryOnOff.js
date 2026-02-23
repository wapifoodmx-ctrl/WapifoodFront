async function getDeliveryOnOff(uuid) {
  try {
    const response = await fetch(`https://api.wapifood.com/orders/web/status/delivery?restaurant_uuid=${uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching delivery status:', error);
    throw error;
  }
}

module.exports = getDeliveryOnOff;