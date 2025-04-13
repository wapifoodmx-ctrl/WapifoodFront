import { useState, useEffect } from "react";
import Image from "next/image";
import kime from "@/pages/assets/img/kime.jpeg";
import { FiEdit } from "react-icons/fi";
import { Formik, Form, Field } from "formik";
import { getProducts } from "@/useCases/getProducts";

export default function Cards({ searchTerm }) { // Recibir searchTerm como prop
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar la modal
    const [products, setProducts] = useState([]); // Estado para almacenar los productos obtenidos
    const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para editar
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado para manejar errores

    // Función para obtener los productos al cargar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data); // Establece los productos obtenidos
            } catch (err) {
                setError(err.message); // Maneja errores
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchProducts();
    }, []);

    // Filtrar los productos basados en el término de búsqueda
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar por nombre
    );

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
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
            {filteredProducts.map((product) => (
                <section
                    key={product.id_products}
                    className="rounded-t-2xl shadow flex justify-center items-center flex-col w-full md:w-4/10 lg:w-3/10  "
                >
                    <div className="w-full h-48">
                        <Image
                            src={product.image_url|| kime} // Usa la imagen del producto o una predeterminada
                            alt={product.name}
                            className="rounded-t-2xl w-full h-full object-cover"
                            width={300}
                            height={200}
                        />
                    </div>

                    <div className="flex w-full p-4 justify-between items-center">
                        <h3 className="font-bold text-2xl">{product.name}</h3>
                        <p className="text-2xl text-green-500 font-bold">${product.price}</p>
                    </div>

                    <div className="w-full px-4">
                        <p className="text-gray-500">{product.description}</p>
                    </div>
                    <div className="w-full p-4 flex justify-between items-center">
                        <p className="bg-green-300 rounded-2xl px-6 py-1 text-xl">{"Categoría :D!"}</p>
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
                                image: selectedProduct.image,
                                disponible: selectedProduct.disponible || false, // Asegúrate de que tenga un valor booleano
                            }}
                            onSubmit={(values) => {
                                handleUpdateProduct(values); // Actualiza el producto
                                console.log(values);
                            }}
                        >
                            {({ setFieldValue }) => (
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
                                            onChange={(event) => setFieldValue("image", event.target.files[0])}
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
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
}