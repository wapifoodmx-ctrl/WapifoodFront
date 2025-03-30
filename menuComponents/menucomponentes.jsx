import { MdOutlineAttachMoney } from "react-icons/md";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";
import { BsTag } from "react-icons/bs";
import { Formik, Form, Field } from "formik";

export default function MenuComponentes() {
    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);

    const closeModals = () => {
        setIsProductoModalOpen(false);
        setIsCategoriaModalOpen(false);
    };

    return (
        <section className="lg:flex my-4 lg:gap-4 lg:justify-between lg:items-center">
            {/* Barra de búsqueda */}
            <div className="flex py-1 px-3 rounded-xl border-gray-500 border-2 mb-4 lg:mb-0 lg:w-6/12 justify-center items-center">
                <HiOutlineMagnifyingGlass className="text-xl" />
                <input type="text" placeholder="Buscar..." className="ml-2 w-full outline-none" />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                {/* Dropdowns */}
                <div className="flex gap-4">
                    {/* Dropdown Categorías */}
                    <div className="relative">
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <BsTag className="text-2xl" />
                            <select id="categorias" className="w-full outline-none bg-transparent">
                                <option value="" disabled selected>
                                    Categorías
                                </option>
                                <option value="todas">Todas</option>
                                <option value="entradas">Entradas</option>
                                <option value="platos-principales">Platos principales</option>
                                <option value="postres">Postres</option>
                                <option value="bebidas">Bebidas</option>
                                <option value="combos">Combos</option>
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
                                disponible: false,
                            }}
                            onSubmit={(values) => {
                                alert(JSON.stringify(values, null, 2)); // Muestra los valores en una alerta
                                closeModals(); // Cierra la modal
                            }}
                        >
                            {({ setFieldValue }) => (
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
                                            <option value="entradas">Entradas</option>
                                            <option value="platos-principales">Platos principales</option>
                                            <option value="postres">Postres</option>
                                            <option value="bebidas">Bebidas</option>
                                            <option value="combos">Combos</option>
                                        </Field>
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
                                    </div>

                                    {/* Disponible */}
                                    <div className="flex items-center py-4">
                                        <Field
                                            name="disponible"
                                            type="checkbox"
                                            className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400"
                                        />
                                        <label className="ml-2 text-gray-700">Producto disponible</label>
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
                            }}
                            onSubmit={(values) => {
                                alert(`Nueva categoría: ${values.categoria}`); // Muestra la categoría en una alerta
                                closeModals(); // Cierra la modal
                            }}
                        >
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
                                </div>
                                <div>
                                        <label className="font-bold text-gray-600 py-2">Descripción</label>
                                        <Field
                                            name="descripcion"
                                            as="textarea"
                                            className="gap-4 w-full h-40 rounded-xl border-gray-500 border-2 outline-none px-3 py-2"
                                            placeholder="Escribe una descripción..."
                                        />
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
                        </Formik>
                    </div>
                </div>
            )}
        </section>
    );
}