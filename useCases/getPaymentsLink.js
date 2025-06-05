export default async function getPaymentsLink(propsData) {
    const endpoint = 'https://comandapp-api.h-dev.xyz/payments/create-checkout-session';

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
            throw new Error('No se encontró un token en el localStorage');
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
            },
            body: JSON.stringify(propsData), // Enviar los datos del plan
        });

        if (!response.ok) {
            const errorData = await response.json(); // Parsear el error del servidor
            const errorMessage = errorData.message || 'Error al obtener el link de la propiedad de venta';
            throw new Error(errorMessage); // Lanzar un error con el mensaje del backend
        }

        const data = await response.json(); // Parsear la respuesta como JSON
        return data; // Devolver la respuesta del servidor
    } catch (error) {
        console.error('Error al crear el link de ventas: ', error.message);
        throw error; // Re-lanzar el error para que sea manejado en el componente
    }
}

export async function getAllPaymentLinks(plans) {
    try {
        const updatedPlans = [];
        for (const plan of plans) {
            try {
                const response = await getPaymentsLink({ plan: plan.prop });
                updatedPlans.push({ ...plan, link: response.checkout_url });
            } catch (error) {
                console.error(`Error al obtener el enlace para el plan ${plan.prop}:`, error.message);
                updatedPlans.push({ ...plan, link: null }); // Si falla, asignar null al enlace
            }
        }
        return updatedPlans;
    } catch (error) {
        console.error("Error al obtener los enlaces de pago:", error.message);
        throw error;
    }
}