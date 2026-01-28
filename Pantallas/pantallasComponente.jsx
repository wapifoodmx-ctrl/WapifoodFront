import { useState, useEffect } from "react";
import { getProducts } from "@/useCases/getProducts";
import { getCategoria } from "@/useCases/getCategoria";
import crearListaProductos from "@/useCases/crearListaProductos";
import getListaProductos from "@/useCases/getListaProductos";
import actualizarListaProductos from "@/useCases/actualizarListaProductos";
import { IoEyeOutline } from "react-icons/io5";
import { GoChecklist } from "react-icons/go";
import { IoTrashOutline } from "react-icons/io5";
import ToastContainer, { toast } from "@/components/Toast";

export default function PantallasComponente() {
    const [products, setProducts] = useState([]);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('cards');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [categorySearchTerm, setSearchTerm] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [customList, setCustomList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showListModal, setShowListModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData, customListData] = await Promise.all([
                    getProducts(),
                    getCategoria(),
                    getListaProductos()
                ]);
                setProducts(productsData);
                setCategories(categoriesData || []);
                setCustomList(customListData || []);
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
        
        // Ocultar productos que ya están en la lista personalizada
        const notInCustomList = !customList.some(item => item.id_products === p.id_products);
        
        return selectedOk && availabilityOk && categoryOk && notInCustomList;
    });

    const filteredCategories = categories.filter(category =>
        category.nombre_categoria.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    const handleSaveList = async () => {
        const productIds = selectedList.map(item => item.id_products).filter(Boolean);
        if (productIds.length === 0) {
            toast.warning('No hay productos seleccionados para guardar');
            return;
        }
        try {
            const payload = {
                product_ids: productIds
            };
            
            await crearListaProductos(payload);
            
            // Actualizar la lista personalizada después de guardar
            const updatedList = await getListaProductos();
            setCustomList(updatedList || []);
            setIsEditing(false);
            
            toast.success('Lista guardada exitosamente');
        } catch (error) {
            toast.error(`Error al guardar la lista: ${error.message}`);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleRemoveFromList = async (productId) => {
        try {
            // Filtrar el producto a eliminar
            const remainingProductIds = customList
                .filter(item => item.id_products !== productId)
                .map(item => item.id_products);
            
            // Actualizar la lista en el servidor
            await actualizarListaProductos(remainingProductIds);
            
            // Actualizar la lista local
            const updatedList = await getListaProductos();
            setCustomList(updatedList || []);
            
            toast.success('Producto eliminado de la lista');
        } catch (error) {
            toast.error('Error al eliminar el producto de la lista');
        }
    };

    const handleDeleteList = async () => {
        try {
            // Enviar array con 0 para eliminar toda la lista
            await actualizarListaProductos([0]);
            
            // Limpiar la lista local
            setCustomList([]);
            setShowListModal(false);
            
            toast.success('Lista eliminada exitosamente');
        } catch (error) {
            toast.error('Error al eliminar la lista');
        }
    };

    const renderCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, idx) => (
                <div 
                    key={product.id_products ?? product.id ?? `${product.name}-${idx}`} 
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => toggleSelect(product)}
                >
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
                        {product.status !== 'activo' && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow">
                                    No Disponible
                                </div>
                            </div>
                        )}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 pointer-events-none"
                                checked={isSelected(product)}
                                readOnly
                            />
                        </div>
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-700 shadow-sm">
                            {product.nombre_categoria || 'Sin categoría'}
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
                            {product.status === 'activo' ? 'Disponible' : 'No disponible'}
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
                            <tr key={product.id_products ?? product.id ?? `${product.name}-${idx}`} className={`hover:bg-gray-50 transition-colors ${product.status !== 'activo' ? 'opacity-60' : ''}`}>
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
                                        <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                                            {getImageUrl(product) ? (
                                                <>
                                                    <img className="h-10 w-10 object-cover" src={getImageUrl(product)} alt="" />
                                                    {product.status !== 'activo' && (
                                                        <div className="absolute inset-0 bg-black/60"></div>
                                                    )}
                                                </>
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
                                        {product.status === 'activo' ? 'Disponible' : 'No disponible'}
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
        <div className="h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-y-auto">
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
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <button
                                        onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                                    >
                                        <IoEyeOutline className="text-lg sm:text-xl" />
                                        <span className="hidden sm:inline">{viewMode === 'cards' ? 'Ver Lista' : 'Ver Tarjetas'}</span>
                                        <span className="sm:hidden">{viewMode === 'cards' ? 'Lista' : 'Tarjetas'}</span>
                                    </button>
                                    {customList.length > 0 && (
                                        <button
                                            onClick={() => setShowListModal(true)}
                                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                                        >
                                            <GoChecklist className="text-lg sm:text-xl" />
                                            <span className="hidden sm:inline">Ver lista ({customList.length})</span>
                                            <span className="sm:hidden">Lista ({customList.length})</span>
                                        </button>
                                    )}
                                    <label className="inline-flex items-center gap-2 px-2 sm:px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            checked={availableOnly}
                                            onChange={(e) => setAvailableOnly(e.target.checked)}
                                        />
                                        <span className="text-gray-700 hidden sm:inline">Solo disponibles</span>
                                        <span className="text-gray-700 sm:hidden">Disponibles</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2 px-2 sm:px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            checked={showSelectedOnly}
                                            onChange={(e) => setShowSelectedOnly(e.target.checked)}
                                        />
                                        <span className="text-gray-700 hidden sm:inline">Solo seleccionados</span>
                                        <span className="text-gray-700 sm:hidden">Seleccionados</span>
                                    </label>
                                    <button
                                        onClick={handleSaveList}
                                        className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:bg-green-700 text-sm sm:text-base"
                                    >
                                        <span className="hidden sm:inline">Guardar lista</span>
                                        <span className="sm:hidden">Guardar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Dropdown de categorías con buscador */}
                        <div className="mb-8 relative">
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-semibold text-gray-700">Categoría:</label>
                                <div className="relative w-full max-w-md">
                                    <button
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-gray-700 font-medium">{selectedCategory}</span>
                                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showCategoryDropdown && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-10" 
                                                onClick={() => setShowCategoryDropdown(false)}
                                            />
                                            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-96 overflow-hidden">
                                                <div className="p-3 border-b border-gray-200">
                                                    <input
                                                        type="text"
                                                        placeholder="Buscar categoría..."
                                                        value={categorySearchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCategory('Todos');
                                                            setShowCategoryDropdown(false);
                                                            setSearchTerm('');
                                                        }}
                                                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${selectedCategory === 'Todos' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'}`}
                                                    >
                                                        Todos
                                                    </button>
                                                    {filteredCategories.map((category) => (
                                                        <button
                                                            key={category.id_categoria || category.nombre_categoria}
                                                            onClick={() => {
                                                                setSelectedCategory(category.nombre_categoria);
                                                                setShowCategoryDropdown(false);
                                                                setSearchTerm('');
                                                            }}
                                                            className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${selectedCategory === category.nombre_categoria ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'}`}
                                                        >
                                                            {category.nombre_categoria}
                                                        </button>
                                                    ))}
                                                    {filteredCategories.length === 0 && (
                                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                            No se encontraron categorías
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                       
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

            {/* Modal de lista de productos seleccionados */}
            {showListModal && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowListModal(false)}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del modal */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <GoChecklist className="text-2xl sm:text-3xl" />
                                    <div>
                                        <h2 className="text-lg sm:text-2xl font-bold">Lista de productos para pantallas</h2>
                                        <p className="text-green-100 text-xs sm:text-sm mt-1">{customList.length} producto{customList.length !== 1 ? 's' : ''} en la lista</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowListModal(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Contenido del modal */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                {customList.map((item) => (
                                    <div 
                                        key={getProductKey(item)} 
                                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex gap-3 sm:gap-4">
                                            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                                <img 
                                                    src={getImageUrl(item)} 
                                                    alt={item.name} 
                                                    className="h-full w-full object-cover" 
                                                />
                                                {item.status !== 'activo' && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                                            No Disponible
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 line-clamp-1">{item.name}</h3>
                                                <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs text-gray-500">{item.nombre_categoria || 'Sin categoría'}</span>
                                                        <span className="text-base sm:text-lg font-bold text-green-600">${parseFloat(item.price).toFixed(2)}</span>
                                                    </div>
                                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${item.status === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {item.status === 'activo' ? 'Disponible' : 'No disponible'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFromList(item.id_products)}
                                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                                        >
                                            <IoTrashOutline className="w-4 h-4" />
                                            Quitar de la lista
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer del modal */}
                        <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                <button
                                    onClick={handleDeleteList}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
                                >
                                    <IoTrashOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Eliminar lista
                                </button>
                                <button
                                    onClick={() => setShowListModal(false)}
                                    className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:bg-green-700 text-sm sm:text-base"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}