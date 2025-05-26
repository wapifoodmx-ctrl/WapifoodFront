import { useState, useEffect } from "react";
import Image from "next/image";
import kime from "@/pages/assets/img/kime.jpeg";
import { FiEdit } from "react-icons/fi";
import { Formik, Form, Field } from "formik";
import { updateProduct } from "../useCases/updateProduct"; // Importar la función para actualizar productos
import ModalMessage from "../components/ModalMessage"; // Importar la modal de mensajes

export default function Cards({ products, searchTerm, selectedCategory, categories, onRefresh, availabilityFilter }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar la modal
    const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para editar
    const [loading, setLoading] = useState(true); // Estado de carga
    const [modalMessage, setModalMessage] = useState(null); // Estado para el mensaje de la modal

    useEffect(() => {
        // Simular un tiempo de carga para mostrar el loader
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, []);

    // Función para truncar el texto
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    // Función para cerrar la modal
    const closeModals = () => {
        setIsEditModalOpen(false); // Cierra la modal
        setSelectedProduct(null); // Limpia el producto seleccionado
    };

    // Función para actualizar el producto
    const handleUpdateProduct = async (values, imageFile) => {
        try {
            await updateProduct(values.id_products, values, imageFile); // Llamar a la función para actualizar el producto
            setModalMessage("Producto actualizado con éxito.");
            closeModals();
            if (onRefresh) {
                onRefresh(); // Llamar a onRefresh si está definido
            }
        } catch (err) {
            console.error("Error al actualizar el producto:", err.message);
            setModalMessage(err.message || "Hubo un error al actualizar el producto.");
        }
    };

    // Filtrar los productos basados en el término de búsqueda, categoría seleccionada y disponibilidad
    const filteredProducts = products.filter((product) => {
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase()); // Filtro por búsqueda
        const matchesCategory = selectedCategory === "" || product.category_id === parseInt(selectedCategory); // Filtro por categoría
        const matchesAvailability =
            availabilityFilter === "todos" || // Mostrar todos si el filtro es "todos"
            (availabilityFilter === "disponibles" && product.status === "activo") || // Mostrar solo activos
            (availabilityFilter === "no-disponibles" && product.status === "inactivo"); // Mostrar solo inactivos

        return matchesSearchTerm && matchesCategory && matchesAvailability; // Combinar todos los filtros
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-64">
                <p className="text-gray-500 text-xl font-bold">Cargando productos...</p>
            </div>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <div className="flex justify-center items-center w-full h-64">
                <p className="text-gray-500 text-xl font-bold">
                    Lo siento, no se encontró ningún producto relacionado
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-6 justify-center w-full ">
            {/* Mostrar la modal si hay un mensaje */}
            {modalMessage && (
                <ModalMessage
                    message={modalMessage}
                    onClose={() => setModalMessage(null)} // Cerrar la modal
                />
            )}

            {filteredProducts.map((product) => (
                <section
                    key={product.id_products}
                    className="relative rounded-t-2xl shadow flex justify-center items-center flex-col w-full md:w-4/10 lg:w-3/10"
                >
                    <div className="relative w-full h-48">
                        {/* Imagen del producto */}
                        <Image
                            src={product.image_url?.[0] || kime} // Usa la imagen del producto o una predeterminada
                            alt={product.name}
                            className="rounded-t-2xl w-full h-full object-cover"
                            width={300}
                            height={200}
                        />
                        {/* Marca de agua si el producto está inactivo */}
                        {product.status === "inactivo" && (
                            <div className="absolute inset-0 rounded-t-2xl flex justify-center items-center backdrop-brightness-30">
                                <p className="text-white text-2xl font-bold transform rotate-[-20deg] opacity-80">
                                    No visible en el menu
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex w-full p-4 justify-between items-center">
                        {/* Truncar el nombre del producto dinámicamente */}
                        <h3 className="font-bold text-2xl">
                            <span className=" xl:hidden hidden md:block">
                                {truncateText(product.name, 12)} {/* Móvil y tablet */}
                            </span>
                            <span className="xl:block md:hidden ">
                                {truncateText(product.name, 18)} {/* Computadora */}
                            </span>
                        </h3>
                        <p className="text-2xl text-green-500 font-bold">$ {parseFloat(product.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                    <div className="w-full px-4">
                        <p className="text-gray-500">{truncateText(product.description, 55)}</p>
                    </div>
                    <div className="w-full p-4 flex justify-between items-center">
                        <p className="bg-green-300 rounded-2xl px-6 py-1 text-xl">{product.category_name}</p>
                        <button
                            className="flex gap-4"
                            onClick={() => {
                                setSelectedProduct(product); // Establece el producto seleccionado
                                setIsEditModalOpen(true); // Abre la modal
                            }}
                        >
                            <FiEdit size={28} className="cursor-pointer" />
                        </button>
                    </div>
                </section>
            ))}

            {/* Modal de Editar Producto */}
            {isEditModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={closeModals} // Cierra la modal al hacer clic fuera
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-4/5"
                        onClick={(e) => e.stopPropagation()} // Evita cerrar la modal al hacer clic dentro
                    >
                        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
                        <Formik
                            initialValues={{
                                id_products: selectedProduct.id_products,
                                name: selectedProduct.name,
                                description: selectedProduct.description,
                                price: selectedProduct.price,
                                category_id: selectedProduct.category_id,
                                image: null, // Imagen inicial vacía
                                status: selectedProduct.status, // Inicializar con el estado actual
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                handleUpdateProduct(values, values.image); // Actualiza el producto
                                setSubmitting(false); // Finaliza el estado de envío
                            }}
                        >
                            {({ setFieldValue, values }) => {
                                // Validaciones
                                const isDescriptionTooLong = values.description && values.description.length > 500;
                                const isCategoryNotSelected = !values.category_id || values.category_id === "";
                                const isFormInvalid = isDescriptionTooLong || isCategoryNotSelected;

                                return (
                                    <Form className="space-y-4">
                                        {/* Nombre del producto */}
                                        <div>
                                            <label className="font-bold text-gray-600 pb-2">Nombre del producto</label>
                                            <Field
                                                name="name"
                                                type="text"
                                                className="ml-2 w-full outline-none cursor-text border-gray-500 border-2 rounded-xl px-3 py-2"
                                                placeholder="Nombre del producto"
                                            />
                                        </div>

                                        {/* Descripción */}
                                        <div>
                                            <label className="font-bold text-gray-600 py-2">Descripción</label>
                                            <Field
                                                name="description"
                                                as="textarea"
                                                className="gap-4 w-full h-40 rounded-xl border-gray-500 border-2 outline-none px-3 py-2"
                                                placeholder="Escribe una descripción..."
                                            />
                                            {/* Validación de descripción */}
                                            {isDescriptionTooLong && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    La descripción no puede exceder los 500 caracteres. Actualmente: {values.description.length}/500
                                                </p>
                                            )}
                                        </div>

                                        {/* Precio */}
                                        <div>
                                            <label className="font-bold text-gray-600">Precio</label>
                                            <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 w-45">
                                                <Field
                                                    name="price"
                                                    type="number"
                                                    className="ml-2 w-full outline-none"
                                                    placeholder="Precio"
                                                />
                                            </div>
                                        </div>

                                        {/* Categoría */}
                                        <div>
                                            <label className="font-bold text-gray-600 pb-2">Categoría</label>
                                            <Field
                                                name="category_id"
                                                as="select"
                                                className="px-3 py-2 border-2 border-gray-500 rounded-md outline-none cursor-pointer w-full"
                                            >
                                                <option value="" disabled>
                                                    Seleccionar Categoría
                                                </option>
                                                {(categories || []).map((category) => (
                                                    <option key={category.id_categoria} value={category.id_categoria}>
                                                        {category.nombre_categoria}
                                                    </option>
                                                ))}
                                            </Field>
                                            {/* Validación de categoría */}
                                            {isCategoryNotSelected && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    Debe seleccionar una categoría para el producto.
                                                </p>
                                            )}
                                        </div>

                                        {/* Imagen */}
                                        <div>
                                            <label className="font-bold text-gray-600 pb-2 pt-4">
                                                Imagen del Producto
                                            </label>
                                            <p className="text-sm text-gray-500 pb-2">
                                                Formatos permitidos: .jpg, .jpeg, .png, .gif
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif,image/jpg"
                                                onChange={(event) => {
                                                    const file = event.target.files[0];
                                                    const allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

                                                    if (file && !allowedFormats.includes(file.type)) {
                                                        setModalMessage("Formato de archivo no válido. Solo se permiten .jpg, .jpeg, .png o .gif.");
                                                        event.target.value = ""; // Limpiar el input
                                                        return;
                                                    }

                                                    setFieldValue("image", file); // Establecer el archivo si es válido
                                                }}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>

                                        {/* Estado */}
                                        <div>
                                            <label className="font-bold text-gray-600 pb-2">Estado del Producto</label>
                                            <Field
                                                name="status"
                                                as="select"
                                                className="px-3 py-2 border-2 border-gray-500 rounded-md outline-none cursor-pointer w-full"
                                                onChange={(e) => setFieldValue("status", e.target.value)} // Actualizar el valor de status
                                            >
                                                <option value="activo">Activo</option>
                                                <option value="inactivo">Inactivo</option>
                                            </Field>
                                        </div>

                                        {/* Botones */}
                                        <div className="flex gap-4">
                                            <button
                                                type="submit"
                                                disabled={isFormInvalid} // Deshabilitar el botón si hay errores
                                                className={`mt-4 px-4 py-2 text-white rounded ${
                                                    isFormInvalid 
                                                        ? 'bg-gray-400 cursor-not-allowed' 
                                                        : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                                                }`}
                                            >
                                                Guardar Cambios
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 cursor-pointer"
                                                onClick={closeModals}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
}