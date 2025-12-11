/**
 * Login para meseros
 * POST https://api.wapifood.com/login/waiter
 * @param {string} email - Email del mesero
 * @param {string} access_code - Código de acceso del mesero
 * @returns {Promise<{access_token: string, token_type: string, mesero_name: string, restaurant_name: string}>}
 */
export async function loginMesero(email, access_code) {
  try {
    const response = await fetch('https://api.wapifood.com/login/waiter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        access_code
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Error al iniciar sesión');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
