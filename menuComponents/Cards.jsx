import { useState, useEffect } from "react";
import Image from "next/image";
import kime from "@/pages/assets/img/kime.jpeg";
import { FiEdit, FiEye } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { Formik, Form, Field } from "formik";
import { updateProduct } from "../useCases/updateProduct";
import { deleteProduct } from "../useCases/deleteProduct";
import { postInventarioIngredientes } from "../useCases/postInventarioIngredientes";
import { postRecetas } from "../useCases/postRecetas";
import { getRecetas } from "../useCases/getRecetas";
import putEditarIngrediente from "../useCases/putEditarIngrediente";
import ModalMessage from "../components/ModalMessage";

export default function Cards({ products, searchTerm, selectedCategory, categories, onRefresh, availabilityFilter }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalMessage, setModalMessage] = useState(null);
    const [isLoadingInventory, setIsLoadingInventory] = useState(false);
    const [tempInventoryData, setTempInventoryData] = useState(null);
    const [currentProductName, setCurrentProductName] = useState("");
    const [inventoryFormData, setInventoryFormData] = useState({
        cantidad: "",
        costo: "",
        comentarios: ""
    });
    const [existingRecipes, setExistingRecipes] = useState([]);
    const [loadingRecipes, setLoadingRecipes] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipes = await getRecetas();
                setExistingRecipes(recipes);
            } catch (error) {
                console.error('Error al cargar recetas:', error);
            } finally {
                setLoadingRecipes(false);
            }
        };
        fetchRecipes();
    }, []);

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const closeModals = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setIsInventoryModalOpen(false);
        setSelectedProduct(null);
        setTempInventoryData(null);
        setCurrentProductName("");
        setInventoryFormData({
            cantidad: "",
            costo: "",
            comentarios: ""
        });
    };

    const handleInventoryInputChange = (e) => {
        const { name, value } = e.target;
        setInventoryFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddToInventory = (e) => {
        e.preventDefault();
        
        if (!inventoryFormData.cantidad || !inventoryFormData.costo) {
            setModalMessage("Por favor completa todos los campos obligatorios");
            return;
        }

        // Guardar datos en estado temporal
        setTempInventoryData({
            cantidad: parseFloat(inventoryFormData.cantidad),
            costo: parseFloat(inventoryFormData.costo),
            comentarios: inventoryFormData.comentarios
        });

        setIsInventoryModalOpen(false);
        setInventoryFormData({
            cantidad: "",
            costo: "",
            comentarios: ""
        });
        
        setModalMessage("Datos del inventario guardados. Presiona 'Guardar' para confirmar.");
    };

    const cancelInventoryModal = () => {
        setIsInventoryModalOpen(false);
        setInventoryFormData({
            cantidad: "",
            costo: "",
            comentarios: ""
        });
        setTempInventoryData(null);
    };

    // Verificar si un producto tiene receta existente
    const productHasRecipe = (productId) => {
        return existingRecipes.some(recipe => 
            recipe.product_id === productId && 
            recipe.name.startsWith('recipeStatusNoDisplay.')
        );
    };

    const handleUpdateProduct = async (values, imageFile) => {
        try {
            await updateProduct(values.id_products, values, imageFile);

            const productId = values.id_products;
            const productName = values.name;
            let ingredientId = null;

            // Buscar si el producto tiene una receta de inventario (recipeStatusNoDisplay)
            const recetaInventario = existingRecipes.find(receta => 
                receta.product_id === productId && 
                receta.name.startsWith('recipeStatusNoDisplay.')
            );

            // Si existe una receta de inventario, actualizar el nombre del ingrediente
            if (recetaInventario && recetaInventario.ingredients && recetaInventario.ingredients.length > 0) {
                const ingrediente = recetaInventario.ingredients[0];
                const ingredienteId = ingrediente.id_ingredient;
                
                try {
                    // Obtener los datos completos del ingrediente primero
                    const { getIngredienteById } = await import("../useCases/getIngredienteId");
                    const ingredienteResult = await getIngredienteById(ingredienteId);
                    
                    if (ingredienteResult.success && ingredienteResult.data) {
                        const ingredienteData = ingredienteResult.data;
                        
                        // Actualizar el nombre del ingrediente en el inventario manteniendo los demás datos
                        await putEditarIngrediente(ingredienteId, {
                            name: productName,
                            description: ingredienteData.description || `Producto: ${productName}`,
                            cost: ingredienteData.cost || 0,
                            stock: ingredienteData.stock || 0,
                            unit: ingredienteData.unit || "Pieza",
                            category: ingredienteData.category || 'producto',
                            confirmation_code: '0000' // Código por defecto para actualización automática
                        });
                    }
                } catch (error) {
                    console.error('❌ Error al actualizar ingrediente:', error);
                    // No detener el flujo si falla la actualización del ingrediente
                }
            }

            // Si hay datos temporales de inventario, crear el ingrediente
            if (tempInventoryData && values.agregarInventario) {
                const ingredientData = {
                    name: productName,
                    description: tempInventoryData.comentarios || `Producto: ${productName}`,
                    cost: tempInventoryData.costo,
                    stock: tempInventoryData.cantidad,
                    unit: "Pieza",
                    category: 'producto'
                };

                const result = await postInventarioIngredientes(ingredientData);
                
                if (!result.success) {
                    throw new Error(result.error || 'Error al agregar al inventario');
                }

                ingredientId = result.data?.id_ingredient;

                // Crear receta automática oculta si no existe
                if (ingredientId && !productHasRecipe(productId)) {
                    const recipeData = {
                        name: `recipeStatusNoDisplay.${productName}`,
                        product_id: productId,
                        ingredients: [
                            {
                                ingredient_id: ingredientId,
                                quantity: 1
                            }
                        ]
                    };

                    await postRecetas(recipeData);
                }
            }

            // Si se marca "Agregar receta" (sin inventario)
            if (values.agregarReceta && !values.agregarInventario) {
            }

            const successMessage = tempInventoryData && values.agregarInventario
                ? "Producto actualizado, agregado al inventario y receta automática creada exitosamente"
                : values.agregarReceta
                ? "Producto actualizado y agregado a receta"
                : "Producto actualizado exitosamente";

            setModalMessage(successMessage);
            
            closeModals();
            if (onRefresh) {
                await onRefresh();
            }
        } catch (err) {
            console.error("Error al actualizar el producto:", err.message);
            setModalMessage(err.message || "Hubo un error al actualizar el producto.");
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(selectedProduct.id_products);
            // console.log(`Producto eliminado con ID: ${selectedProduct.id_products}`);
            
            setModalMessage("Producto eliminado con éxito.");
            closeModals();
            if (onRefresh) {
                onRefresh();
            }
        } catch (err) {
            console.error("Error al eliminar el producto:", err.message);
            setModalMessage(err.message || "Hubo un error al eliminar el producto.");
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "" || product.category_id === parseInt(selectedCategory);
        const matchesAvailability =
            availabilityFilter === "todos" ||
            (availabilityFilter === "disponibles" && product.status === "activo") ||
            (availabilityFilter === "no-disponibles" && product.status === "inactivo");

        return matchesSearchTerm && matchesCategory && matchesAvailability;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-64">
                {/* Spinner de carga elegante con colores verdes */}
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-emerald-400 rounded-full animate-spin mx-auto"></div>
                    </div>
                    <p className="text-green-600 text-xl font-semibold">Cargando productos...</p>
                    <p className="text-green-500 text-sm mt-1">Preparando tu inventario</p>
                </div>
            </div>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <div className="flex justify-center items-center w-full h-64">
                <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiEye className="text-white text-2xl" />
                    </div>
                    <p className="text-green-800 text-xl font-bold mb-2">
                        No se encontraron productos
                    </p>
                    <p className="text-green-600 text-sm">
                        Intenta ajustar los filtros de búsqueda
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-8 justify-center w-full">
            {/* Modal de mensaje */}
            {modalMessage && (
                <ModalMessage
                    message={modalMessage}
                    onClose={() => setModalMessage(null)}
                />
            )}

            {filteredProducts.map((product) => (
                <section
                    key={product.id_products}
                    className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col w-full md:w-4/10 lg:w-3/10 border border-gray-100 overflow-hidden group"
                >
                    {/* Contenedor de imagen con overlay en hover */}
                    <div className="relative w-full h-48 overflow-hidden">
                        <Image
                            src={product.image_url?.[0] || kime}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            width={300}
                            height={200}
                        />
                        
                        {/* Overlay de estado */}
                        {product.status === "inactivo" && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center backdrop-blur-sm">
                                <div className="text-center">
                                    <IoCloseCircle className="text-red-400 text-4xl mx-auto mb-2" />
                                    <p className="text-white text-lg font-bold transform rotate-[-10deg]">
                                        No visible en el menú
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Badge de estado activo */}
                        {product.status === "activo" && (
                            <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                <IoCheckmarkCircle className="text-sm" />
                                Disponible
                            </div>
                        )}

                        {/* Gradiente en la parte inferior */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="flex-1 p-6 space-y-4">
                        {/* Header con nombre y precio */}
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-800 leading-tight">
                                <span className="xl:hidden hidden md:block text-lg">
                                    {truncateText(product.name, 12)}
                                </span>
                                <span className="xl:block md:hidden text-xl">
                                    {truncateText(product.name, 18)}
                                </span>
                            </h3>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">
                                    ${parseFloat(product.price).toLocaleString("en-US", { 
                                        minimumFractionDigits: 2, 
                                        maximumFractionDigits: 2 
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Descripción */}
                        <p className="text-gray-600 text-sm leading-relaxed min-h-[2.5rem]">
                            {truncateText(product.description, 85)}
                        </p>

                        {/* Footer con categoría y acciones */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                                {product.category_name}
                            </span>
                            
                            {/* Botones de acción */}
                            <div className="flex gap-2">
                                <button
                                    className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setIsEditModalOpen(true);
                                    }}
                                    title="Editar producto"
                            >
                                <FiEdit size={16} />
                            </button>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* Modal de Eliminar Producto con diseño mejorado */}
            {isDeleteModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-10"
                    onClick={closeModals}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del modal */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-2xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BsTrash3 className="text-white text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Eliminar Producto</h3>
                            </div>
                        </div>
                        
                        {/* Contenido */}
                        <div className="p-6">
                            <p className="text-gray-600 text-center mb-6 leading-relaxed">
                                ¿Estás seguro de que quieres eliminar el producto 
                                <span className="font-bold text-gray-800 block mt-1">"{selectedProduct.name}"</span>
                                Esta acción no se puede deshacer.
                            </p>
                            
                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                    onClick={handleDeleteProduct}
                                >
                                    Sí, eliminar
                                </button>
                                <button
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
                                    onClick={closeModals}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Editar Producto con diseño mejorado y más compacto */}
            {isEditModalOpen && selectedProduct && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={closeModals}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-green-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header del modal más compacto */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <FiEdit className="text-white text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Editar Producto</h2>
                                    <p className="text-green-100 text-xs">Actualiza la información del producto</p>
                                </div>
                            </div>
                        </div>

                        {/* Contenido del formulario más compacto */}
                        <div className="p-4">
                            <Formik
                                initialValues={{
                                    id_products: selectedProduct.id_products,
                                    name: selectedProduct.name,
                                    description: selectedProduct.description,
                                    price: selectedProduct.price,
                                    category_id: selectedProduct.category_id,
                                    image: null,
                                    status: selectedProduct.status,
                                    agregarInventario: false,
                                    agregarReceta: false,
                                }}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        // Actualizar el producto usando la función que ya maneja el inventario
                                        await handleUpdateProduct(values, values.image);
                                    } catch (error) {
                                        console.error("Error:", error);
                                        setModalMessage(error.message || "Error al procesar la operación");
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ setFieldValue, values }) => {
                                    const isDescriptionTooLong = values.description && values.description.length > 500;
                                    const isCategoryNotSelected = !values.category_id || values.category_id === "";
                                    const isFormInvalid = isDescriptionTooLong || isCategoryNotSelected;

                                    return (
                                        <Form className="space-y-4">
                                            {/* Nombre del producto */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                    Nombre del producto
                                                </label>
                                                <Field
                                                    name="name"
                                                    type="text"
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                                    placeholder="Nombre del producto"
                                                />
                                            </div>

                                            {/* Descripción */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                    Descripción
                                                </label>
                                                <Field
                                                    name="description"
                                                    as="textarea"
                                                    rows="3"
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                                                    placeholder="Describe tu producto..."
                                                />
                                                <div className="flex justify-between items-center mt-1">
                                                    <div>
                                                        {isDescriptionTooLong && (
                                                            <p className="text-red-500 text-xs flex items-center gap-1">
                                                                <IoCloseCircle />
                                                                Máximo 500 caracteres
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className={`text-xs ${
                                                        values.description?.length > 500 ? 'text-red-500' : 'text-gray-400'
                                                    }`}>
                                                        {values.description?.length || 0}/500
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Checkboxes condicionales de Inventario y Receta */}
                                            <div>
                                                {(() => {
                                                    const hasRecipe = productHasRecipe(selectedProduct.id_products);
                                                    
                                                    if (hasRecipe) {
                                                        // Producto YA tiene receta: solo mostrar checkbox de inventario bloqueado
                                                        return (
                                                            <label className="flex items-center gap-2 cursor-not-allowed group opacity-60">
                                                                <div className="relative">
                                                                    <Field
                                                                        type="checkbox"
                                                                        name="agregarInventario"
                                                                        disabled={true}
                                                                        checked={true}
                                                                        className="w-5 h-5 border-2 border-gray-300 rounded cursor-not-allowed checked:bg-green-500 checked:border-green-500 transition-all duration-200"
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-500">
                                                                    Agregar a inventario (Ya existe en inventario)
                                                                </span>
                                                            </label>
                                                        );
                                                    } else {
                                                        // Producto NO tiene receta: mostrar ambos checkboxes
                                                        return (
                                                            <div className="flex gap-4">
                                                                <label 
                                                                    className="flex items-center gap-2 cursor-pointer group"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        const newValue = !values.agregarInventario;
                                                                        setFieldValue("agregarInventario", newValue);
                                                                        
                                                                        if (newValue) {
                                                                            // Desmarcar receta si se marca inventario
                                                                            setFieldValue("agregarReceta", false);
                                                                            setCurrentProductName(selectedProduct.name);
                                                                            setIsInventoryModalOpen(true);
                                                                        } else {
                                                                            // Si desmarca, limpiar datos temporales
                                                                            setTempInventoryData(null);
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="relative">
                                                                        <Field
                                                                            type="checkbox"
                                                                            name="agregarInventario"
                                                                            className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 pointer-events-none"
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                                                                        Agregar a inventario
                                                                    </span>
                                                                </label>

                                                                <label 
                                                                    className="flex items-center gap-2 cursor-pointer group"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        const newValue = !values.agregarReceta;
                                                                        setFieldValue("agregarReceta", newValue);
                                                                        
                                                                        if (newValue) {
                                                                            // Desmarcar inventario si se marca receta
                                                                            setFieldValue("agregarInventario", false);
                                                                            setTempInventoryData(null);
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className="relative">
                                                                        <Field
                                                                            type="checkbox"
                                                                            name="agregarReceta"
                                                                            className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                                                                        Agregar receta
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>

                                            {/* Precio y Categoría en fila */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Precio
                                                    </label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 font-bold">$</span>
                                                        <Field
                                                            name="price"
                                                            type="text"
                                                            className="w-full pl-7 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                                            placeholder="0.00"
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Permitir solo números y un punto decimal
                                                                const regex = /^\d*\.?\d*$/;
                                                                if (regex.test(value) || value === '') {
                                                                    setFieldValue('price', value);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Categoría
                                                    </label>
                                                    <Field
                                                        name="category_id"
                                                        as="select"
                                                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                                    >
                                                        <option value="" disabled>
                                                            Seleccionar
                                                        </option>
                                                        {(categories || []).map((category) => (
                                                            <option key={category.id_categoria} value={category.id_categoria}>
                                                                {category.nombre_categoria}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    {isCategoryNotSelected && (
                                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                            <IoCloseCircle />
                                                            Selecciona una categoría
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Imagen */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                    Imagen del producto
                                                </label>
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                                                    <div className="mb-2">
                                                        <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/gif,image/jpg"
                                                        onChange={(event) => {
                                                            const file = event.target.files[0];
                                                            const allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

                                                            if (file && !allowedFormats.includes(file.type)) {
                                                                setModalMessage("Formato no válido. Solo JPG, PNG, GIF.");
                                                                event.target.value = "";
                                                                return;
                                                            }

                                                            setFieldValue("image", file);
                                                        }}
                                                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer cursor-pointer"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        JPG, PNG, GIF
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Estado */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                    Estado
                                                </label>
                                                <Field
                                                    name="status"
                                                    as="select"
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                                    onChange={(e) => setFieldValue("status", e.target.value)}
                                                >
                                                    <option value="activo">✅ Activo</option>
                                                    <option value="inactivo">❌ Inactivo</option>
                                                </Field>
                                            </div>

                                            {/* Botones */}
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isFormInvalid}
                                                    className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                                                        isFormInvalid 
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                                                    }`}
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
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
                </div>
            )}

            {/* Modal de Inventario */}
            {isInventoryModalOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[60] p-4"
                    onClick={cancelInventoryModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto border border-green-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <FaPlus className="text-white text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Agregar al Inventario</h2>
                                    <p className="text-green-100 text-xs">Registra este producto en tu inventario</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleAddToInventory} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Producto
                                </label>
                                <input
                                    type="text"
                                    value={currentProductName}
                                    readOnly
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Cantidad (Piezas)
                                </label>
                                <input
                                    type="text"
                                    name="cantidad"
                                    value={inventoryFormData.cantidad}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^\d*\.?\d*$/;
                                        if (regex.test(value) || value === '') {
                                            handleInventoryInputChange(e);
                                        }
                                    }}
                                    placeholder="Cantidad de piezas"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Costo por pieza
                                </label>
                                <input
                                    type="text"
                                    name="costo"
                                    value={inventoryFormData.costo}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const regex = /^\d*\.?\d*$/;
                                        if (regex.test(value) || value === '') {
                                            handleInventoryInputChange(e);
                                        }
                                    }}
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Comentarios (opcional)
                                </label>
                                <textarea
                                    name="comentarios"
                                    value={inventoryFormData.comentarios}
                                    onChange={handleInventoryInputChange}
                                    placeholder="Comentarios adicionales..."
                                    rows="3"
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoadingInventory}
                                    className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                        isLoadingInventory
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                                    }`}
                                >
                                    {isLoadingInventory ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Guardando...
                                        </div>
                                    ) : (
                                        'Agregar al Inventario'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelInventoryModal}
                                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}