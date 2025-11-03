import axios from "axios";

/**
 * Obtiene el token de autenticación desde localStorage o sessionStorage.
 * @returns {string|null} El token de autenticación o null si no existe.
 */
function getAuthToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

/**
 * Crea un producto con una imagen asociada.
 * @param {Object} productData - Datos del producto en formato JSON.
 * @param {File} imageFile - Archivo de imagen (opcional).
 * @returns {Promise<Object>} - Respuesta del servidor.
 */
export async function createProduct(productData, imageFile) {
    const formData = new FormData();

    // Agregar los campos del producto individualmente con los nombres correctos
    formData.append("name", productData.name || "");
    formData.append("description", productData.description || "");
    formData.append("price", parseFloat(productData.price || "")); // Convertir a string
    formData.append("category_id", parseInt(productData.category_id || "")); // Convertir a string

    // Validar y agregar el archivo de imagen si está disponible
    if (imageFile) {
        if (!(imageFile instanceof File)) {
            throw new Error("El archivo de imagen debe ser un objeto File válido.");
        }
        formData.append("file", imageFile);
    } else {
        console.warn("No se proporcionó un archivo de imagen.");
    }

    // Obtener el token desde localStorage o sessionStorage
    const token = getAuthToken();
    if (!token) {
        throw new Error("No se encontró un token de autenticación. Por favor, inicia sesión.");
    }

    // Construir la URL con el parámetro de consulta "product"
    const queryParam = `?product=${encodeURIComponent(JSON.stringify(productData))}`;
    const url = `http://201.137.143.34:8000/products/${queryParam}`;

    // console.log("URL de la solicitud:", url);
    // console.log("Datos enviados (formData):", Object.fromEntries(formData.entries())); // Log form data

    try {
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el producto:", error.response?.data || error.message);
        console.error("Detalles del error:", error.response?.data); // Log server response
        if (error.response?.data?.detail) {
            console.error("Campos faltantes o inválidos:", error.response.data.detail);
        }
        throw new Error(
            `Error al crear el producto: ${error.response?.data?.message || "Verifica los datos enviados."}`
        );
    }
}