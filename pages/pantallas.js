import Head from "next/head";
import Navbar from "@/dashboardComponents/navbar";
import { useState, useEffect } from "react";
import { getProducts } from "@/useCases/getProducts";
import { getCategoria } from "@/useCases/getCategoria";
import { addToCustomList } from "@/useCases/CreateListPantallas";
import { IoEyeOutline } from "react-icons/io5";

export default function Pantallas() {
    const [products, setProducts] = useState([]);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategoria()
                ]);
                setProducts(productsData);
                setCategories(categoriesData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getImageUrl = (product) => {
        const raw = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;
        if (!raw) return "/Default.png";
        const cleaned = String(raw).replace(/[`'"]/g, "").trim();
        return cleaned || "/Default.png";
    };
    const getProductKey = (product) => product.id_products ?? product.id ?? product.name;
    const isSelected = (product) => selectedKeys.includes(getProductKey(product));
    const toggleSelect = (product) => {
        const key = getProductKey(product);
        setSelectedKeys((prev) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };
    const clearSelection = () => setSelectedKeys([]);
    const selectedList = selectedKeys.map((key) => products.find((p) => getProductKey(p) === key)).filter(Boolean);

    const filteredProducts = products.filter(p => {
        const key = getProductKey(p);
        const selectedOk = !showSelectedOnly || selectedKeys.includes(key);
        const availabilityOk = !availableOnly || p.status === 'activo';
        const categoryOk = selectedCategory === 'Todos' || p.category_name === selectedCategory;
        return selectedOk && availabilityOk && categoryOk;
    });

    const handleSaveList = async () => {
        const productIds = selectedList.map(item => item.id_products).filter(Boolean);
        if (productIds.length === 0) {
            alert('No hay productos seleccionados para guardar');
            return;
        }
        try {
            await addToCustomList(productIds);
            alert('Lista guardada exitosamente');
        } catch (error) {
            alert(`Error al guardar la lista: ${error.message}`);
        }
    };

    const renderCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
                <div key={product.id_products ?? product.id ?? `${product.name}-${idx}`} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden relative group">
                        {getImageUrl(product) ? (
                            <img
                                src={getImageUrl(product)}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                checked={isSelected(product)}
                                onChange={() => toggleSelect(product)}
                            />
                        </div>
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 shadow-sm">
                            {product.category_name || 'Sin categoría'}
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1" title={product.name}>
                        {product.name}
                    </h3>
                    
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                        {product.description || 'Sin descripción disponible'}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <span className="text-2xl font-bold text-green-600">
                            ${parseFloat(product.price).toFixed(2)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.status === 'activo' ? 'Disponible' : 'Agotado'}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderList = () => (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Seleccionar</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product, idx) => (
                            <tr key={product.id_products ?? product.id ?? `${product.name}-${idx}`} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        checked={isSelected(product)}
                                        onChange={() => toggleSelect(product)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            {getImageUrl(product) ? (
                                                <img className="h-10 w-10 object-cover" src={getImageUrl(product)} alt="" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">{product.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {product.category_name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    ${parseFloat(product.price).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.status === 'activo' ? 'Disponible' : 'Agotado'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <>
            <Head>
                <title>Pantallas - WapiFood</title>
                <meta name="description" content="Gestión de pantallas" />
            </Head>

            <div className="h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-y-auto">
                {/* Navbar fijo */}
                <Navbar />

                {/* Contenido principal */}
                <main className="w-full min-h-screen flex flex-col pt-16">
                    {/* Fondo decorativo */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                        <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                        <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
                    </div>

                    <div className="relative z-10 flex-1 animate-fade-in-up">
                        {/* Header de la sección */}
                        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm sticky top-16 z-20">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-800">Pantallas</h1>
                                            <p className="text-gray-600 mt-1">Visualización de productos para el cliente</p>
                                        </div>
                                    </div>

                                    {/* Controles */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <IoEyeOutline className="text-xl" />
                                            <span>{viewMode === 'cards' ? 'Ver Lista' : 'Ver Tarjetas'}</span>
                                        </button>
                                        <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                checked={availableOnly}
                                                onChange={(e) => setAvailableOnly(e.target.checked)}
                                            />
                                            <span className="text-sm text-gray-700">Solo disponibles</span>
                                        </label>
                                        <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                checked={showSelectedOnly}
                                                onChange={(e) => setShowSelectedOnly(e.target.checked)}
                                            />
                                            <span className="text-sm text-gray-700">Solo seleccionados</span>
                                        </label>
                                        <button
                                            onClick={handleSaveList}
                                            className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            Guardar lista
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="mb-8 flex overflow-x-auto pb-4 gap-3 no-scrollbar">
                                <button
                                    onClick={() => setSelectedCategory('Todos')}
                                    className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200 font-medium ${selectedCategory === 'Todos' ? 'bg-green-500 text-white shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                                >
                                    Todos
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id_categoria || category.nombre_categoria}
                                        onClick={() => setSelectedCategory(category.nombre_categoria)}
                                        className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200 font-medium ${selectedCategory === category.nombre_categoria ? 'bg-green-500 text-white shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                                    >
                                        {category.nombre_categoria}
                                    </button>
                                ))}
                            </div>
                            {selectedList.length > 0 && (
                                <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-gray-700">Lista de productos seleccionados ({selectedList.length})</p>
                                        <button
                                            onClick={clearSelection}
                                            className="text-sm px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                                        >
                                            Vaciar lista
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedList.map((item) => (
                                            <div key={getProductKey(item)} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-md overflow-hidden bg-gray-100">
                                                        <img src={getImageUrl(item)} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                                        <p className="text-xs text-gray-500">${parseFloat(item.price).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleSelect(item)}
                                                    className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                viewMode === 'cards' ? renderCards() : renderList()
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-900">No hay productos disponibles</h3>
                                    <p className="text-gray-500 mt-2">
                                        {selectedCategory === 'Todos' 
                                            ? 'No se encontraron productos para mostrar en este momento.'
                                            : `No hay productos en la categoría "${selectedCategory}".`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }
            `}</style>
        </>
    );
}
