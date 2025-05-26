import { MdOutlineAttachMoney } from "react-icons/md";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";
import { BsTag } from "react-icons/bs";
import { Formik, Form, Field } from "formik";
import { createProduct } from "../useCases/createProduct"; // Import the function
import * as Yup from "yup"; // Importar Yup
import postCategoria from "../useCases/postCategoria"; // Importar la función para crear categorías
import ModalMessage from "../components/ModalMessage"; // Importar la nueva modal

export default function MenuComponentes({ onSearch, onCategoryChange, onRefresh, categories, onAvailabilityChange }) {
    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const [modalMessage, setModalMessage] = useState(null); // Estado para el mensaje de la modal

    const closeModals = () => {
        setIsProductoModalOpen(false);
        setIsCategoriaModalOpen(false);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value); // Actualizar el estado local
        onSearch(value); // Pasar el término de búsqueda al componente padre
    };

    const validationSchemaProducto = Yup.object().shape({
        nombre: Yup.string().required("El nombre del producto es obligatorio"),
        descripcion: Yup.string().required("La descripción es obligatoria"),
        precio: Yup.number()
            .typeError("El precio debe ser un número")
            .required("El precio es obligatorio"),
        imagen: Yup.mixed().required("La imagen del producto es obligatoria"),
    });

    const validationSchemaCategoria = Yup.object().shape({
        nombre_categoria: Yup.string().required("El nombre de la categoría es obligatorio"),
        descripcion_categoria: Yup.string().required("La descripción es obligatoria"),
    });

    return (
        <section className="lg:flex my-4 lg:gap-4 lg:justify-between lg:items-center">
            {/* Mostrar la modal si hay un mensaje */}
            {modalMessage && (
                <ModalMessage
                    message={modalMessage}
                    onClose={() => setModalMessage(null)} // Cerrar la modal
                />
            )}

            {/* Barra de búsqueda */}
            <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 lg:mb-0 lg:w-6/12 justify-center items-center">
                <HiOutlineMagnifyingGlass className="text-xl" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm} // Vincular el estado al input
                    onChange={handleSearchChange} // Manejar el cambio
                    className="ml-2 w-full outline-none"
                />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                {/* Dropdowns */}
                <div className="flex gap-4">
                    {/* Dropdown Categorías */}
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <BsTag className="text-2xl" />
                            <select
                                id="categorias"
                                className="w-full outline-none bg-transparent"
                                onChange={(e) => onCategoryChange(e.target.value)} // Manejar cambio de categoría
                            >
                                <option value="">Todas</option>
                                {categories.map((category) => (
                                    <option key={category.id_categoria} value={category.id_categoria}>
                                        {category.nombre_categoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Dropdown Disponibilidad */}
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <FiFilter className="text-2xl" />
                            <select
                                id="disponibilidad"
                                className="w-full outline-none bg-transparent"
                                onChange={(e) => onAvailabilityChange(e.target.value)} // Corregir para usar onAvailabilityChange
                            >
                                <option value="todos">Todos los Disponibles</option>
                                <option value="disponibles">Disponibles</option>
                                <option value="no-disponibles">No Disponibles</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                    <button
                        className="p-2 text-sm bg-green-500 text-white rounded-2xl cursor-pointer w-full flex justify-center items-center"
                        onClick={() => setIsProductoModalOpen(true)}
                    >
                        <span className="flex justify-center items-center gap-4">
                            <FaPlus size={20} /> Productos
                        </span>
                    </button>
                    <button
                        className="p-2 border rounded-2xl cursor-pointer ml-2 w-full flex justify-center items-center"
                        onClick={() => setIsCategoriaModalOpen(true)}
                    >
                        <span className="flex justify-center items-center gap-2">
                            <BsTag size={20} /> Categorías
                        </span>
                    </button>
                </div>
            </div>

            {/* Modal de Productos */}
            {isProductoModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={closeModals}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-4/5"
                        onClick={(e) => e.stopPropagation()} // Evita cerrar la modal al hacer clic dentro
                    >
                        <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
                        <Formik
                            initialValues={{
                                nombre: "",
                                descripcion: "",
                                precio: "",
                                categoria: "",
                                imagen: null,
                            }}
                            validationSchema={validationSchemaProducto} // Añadir validación
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const productData = {
                                        name: values.nombre,
                                        description: values.descripcion,
                                        price: values.precio,
                                        category_id: values.categoria,
                                    };

                                    if (!values.imagen) {
                                        setModalMessage("Por favor, selecciona una imagen válida.");
                                        setSubmitting(false);
                                        return;
                                    }

                                    await createProduct(productData, values.imagen); // Llamar a la función para crear el producto
                                    setModalMessage("Producto creado exitosamente");
                                    closeModals();
                                    await onRefresh(); // Actualizar los datos globales
                                } catch (error) {
                                    console.error("Error al crear el producto:", error.message);
                                    setModalMessage(error.message || "Error al crear el producto. Verifica los datos enviados.");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ setFieldValue, errors, touched, values }) => {
                                // Validaciones adicionales
                                const isDescriptionTooLong = values.descripcion && values.descripcion.length > 500;
                                const isCategoryNotSelected = !values.categoria || values.categoria === "";
                                const isFormInvalid = isDescriptionTooLong || isCategoryNotSelected;

                                return (
                                    <Form className="space-y-4">
                                        {/* Nombre del producto */}
                                        <div>
                                            <label className="font-bold text-gray-600 pb-2">Nombre del producto</label>
                                            <Field
                                                name="nombre"
                                                type="text"
                                                className="ml-2 w-full outline-none cursor-text border-gray-500 border-2 rounded-xl px-3 py-2"
                                                placeholder="Nombre del producto"
                                            />
                                            {errors.nombre && touched.nombre && (
                                                <div className="text-red-500 text-sm">{errors.nombre}</div>
                                            )}
                                        </div>

                                        {/* Descripción */}
                                        <div>
                                            <label className="font-bold text-gray-600 py-2">Descripción</label>
                                            <Field
                                                name="descripcion"
                                                as="textarea"
                                                className="gap-4 w-full h-40 rounded-xl border-gray-500 border-2 outline-none px-3 py-2"
                                                placeholder="Escribe una descripción..."
                                            />
                                            {errors.descripcion && touched.descripcion && (
                                                <div className="text-red-500 text-sm">{errors.descripcion}</div>
                                            )}
                                            {/* Validación adicional para longitud */}
                                            {isDescriptionTooLong && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    La descripción no puede exceder los 500 caracteres. Actualmente: {values.descripcion.length}/500
                                                </p>
                                            )}
                                        </div>

                                        {/* Precio */}
                                        <div>
                                            <label className="font-bold text-gray-600">Precio</label>
                                            <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 w-45">
                                                <MdOutlineAttachMoney className="text-2xl" />
                                                <Field
                                                    name="precio"
                                                    type="number"
                                                    className="ml-2 w-full outline-none"
                                                    placeholder="Precio"
                                                />
                                            </div>
                                            {errors.precio && touched.precio && (
                                                <div className="text-red-500 text-sm">{errors.precio}</div>
                                            )}
                                        </div>

                                        {/* Categoría */}
                                        <div>
                                            <label className="font-bold text-gray-600 pb-2">Categoría</label>
                                            <Field
                                                name="categoria"
                                                as="select"
                                                className="px-3 py-2 border-2 border-gray-500 rounded-md outline-none cursor-pointer w-full"
                                            >
                                                <option value="" disabled>
                                                    Seleccionar Categoría
                                                </option>
                                                {categories.map((category) => (
                                                    <option key={category.id_categoria} value={category.id_categoria}>
                                                        {category.nombre_categoria}
                                                    </option>
                                                ))}
                                            </Field>
                                            {errors.categoria && touched.categoria && (
                                                <div className="text-red-500 text-sm">{errors.categoria}</div>
                                            )}
                                            {/* Validación adicional para categoría */}
                                            {isCategoryNotSelected && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    Debe seleccionar una categoría para el producto.
                                                </p>
                                            )}
                                        </div>

                                        {/* Imagen */}
                                        <div>
                                            <label className="font-bold text-gray-600 pb-2 pt-4">Imagen del Producto</label>
                                            <p className="text-sm text-gray-500 pb-2">
                                                Formatos permitidos: .jpg, .jpeg, .png, .gif
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => setFieldValue("imagen", event.target.files[0])}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            {errors.imagen && touched.imagen && (
                                                <div className="text-red-500 text-sm">{errors.imagen}</div>
                                            )}
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
                                                Guardar Producto
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

            {/* Modal de Categorías */}
            {isCategoriaModalOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50"
                    onClick={closeModals}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-4/5"
                        onClick={(e) => e.stopPropagation()} // Evita cerrar la modal al hacer clic dentro
                    >
                        <h2 className="text-xl font-bold mb-4">Nueva Categoría</h2>
                        <Formik
                            initialValues={{
                                nombre_categoria: "",
                                descripcion_categoria: "",
                            }}
                            validationSchema={validationSchemaCategoria}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    const categoriaData = {
                                        nombre_categoria: values.nombre_categoria,
                                        descripcion_categoria: values.descripcion_categoria,
                                    };
                                    await postCategoria(categoriaData);
                                    setModalMessage("Categoría creada exitosamente");
                                    closeModals();
                                    onRefresh(); // Llamar a la función onRefresh para actualizar los datos globales
                                } catch (error) {
                                    console.error("Error al crear la categoría:", error.message);
                                    setModalMessage(error.message || "Error al crear la categoría. Por favor, inténtalo de nuevo.");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form className="space-y-4">
                                    <div>
                                        <label className="font-bold text-gray-600 pb-2">Nombre de la categoría</label>
                                        <Field
                                            name="nombre_categoria"
                                            type="text"
                                            className="ml-2 w-full outline-none cursor-text border-gray-500 border-2 rounded-xl px-3 py-2"
                                            placeholder="Nombre de la categoría"
                                        />
                                        {errors.nombre_categoria && touched.nombre_categoria && (
                                            <div className="text-red-500 text-sm">{errors.nombre_categoria}</div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="font-bold text-gray-600 py-2">Descripción</label>
                                        <Field
                                            name="descripcion_categoria"
                                            as="textarea"
                                            className="gap-4 w-full h-40 rounded-xl border-gray-500 border-2 outline-none px-3 py-2"
                                            placeholder="Escribe una descripción..."
                                        />
                                        {errors.descripcion_categoria && touched.descripcion_categoria && (
                                            <div className="text-red-500 text-sm">{errors.descripcion_categoria}</div>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                                        >
                                            Guardar Categoría
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
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </section>
    );
}