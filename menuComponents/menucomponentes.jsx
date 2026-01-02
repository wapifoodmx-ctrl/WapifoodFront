import { MdOutlineAttachMoney } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { FiFilter } from "react-icons/fi";
import { BsTag } from "react-icons/bs";
import { Formik, Form, Field } from "formik";
import { createProduct } from "../useCases/createProduct";
import * as Yup from "yup";
import postCategoria from "../useCases/postCategoria";
import ModalMessage from "../components/ModalMessage";
import { postInventarioIngredientes } from "../useCases/postInventarioIngredientes";
import { postRecetas } from "../useCases/postRecetas";
import RecipeModalForProduct from "../components/RecipeModalForProduct";
import getIngredientesInventario from "../useCases/getIngredientesInventario.js";

export default function MenuComponentes({ onSearch, onCategoryChange, onRefresh, categories, onAvailabilityChange }) {
    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
    const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
    const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalMessage, setModalMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingInventory, setIsLoadingInventory] = useState(false);
    const [tempInventoryData, setTempInventoryData] = useState(null);
    const [currentProductName, setCurrentProductName] = useState("");
    const [recipeProductName, setRecipeProductName] = useState("");
    const [pendingRecipeData, setPendingRecipeData] = useState(null);
    const [inventoryFormData, setInventoryFormData] = useState({
        cantidad: "",
        costo: "",
        comentarios: ""
    });
    const [ingredientesInsumo, setIngredientesInsumo] = useState([]);
    const [formikSetFieldValue, setFormikSetFieldValue] = useState(null);

    // Función para capitalizar la primera letra
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const closeModals = () => {
        setIsProductoModalOpen(false);
        setIsCategoriaModalOpen(false);
        setIsInventoryModalOpen(false);
        setIsRecipeModalOpen(false);
        setTempInventoryData(null);
        setCurrentProductName("");
        setRecipeProductName("");
        setPendingRecipeData(null);
        setInventoryFormData({
            cantidad: "",
            costo: "",
            comentarios: ""
        });
    };

    const cancelInventoryModal = () => {
        setIsInventoryModalOpen(false);
        setInventoryFormData({
            cantidad: "",
            costo: "",
            comentarios: ""
        });
        setTempInventoryData(null);
        // Reset the checkbox
        if (formikSetFieldValue) {
            formikSetFieldValue("agregarInventario", false);
        }
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

        // NO desmarcar el checkbox aquí, se mantiene marcado
        setIsInventoryModalOpen(false);
        setInventoryFormData({
            cantidad: "",
            costo: "",
            comentarios: ""
        });
        
        setModalMessage("Datos del inventario guardados. Presiona 'Crear' para confirmar.");
    };

    const handleSaveRecipe = async (ingredients) => {
        setPendingRecipeData(ingredients);
        setIsRecipeModalOpen(false);
        // NO desmarcar el checkbox aquí, se mantiene marcado
        setModalMessage("Receta guardada. Presiona 'Guardar' para confirmar el producto con la receta.");
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleInventoryInputChange = (e) => {
        const { name, value } = e.target;
        setInventoryFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validationSchemaProducto = Yup.object().shape({
        nombre: Yup.string().required("El nombre del producto es obligatorio"),
        descripcion: Yup.string().required("La descripción es obligatoria"),
        precio: Yup.number()
            .typeError("El precio debe ser un número")
            .positive("El precio debe ser un número positivo")
            .min(0.01, "El precio debe ser mayor a 0")
            .required("El precio es obligatorio"),
        imagen: Yup.mixed().required("La imagen del producto es obligatoria"),
    });

    const validationSchemaCategoria = Yup.object().shape({
        nombre_categoria: Yup.string().required("El nombre de la categoría es obligatorio"),
        descripcion_categoria: Yup.string().required("La descripción es obligatoria"),
    });

    useEffect(() => {
        const fetchIngredientes = async () => {
            try {
                const result = await getIngredientesInventario();
                if (result.success) {
                    const filtrados = result.data.filter(ing => ing.category === 'insumo');
                    setIngredientesInsumo(filtrados);
                }
            } catch (error) {
                console.error('Error al cargar ingredientes:', error);
            }
        };
        fetchIngredientes();
    }, []);

    return (
        <div className="sticky top-16 z-30 bg-gradient-to-r from-white via-green-50 to-emerald-50 p-4 sm:p-6 rounded-2xl shadow-lg border border-green-100 mb-4 sm:mb-8 w-full">
            {/* Mostrar la modal si hay un mensaje */}
            {modalMessage && (
                <ModalMessage
                    message={modalMessage}
                    onClose={() => setModalMessage(null)} // Cerrar la modal
                />
            )}

            <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                {/* Barra de búsqueda mejorada */}
                <div className="relative lg:w-6/12">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <HiOutlineMagnifyingGlass className="h-5 w-5 text-green-600" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-green-300"
                    />
                    {searchTerm && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    onSearch("");
                                }}
                                className="text-gray-400 hover:text-green-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-4 lg:w-6/12">
                    {/* Dropdowns con diseño mejorado */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Dropdown Categorías */}
                        <div className="relative flex-1">
                            <div className="flex items-center gap-3 px-4 py-3 border-2 border-green-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm hover:border-green-300 transition-all duration-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                                <BsTag className="text-green-600 text-lg flex-shrink-0" />
                                <select
                                    id="categorias"
                                    className="w-full outline-none bg-transparent text-gray-700 font-medium cursor-pointer"
                                    onChange={(e) => onCategoryChange(e.target.value)}
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map((category) => (
                                        <option key={category.id_categoria} value={category.id_categoria}>
                                            {category.nombre_categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dropdown Disponibilidad */}
                        <div className="relative flex-1">
                            <div className="flex items-center gap-3 px-4 py-3 border-2 border-green-200 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm hover:border-green-300 transition-all duration-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                                <FiFilter className="text-green-600 text-lg flex-shrink-0" />
                                <select
                                    id="disponibilidad"
                                    className="w-full outline-none bg-transparent text-gray-700 font-medium cursor-pointer"
                                    onChange={(e) => onAvailabilityChange(e.target.value)}
                                >
                                    <option value="todos">Todos los productos</option>
                                    <option value="disponibles">Disponibles</option>
                                    <option value="no-disponibles">No disponibles</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Botones con diseño mejorado */}
                    <div className="flex gap-3">
                        <button
                            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                            onClick={() => setIsProductoModalOpen(true)}
                        >
                            <FaPlus className="text-lg" />
                            <span className="hidden sm:inline">Producto</span>
                        </button>
                        <button
                            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                            onClick={() => setIsCategoriaModalOpen(true)}
                        >
                            <BsTag className="text-lg" />
                            <span className="hidden sm:inline">Categoría</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Productos con diseño mejorado y más compacto */}
            {isProductoModalOpen && (
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <FaPlus className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Agregar Producto</h2>
                                        <p className="text-green-100 text-xs">Crea un nuevo producto para tu menú</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModals}
                                    className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Contenido del modal más compacto */}
                        <div className="p-4">
                            <Formik
                                initialValues={{
                                    nombre: "",
                                    descripcion: "",
                                    precio: "",
                                    categoria: "",
                                    imagen: null,
                                    agregarInventario: false,
                                    agregarReceta: false,
                                }}
                                validationSchema={validationSchemaProducto}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        const productData = {
                                            name: capitalizeFirstLetter(values.nombre),
                                            description: capitalizeFirstLetter(values.descripcion),
                                            price: values.precio,
                                            category_id: values.categoria,
                                        };

                                        if (!values.imagen) {
                                            setModalMessage("Por favor, selecciona una imagen válida.");
                                            setSubmitting(false);
                                            return;
                                        }

                                        // PASO 1: Crear el producto
                                        const createdProduct = await createProduct(productData, values.imagen);
                                        const productId = createdProduct.id_products;
                                        const productName = createdProduct.name;

                                        let ingredientId = null;

                                        // PASO 2: Si hay datos de inventario
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

                                            if (ingredientId) {
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

                                        // PASO 3: Si hay datos de receta personalizada
                                        if (pendingRecipeData && values.agregarReceta) {
                                            const recipeData = {
                                                name: productName,
                                                product_id: productId,
                                                ingredients: pendingRecipeData
                                            };

                                            await postRecetas(recipeData);
                                        }

                                        const successMessage = tempInventoryData && values.agregarInventario
                                            ? "Producto creado, agregado al inventario y receta automática creada exitosamente"
                                            : pendingRecipeData && values.agregarReceta
                                                ? "Producto creado con receta exitosamente"
                                                : "Producto creado exitosamente";

                                        setModalMessage(successMessage);
                                        closeModals();
                                        await onRefresh();

                                    } catch (error) {
                                        console.error("Error al crear el producto:", error.message);
                                        setModalMessage(error.message || "Error al crear el producto. Verifica los datos enviados.");
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ setFieldValue, errors, touched, values }) => {
                                    // Guardar la función setFieldValue para usar en otros lugares
                                    if (!formikSetFieldValue) {
                                        setFormikSetFieldValue(() => setFieldValue);
                                    }

                                    const isDescriptionTooLong = values.descripcion && values.descripcion.length > 500;
                                    const isCategoryNotSelected = !values.categoria || values.categoria === "";
                                    const isFormInvalid = isDescriptionTooLong || isCategoryNotSelected;

                                    return (
                                        <Form className="space-y-4">
                                            {/* Nombre del producto */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                    Nombre del producto
                                                </label>
                                                <Field
                                                    name="nombre"
                                                    type="text"
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                                    placeholder="Ej: Pizza Margherita"
                                                    onChange={(e) => {
                                                        const capitalizedValue = capitalizeFirstLetter(e.target.value);
                                                        setFieldValue("nombre", capitalizedValue);
                                                    }}
                                                    value={values.nombre}
                                                />
                                                {errors.nombre && touched.nombre && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.nombre}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Descripción */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                    Descripción
                                                </label>
                                                <Field
                                                    name="descripcion"
                                                    as="textarea"
                                                    rows="3"
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                                                    placeholder="Describe tu producto..."
                                                    onChange={(e) => {
                                                        const capitalizedValue = capitalizeFirstLetter(e.target.value);
                                                        setFieldValue("descripcion", capitalizedValue);
                                                    }}
                                                    value={values.descripcion}
                                                />
                                                <div className="flex justify-between items-center mt-1">
                                                    <div>
                                                        {errors.descripcion && touched.descripcion && (
                                                            <p className="text-red-500 text-xs flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                                {errors.descripcion}
                                                            </p>
                                                        )}
                                                        {isDescriptionTooLong && (
                                                            <p className="text-red-500 text-xs flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                                Máximo 500 caracteres
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className={`text-xs ${values.descripcion?.length > 500 ? 'text-red-500' : 'text-gray-400'
                                                        }`}>
                                                        {values.descripcion?.length || 0}/500
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Checkboxes de Inventario y Receta */}
                                            <div className="flex gap-4 py-2">
                                                <label
                                                    className="flex items-center gap-2 cursor-pointer group"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (!values.agregarInventario) {
                                                            // Solo abrir modal si no está marcado
                                                            setFieldValue("agregarReceta", false);
                                                            setCurrentProductName(values.nombre || "Producto");
                                                            setIsInventoryModalOpen(true);
                                                        } else {
                                                            // Desmarcar y limpiar datos
                                                            setFieldValue("agregarInventario", false);
                                                            setTempInventoryData(null);
                                                        }
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <Field
                                                            type="checkbox"
                                                            name="agregarInventario"
                                                            checked={!!tempInventoryData}
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
                                                        if (!values.agregarReceta) {
                                                            // Solo abrir modal si no está marcado
                                                            setFieldValue("agregarInventario", false);
                                                            setTempInventoryData(null);
                                                            setRecipeProductName(values.nombre || "Producto");
                                                            setIsRecipeModalOpen(true);
                                                        } else {
                                                            // Desmarcar y limpiar datos
                                                            setFieldValue("agregarReceta", false);
                                                            setPendingRecipeData(null);
                                                        }
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <Field
                                                            type="checkbox"
                                                            name="agregarReceta"
                                                            checked={!!pendingRecipeData}
                                                            className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer checked:bg-green-500 checked:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 pointer-events-none"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                                                        Agregar receta
                                                    </span>
                                                </label>
                                            </div>

                                            {/* Precio y Categoría en fila */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Precio */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Precio
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <MdOutlineAttachMoney className="text-green-600 text-lg" />
                                                        </div>
                                                        <Field
                                                            name="precio"
                                                            type="text"
                                                            className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                                            placeholder="0.00"
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                // Permitir solo números y un punto decimal
                                                                const regex = /^\d*\.?\d*$/;
                                                                if (regex.test(value) || value === '') {
                                                                    setFieldValue('precio', value);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    {errors.precio && touched.precio && (
                                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {errors.precio}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Categoría */}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                        Categoría
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <BsTag className="text-green-600 text-sm" />
                                                        </div>
                                                        <Field
                                                            name="categoria"
                                                            as="select"
                                                            className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 cursor-pointer appearance-none bg-white"
                                                        >
                                                            <option value="" disabled>
                                                                Seleccionar
                                                            </option>
                                                            {categories.map((category) => (
                                                                <option key={category.id_categoria} value={category.id_categoria}>
                                                                    {category.nombre_categoria}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    {(errors.categoria && touched.categoria) || isCategoryNotSelected ? (
                                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {errors.categoria || "Selecciona una categoría"}
                                                        </p>
                                                    ) : null}
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
                                                        accept="image/*"
                                                        onChange={(event) => setFieldValue("imagen", event.target.files[0])}
                                                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        PNG, JPG, JPEG hasta 10MB
                                                    </p>
                                                </div>
                                                {errors.imagen && touched.imagen && (
                                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.imagen}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isFormInvalid || isLoading}
                                                    className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                                        isFormInvalid || isLoading
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                                                    }`}
                                                >
                                                    {isLoading ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            Creando...
                                                        </div>
                                                    ) : (
                                                        'Crear Producto'
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={closeModals}
                                                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
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

            {/* Modal de Receta */}
            <RecipeModalForProduct
                isOpen={isRecipeModalOpen}
                onClose={() => {
                    setIsRecipeModalOpen(false);
                    setPendingRecipeData(null);
                    if (formikSetFieldValue) {
                        formikSetFieldValue("agregarReceta", false);
                    }
                }}
                onSave={handleSaveRecipe}
                productName={recipeProductName}
                availableIngredients={ingredientesInsumo}
            />

            {/* Modal de Categoría */}
            {isCategoriaModalOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={closeModals}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-green-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <BsTag className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Nueva Categoría</h2>
                                        <p className="text-green-100 text-xs">Agrega una nueva categoría al menú</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModals}
                                    className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <Formik
                                initialValues={{
                                    nombre_categoria: "",
                                    descripcion_categoria: "",
                                }}
                                validationSchema={validationSchemaCategoria}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        const categoryData = {
                                            nombre_categoria: capitalizeFirstLetter(values.nombre_categoria),
                                            descripcion_categoria: capitalizeFirstLetter(values.descripcion_categoria),
                                        };

                                        await postCategoria(categoryData);
                                        setModalMessage("Categoría creada exitosamente");
                                        closeModals();
                                        await onRefresh();
                                    } catch (error) {
                                        console.error("Error al crear la categoría:", error.message);
                                        setModalMessage("Error al crear la categoría. Inténtalo nuevamente.");
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ errors, touched, setFieldValue, values }) => (
                                    <Form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Nombre de la categoría
                                            </label>
                                            <Field
                                                name="nombre_categoria"
                                                type="text"
                                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                                placeholder="Ej: Bebidas"
                                                onChange={(e) => {
                                                    const capitalizedValue = capitalizeFirstLetter(e.target.value);
                                                    setFieldValue("nombre_categoria", capitalizedValue);
                                                }}
                                                value={values.nombre_categoria}
                                            />
                                            {errors.nombre_categoria && touched.nombre_categoria && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.nombre_categoria}
                                            </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Descripción
                                            </label>
                                            <Field
                                                name="descripcion_categoria"
                                                as="textarea"
                                                rows="3"
                                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                                                placeholder="Describe la categoría..."
                                                onChange={(e) => {
                                                    const capitalizedValue = capitalizeFirstLetter(e.target.value);
                                                    setFieldValue("descripcion_categoria", capitalizedValue);
                                                }}
                                                value={values.descripcion_categoria}
                                            />
                                            {errors.descripcion_categoria && touched.descripcion_categoria && (
                                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.descripcion_categoria}
                                            </p>
                                            )}
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="submit"
                                                className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                            >
                                                Crear Categoría
                                            </button>
                                            <button
                                                type="button"
                                                onClick={closeModals}
                                                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
