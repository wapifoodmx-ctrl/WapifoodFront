import React, { useState, useEffect } from "react";
import { getProducts } from "@/useCases/getProducts"; // Importa la función getProducts
import Image from "next/image";
import { GoChecklist } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";

export default function MenuCliente() {
    const [productos, setProductos] = useState([]); // Estado para almacenar los productos obtenidos
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos los platillos");
    const [isOpen, setIsOpen] = useState(false);
    const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías dinámicas

    useEffect(() => {
        // Llama a getProducts y maneja los datos
        const fetchProducts = async () => {
            try {
                const productosObtenidos = await getProducts();
                console.log("Productos obtenidos:", productosObtenidos); // Imprime los productos en la consola
                setProductos(productosObtenidos); // Actualiza el estado con los productos obtenidos

                // Extraer categorías únicas
                const categoriasUnicas = [
                    ...new Set(productosObtenidos.map((producto) => producto.category_name)),
                ];
                setCategorias(categoriasUnicas); // Actualiza el estado con las categorías únicas
            } catch (error) {
                console.error("Error al obtener los productos:", error.message);
            }
        };

        fetchProducts();
    }, []); // Se ejecuta al montar el componente

    // Filtrar productos por categoría seleccionada
    const productosFiltrados =
        categoriaSeleccionada === "Todos los platillos"
            ? productos.filter((producto) => producto.status !== "inactivo") // Excluir productos inactivos
            : productos.filter(
                  (producto) =>
                      producto.category_name === categoriaSeleccionada &&
                      producto.status !== "inactivo" // Excluir productos inactivos
              );

    return (
        <section>
            <header>
                <nav className="w-full bg-gray-100 text-gray-800 p-4">
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <GoChecklist size={36} className="text-green-600" />
                            <h1 className="text-3xl font-bold ml-2">WapiFood</h1>
                        </div>

                        {/* Botón del menú hamburguesa */}
                        <button
                            className="z-20 cursor-pointer py-3 hamburger-button"
                            onClick={() => setIsOpen(!isOpen)} // Toggle menu on click
                            aria-label="Toggle menu"
                        >
                            <div
                                className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${
                                    isOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                            ></div>
                            <div
                                className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${
                                    isOpen ? "opacity-0" : ""
                                }`}
                            ></div>
                            <div
                                className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                                    isOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                            ></div>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Menú desplegable */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg 
                    transition-transform duration-300 ease-in-out menu-container
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <ul className="flex flex-col mt-16 p-4 text-xl overflow-y-auto max-h-screen">
                    <p className="text-gray-500 font-bold">Menú principal</p>
                    <li
                        className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                        onClick={() => {
                            setCategoriaSeleccionada("Todos los platillos");
                            setIsOpen(false);
                        }}
                    >
                        <IoHomeOutline className="self-center" /> Todos los platillos
                    </li>
                    {categorias.map((categoria) => (
                        <li
                            key={categoria}
                            className="flex hover:bg-gray-200 p-2 rounded cursor-pointer gap-2"
                            onClick={() => {
                                setCategoriaSeleccionada(categoria);
                                setIsOpen(false);
                            }}
                        >
                            <span className="self-center">{categoria}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Card Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto my-8 w-11/12">
                {productosFiltrados.map((producto) => (
                    <div
                        key={producto.id_products}
                        className="rounded-lg shadow-lg flex flex-col bg-white"
                    >
                        <div className="w-full h-48">
                            <Image
                                src={producto.image_url[0]} // Usa la primera imagen del array
                                alt={`Imagen de ${producto.name}`}
                                className="rounded-t-lg w-full h-full object-cover"
                                width={300}
                                height={200}
                            />
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-xl">{producto.name}</h3>
                                <p className="text-xl text-green-500 font-bold">
                                    ${parseFloat(producto.price).toFixed(2)}
                                </p>
                            </div>
                            <p className="text-gray-500 mb-4 line-clamp-2 min-h-[3rem]">
                                {producto.description.length > 80
                                    ? `${producto.description.slice(0, 80)}...`
                                    : producto.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <p className="bg-green-300 text-green-800 rounded-full px-4 py-1 text-sm">
                                    {producto.category_name}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </section>
    );
}