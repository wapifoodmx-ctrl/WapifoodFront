import { MdOutlineAttachMoney } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";
import { BsTag } from "react-icons/bs";
import { Formik, Form, Field } from "formik";
import { createProduct } from "../useCases/createProduct"; // Import the function
import { getProducts } from "@/useCases/getProducts"; // Importar getProducts
import { getCategoria } from "../useCases/getCategoria"; // Importar la función
import * as Yup from "yup"; // Importar Yup

export default function MenuComponentes({ onSearch, onCategoryChange }) { // Añadir onCategoryChange como prop
    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
    const [categories, setCategories] = useState([]); // Estado para las categorías
    const [modalCategories, setModalCategories] = useState([]); // Categorías para la modal de productos

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const products = await getProducts();
                const uniqueCategories = [
                    ...new Map(
                        products.map((product) => [
                            product.category_id,
                            { id: product.category_id, name: product.category_name },
                        ])
                    ).values(),
                ];
                setCategories(uniqueCategories); // Establecer categorías únicas
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };

        const fetchModalCategories = async () => {
            try {
                const categorias = await getCategoria(); // Llamar a la API
                const formattedCategories = categorias.map((cat) => ({
                    id: cat.id_categoria,
                    name: cat.nombre_categoria,
                }));
                setModalCategories(formattedCategories); // Guardar las categorías en el estado
            } catch (error) {
                console.error("Error al obtener categorías para la modal:", error);
            }
        };

        fetchCategories();
        fetchModalCategories(); // Llamar a la función para obtener categorías dinámicas
    }, []);

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
        categoria: Yup.string().required("El nombre de la categoría es obligatorio"),
        descripcion: Yup.string().required("La descripción es obligatoria"),
    });

    return (
        <section className="lg:flex my-4 lg:gap-4 lg:justify-between lg:items-center">
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
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Dropdown Disponibilidad */}
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <FiFilter className="text-2xl" />
                            <select id="disponibilidad" className="w-full outline-none bg-transparent">
                                <option value="" disabled selected>
                                    Disponibilidad
                                </option>
                                <option value="todas">Todas</option>
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
                                        price: values.precio, // Convertir a string
                                        category_id: values.categoria, // Convertir a string
                                    };
                                    await createProduct(productData, values.imagen); // Call the function
                                    alert("Producto creado exitosamente");
                                    closeModals();
                                } catch (error) {
                                    console.error("Error al crear el producto:", error);
                                    alert("Error al crear el producto. Por favor, inténtalo de nuevo.");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ setFieldValue, errors, touched }) => (
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
                                            {modalCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {errors.categoria && touched.categoria && (
                                            <div className="text-red-500 text-sm">{errors.categoria}</div>
                                        )}
                                    </div>

                                    {/* Imagen */}
                                    <div>
                                        <label className="font-bold text-gray-600 pb-2 pt-4">Imagen del Producto</label>
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
                                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
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
                            )}
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
                                categoria: "",
                                descripcion: "",
                            }}
                            validationSchema={validationSchemaCategoria} // Añadir validación
                            onSubmit={(values) => {
                                alert(`Nueva categoría: ${values.categoria}`); // Muestra la categoría en una alerta
                                closeModals(); // Cierra la modal
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form className="space-y-4">
                                    {/* Nombre de la categoría */}
                                    <div>
                                        <label className="font-bold text-gray-600 pb-2">Nombre de la categoría</label>
                                        <Field
                                            name="categoria"
                                            type="text"
                                            className="ml-2 w-full outline-none cursor-text border-gray-500 border-2 rounded-xl px-3 py-2"
                                            placeholder="Nombre de la categoría"
                                        />
                                        {errors.categoria && touched.categoria && (
                                            <div className="text-red-500 text-sm">{errors.categoria}</div>
                                        )}
                                    </div>
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
                                    </div>

                                    {/* Botones */}
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