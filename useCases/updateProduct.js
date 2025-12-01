import axios from "axios";

/**
 * Obtiene el token de autenticación desde localStorage o sessionStorage.
 * @returns {string|null} El token de autenticación o null si no existe.
 */
function getAuthToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

/**
 * Actualiza un producto existente con una imagen asociada.
 * @param {number} id_products - ID del producto a actualizar.
 * @param {Object} productData - Datos del producto en formato JSON.
 * @param {File} imageFile - Archivo de imagen (opcional).
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
export async function updateProduct(id_products, productData, imageFile) {
    // Construir los parámetros de consulta
    const queryParams = new URLSearchParams();
    if (productData.name) queryParams.append("name", productData.name);
    if (productData.description) queryParams.append("description", productData.description);
    if (productData.price) queryParams.append("price", productData.price);
    if (productData.status) queryParams.append("status", productData.status);
    if (productData.category_id) queryParams.append("category_id", productData.category_id);

    // Construir la URL con los parámetros de consulta
    const url = `http://201.137.169.6:8000/products/${id_products}?${queryParams.toString()}`;

    // Crear el FormData para el archivo
    const formData = new FormData();
    if (imageFile) {
        if (!(imageFile instanceof File)) {
            throw new Error("El archivo de imagen debe ser un objeto File válido.");
        }
        formData.append("file", imageFile);
    }

    // Obtener el token desde localStorage o sessionStorage
    const token = getAuthToken();
    if (!token) {
        throw new Error("No se encontró un token de autenticación. Por favor, inicia sesión.");
    }

    // console.log("URL de la solicitud:", url);
    // console.log("Datos enviados (FormData):", formData.get("file")); // Log para verificar el archivo

    try {
        const response = await axios.patch(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el producto:", error.response?.data || error.message);
        throw new Error(
            `Error al actualizar el producto: ${error.response?.data?.message || "Verifica los datos enviados."}`
        );
    }
}
