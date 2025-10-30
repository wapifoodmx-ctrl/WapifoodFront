import { IoAddOutline, IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/dashboardComponents/navbar";
import getIngredientesInventario from "@/useCases/getIngredientesInventario";
import { postRecetas } from "@/useCases/postRecetas";
import { getRecetas } from "@/useCases/getRecetas";
import { getProducts } from "@/useCases/getProducts";
import { getRecetaById } from "@/useCases/getRecetasId"; // ← Añadir esta línea
import { putReceta } from "@/useCases/putRecetas"; // ← Añadir esta línea
import { checkPayment } from "@/useCases/checkPayment"; // ← NUEVO: importar verificación de pago

export default function Recipes() {
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [isEditRecipeModalOpen, setIsEditRecipeModalOpen] = useState(false); // ← Nuevo estado
  const [isSelectSuppliesModalOpen, setIsSelectSuppliesModalOpen] = useState(false);
  const [isSelectProductModalOpen, setIsSelectProductModalOpen] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [plateQuantity, setPlateQuantity] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [insumos, setInsumos] = useState([]);
  const [products, setProducts] = useState([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [cantidadesInsumos, setCantidadesInsumos] = useState({});
  const [terminoBusquedaInsumos, setTerminoBusquedaInsumos] = useState("");
  const [terminoBusquedaProductos, setTerminoBusquedaProductos] = useState("");
  const [isLoadingInsumos, setIsLoadingInsumos] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSubmittingRecipe, setIsSubmittingRecipe] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Estados para las recetas
  const [recetas, setRecetas] = useState([]);
  const [isLoadingRecetas, setIsLoadingRecetas] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para editar receta
  const [editingRecipe, setEditingRecipe] = useState(null); // ← Nuevo estado
  const [isLoadingRecipeDetails, setIsLoadingRecipeDetails] = useState(false); // ← Nuevo estado

  // NUEVOS ESTADOS para restricción de pago / modal de suscripción
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(true);
  
  const router = useRouter();

  // Cargar insumos cuando se abre el modal
  useEffect(() => {
    if (isSelectSuppliesModalOpen) {
      cargarInsumos();
    }
  }, [isSelectSuppliesModalOpen]);

  // Cargar productos cuando se abre el modal de agregar receta
  useEffect(() => {
    if (isAddRecipeModalOpen) {
      // Limpiar estados cuando se abre la modal
      setRecipeName("");
      setSelectedProduct(null);
      setSelectedProductId("");
      setPlateQuantity("");
      setTotalCost("");
      setInsumosSeleccionados([]);
      setCantidadesInsumos({});
      setTerminoBusquedaProductos("");
      setErrorMessage("");
      setSuccessMessage("");
      
      cargarProductos();
    }
  }, [isAddRecipeModalOpen]);

  // Cargar recetas al inicializar el componente
  useEffect(() => {
    cargarRecetas();
  }, []);

  // NUEVO: chequear suscripción al montar y bloquear acceso si no está activa
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const data = await checkPayment();
        if (!data || !data.has_active_subscription) {
          setHasActiveSubscription(false);
          setShowSubscriptionModal(true);
        } else {
          setHasActiveSubscription(true);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        // En caso de error asumimos que no hay acceso y mostramos modal
        setHasActiveSubscription(false);
        setShowSubscriptionModal(true);
      }
    };

    checkSubscription();
  }, []);

  const cargarRecetas = async () => {
    setIsLoadingRecetas(true);
    try {
      const recetasData = await getRecetas();
      setRecetas(recetasData);
      console.log('Recetas cargadas:', recetasData);
    } catch (error) {
      console.error('Error al cargar recetas:', error);
    } finally {
      setIsLoadingRecetas(false);
    }
  };

  const cargarInsumos = async () => {
    setIsLoadingInsumos(true);
    try {
      const response = await getIngredientesInventario();
      
      if (response.success && response.data) {
        // Filtrar solo los insumos (category === "insumo")
        const soloInsumos = response.data.filter(item => item.category === "insumo");
        setInsumos(soloInsumos);
        console.log('Insumos cargados:', soloInsumos);
      } else {
        console.error('Error al cargar insumos:', response.message);
        alert('Error al cargar los insumos: ' + response.message);
      }
    } catch (error) {
      console.error('Error al cargar insumos:', error);
      alert('Error al cargar los insumos: ' + error.message);
    } finally {
      setIsLoadingInsumos(false);
    }
  };

  const cargarProductos = async () => {
    setIsLoadingProducts(true);
    try {
      const productosData = await getProducts();
      setProducts(productosData);
      console.log('Productos cargados:', productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setErrorMessage('Error al cargar los productos: ' + error.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Filtrar insumos por búsqueda
  const insumosFiltrados = insumos.filter(insumo =>
    insumo.name.toLowerCase().includes(terminoBusquedaInsumos.toLowerCase()) ||
    insumo.description.toLowerCase().includes(terminoBusquedaInsumos.toLowerCase())
  );

  // Filtrar recetas por búsqueda
  const recetasFiltradas = recetas.filter(receta =>
    receta.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener productos disponibles (que no tengan receta asignada)
  const productosDisponibles = products.filter(product => {
    // Verificar si este producto ya tiene una receta asignada
    const tieneReceta = recetas.some(receta => receta.product_id === product.id_products);
    return !tieneReceta;
  });

  // Filtrar productos disponibles por búsqueda
  const productosFiltrados = productosDisponibles.filter(product =>
    product.name.toLowerCase().includes(terminoBusquedaProductos.toLowerCase()) ||
    product.description.toLowerCase().includes(terminoBusquedaProductos.toLowerCase()) ||
    product.nombre_categoria.toLowerCase().includes(terminoBusquedaProductos.toLowerCase())
  );

  // Manejar selección de insumos
  const toggleSeleccionInsumo = (insumoId) => {
    setInsumosSeleccionados(prev => {
      const nuevaSeleccion = prev.includes(insumoId) 
        ? prev.filter(id => id !== insumoId)
        : [...prev, insumoId];
      
      // Si se deselecciona, eliminar de cantidades
      if (prev.includes(insumoId)) {
        setCantidadesInsumos(prevCantidades => {
          const nuevasCantidades = { ...prevCantidades };
          delete nuevasCantidades[insumoId];
          return nuevasCantidades;
        });
      }
      
      return nuevaSeleccion;
    });
  };

  // Manejar cambio de cantidad de insumo
  const handleCantidadChange = (insumoId, cantidad) => {
    // Solo permitir números y punto decimal
    const valorLimpio = cantidad.replace(/[^0-9.]/g, '');
    setCantidadesInsumos(prev => ({
      ...prev,
      [insumoId]: valorLimpio
    }));
  };

  // Manejar selección de receta (solo una a la vez)
  const handleSelectRecipe = (recipeId) => {
    setSelectedRecipeId(selectedRecipeId === recipeId ? null : recipeId);
  };

  // Función para seleccionar producto
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectedProductId(product.id_products);
    setIsSelectProductModalOpen(false);
    setTerminoBusquedaProductos("");
  };

  // NUEVA función para abrir modal de agregar (verifica suscripción)
  const handleOpenAddRecipe = () => {
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    setIsAddRecipeModalOpen(true);
  };

  // Obtener insumos seleccionados con sus datos completos
  const insumosSeleccionadosCompletos = insumosSeleccionados.map(id => 
    insumos.find(insumo => insumo.id_ingredient === id)
  ).filter(Boolean);

  const handleSaveRecipe = async () => {
    // Validaciones básicas - Ya no necesitamos validar recipeName
    if (!selectedProductId) {
      setErrorMessage("Debe seleccionar un producto");
      return;
    }

    if (insumosSeleccionados.length === 0) {
      setErrorMessage("Debe seleccionar al menos un insumo");
      return;
    }

    // Validar que todos los insumos seleccionados tengan cantidad
    const insumosInvalidos = insumosSeleccionados.filter(id => 
      !cantidadesInsumos[id] || parseFloat(cantidadesInsumos[id]) <= 0
    );

    if (insumosInvalidos.length > 0) {
      setErrorMessage("Todos los insumos seleccionados deben tener una cantidad válida mayor a 0");
      return;
    }

    setIsSubmittingRecipe(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Preparar los datos en el formato que espera la API - Usar el nombre del producto
      const recipeData = {
        name: selectedProduct.name, // ✅ Usar el nombre del producto seleccionado
        product_id: selectedProductId,
        ingredients: insumosSeleccionados.map(insumoId => ({
          ingredient_id: insumoId,
          quantity: parseFloat(cantidadesInsumos[insumoId])
        }))
      };

      console.log('Enviando receta:', recipeData);
      
      // Llamar a la API
      const response = await postRecetas(recipeData);
      console.log('Receta creada exitosamente:', response);
      
      setSuccessMessage("Receta creada exitosamente");
      
      // Recargar las recetas para mostrar la nueva
      await cargarRecetas();
      
      // Limpiar campos y cerrar modal después de un breve delay
      setTimeout(() => {
        setIsAddRecipeModalOpen(false);
        setRecipeName(""); // Mantener para limpiar aunque no se use
        setSelectedProductId("");
        setSelectedProduct(null);
        setPlateQuantity("");
        setTotalCost("");
        setInsumosSeleccionados([]);
        setCantidadesInsumos({});
        setSuccessMessage("");
      }, 1500);
      
    } catch (error) {
      console.error('Error al crear la receta:', error);
      setErrorMessage(error.message || "Error al guardar la receta");
    } finally {
      setIsSubmittingRecipe(false);
    }
  };

  const handleSelectSupplies = () => {
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    setIsSelectSuppliesModalOpen(true);
  };

  const handleRedirectToInventory = () => {
    router.push('/inventarios');
  };

  const handleBackdropClick = (e, closeFunction) => {
    if (e.target === e.currentTarget) {
      closeFunction();
    }
  };

  // Nueva función para abrir modal de edición
  const handleEditRecipe = async () => {
    // Verificar suscripción
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }

    if (!selectedRecipeId) return;

    setIsLoadingRecipeDetails(true);
    setIsEditRecipeModalOpen(true);
    
    try {
      // Obtener los detalles de la receta
      const recipeDetails = await getRecetaById(selectedRecipeId);
      console.log('Detalles de la receta:', recipeDetails);
      
      setEditingRecipe(recipeDetails);
      setRecipeName(recipeDetails.name);
      
      // Configurar ingredientes seleccionados y cantidades
      const ingredientIds = recipeDetails.ingredients.map(ing => ing.ingredient_id);
      const quantities = {};
      recipeDetails.ingredients.forEach(ing => {
        quantities[ing.ingredient_id] = ing.quantity.toString();
      });
      
      setInsumosSeleccionados(ingredientIds);
      setCantidadesInsumos(quantities);
      
      // Cargar todos los insumos disponibles
      await cargarInsumos();
      
    } catch (error) {
      console.error('Error al cargar detalles de la receta:', error);
      setErrorMessage('Error al cargar los detalles de la receta: ' + error.message);
      setIsEditRecipeModalOpen(false);
    } finally {
      setIsLoadingRecipeDetails(false);
    }
  };

  // Función para eliminar ingrediente de la receta en edición
  const handleRemoveIngredient = (ingredientId) => {
    setInsumosSeleccionados(prev => prev.filter(id => id !== ingredientId));
    setCantidadesInsumos(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[ingredientId];
      return newQuantities;
    });
  };

  // Función para eliminar ingrediente en modal de agregar receta
  const handleRemoveIngredientFromAdd = (ingredientId) => {
    setInsumosSeleccionados(prev => prev.filter(id => id !== ingredientId));
    setCantidadesInsumos(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[ingredientId];
      return newQuantities;
    });
  };

  // Función para guardar cambios en la receta
  const handleUpdateRecipe = async () => {
    if (!editingRecipe) return;

    // Validaciones
    if (!recipeName.trim()) {
      setErrorMessage("El nombre de la receta es requerido");
      return;
    }

    if (insumosSeleccionados.length === 0) {
      setErrorMessage("Debe tener al menos un ingrediente");
      return;
    }

    // Validar cantidades
    const insumosInvalidos = insumosSeleccionados.filter(id => 
      !cantidadesInsumos[id] || parseFloat(cantidadesInsumos[id]) <= 0
    );

    if (insumosInvalidos.length > 0) {
      setErrorMessage("Todos los ingredientes deben tener una cantidad válida mayor a 0");
      return;
    }

    setIsSubmittingRecipe(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Preparar datos para la actualización
      const updateData = {
        name: recipeName.trim(),
        product_id: editingRecipe.product_id,
        ingredients: insumosSeleccionados.map(ingredientId => ({
          ingredient_id: ingredientId,
          quantity: parseFloat(cantidadesInsumos[ingredientId])
        }))
      };

      console.log('Actualizando receta:', updateData);
      
      // Llamar a la API de actualización
      const response = await putReceta(editingRecipe.id_recipe, updateData);
      console.log('Receta actualizada exitosamente:', response);
      
      setSuccessMessage("Receta actualizada exitosamente");
      
      // Recargar las recetas
      await cargarRecetas();
      
      // Cerrar modal después de un breve delay
      setTimeout(() => {
        setIsEditRecipeModalOpen(false);
        setEditingRecipe(null);
        setSelectedRecipeId(null);
        setRecipeName("");
        setInsumosSeleccionados([]);
        setCantidadesInsumos({});
        setSuccessMessage("");
      }, 1500);
      
    } catch (error) {
      console.error('Error al actualizar la receta:', error);
      setErrorMessage(error.message || "Error al actualizar la receta");
    } finally {
      setIsSubmittingRecipe(false);
    }
  };

  // Efecto para el contador de la modal de suscripción (redirige cuando llega a 0)
  useEffect(() => {
    let interval = null;
    
    if (showSubscriptionModal && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (showSubscriptionModal && countdown === 0) {
      handleGoToPayments();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showSubscriptionModal, countdown]);

  // Resetear contador cuando se abre la modal
  useEffect(() => {
    if (showSubscriptionModal) {
      setCountdown(10);
    }
  }, [showSubscriptionModal]);

  const handleGoToPayments = () => {
    setShowSubscriptionModal(false);
    setCountdown(10);
    router.push('/payments');
  };

  return (
    <section>
      <Navbar />
      <div className="pt-20">
        {/* Barra de búsqueda y botones */}
        <div className="px-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Barra de búsqueda */}
            <input
              type="text"
              placeholder="Buscar receta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-1/2 lg:justify-center lg:items-center">
              {/* Botón Añadir */}
              <button 
                onClick={handleOpenAddRecipe}
                className="flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 bg-white border-2 border-green-500 text-green-600 hover:bg-orange-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 lg:text-base"
              >
                <IoAddOutline className="text-lg" />
                <span>Agregar Receta</span>
              </button>
              
              {/* Botón Modificar */}
              <button 
                onClick={handleEditRecipe} // ← Cambiar esta línea
                disabled={!selectedRecipeId}
                className={`flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform lg:text-base ${
                  selectedRecipeId 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiEdit className="text-lg" />
                <span>Modificar Receta</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal - Cards de recetas */}
        <div className="px-4">
          {isLoadingRecetas ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-4 text-lg text-gray-600">Cargando recetas...</span>
            </div>
          ) : recetasFiltradas.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-500 text-lg">
                {searchTerm ? (
                  <>
                    <p className="mb-2">No se encontraron recetas con "{searchTerm}"</p>
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="text-green-500 hover:text-green-600 font-medium"
                    >
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mb-4">No hay recetas disponibles</p>
                    <button 
                      onClick={handleOpenAddRecipe}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      <IoAddOutline className="text-lg" />
                      Crear tu primera receta
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Header con contador de resultados */}
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Recetas {searchTerm && `- "${searchTerm}"`}
                </h2>
                <span className="text-sm text-gray-500">
                  {recetasFiltradas.length} receta{recetasFiltradas.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Grid de cards de recetas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {recetasFiltradas.map((receta) => (
                  <div
                    key={receta.id_recipe}
                    onClick={() => handleSelectRecipe(receta.id_recipe)}
                    className={`cursor-pointer border-2 rounded-xl p-4 lg:p-6 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
                      selectedRecipeId === receta.id_recipe
                        ? 'border-green-500 bg-green-50 shadow-lg scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    {/* Header de la card con checkbox */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-lg lg:text-xl mb-1 truncate">
                          {receta.name}
                        </h3>
                      </div>
                      
                      {/* Checkbox personalizado */}
                      <div className="flex-shrink-0 ml-3">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedRecipeId === receta.id_recipe
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-400'
                        }`}>
                          {selectedRecipeId === receta.id_recipe && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Información de la receta */}
                    <div className="space-y-3">
                      {/* Ingredientes */}
                      <div className="py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Ingredientes:</span>
                        {receta.ingredients && receta.ingredients.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {receta.ingredients.map((ingredient, index) => (
                              <span 
                                key={ingredient.id_ingredient || index}
                                className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                              >
                                {ingredient.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">Sin ingredientes registrados</span>
                        )}
                      </div>
                    </div>

                    {/* Footer con indicador de selección */}
                    {selectedRecipeId === receta.id_recipe && (
                      <div className="mt-4 py-2 px-3 bg-green-100 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-700 text-center">
                          ✓ Receta seleccionada
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Información de selección */}
              {selectedRecipeId && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">
                          {recetasFiltradas.find(r => r.id_recipe === selectedRecipeId)?.name}
                        </p>
                        <p className="text-sm text-green-600">Receta seleccionada para modificar</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecipeId(null);
                      }}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Agregar Receta */}
      {isAddRecipeModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
          onClick={(e) => handleBackdropClick(e, () => setIsAddRecipeModalOpen(false))}
        >
          {/* Desktop - Modal más ancho con dos columnas */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto hidden lg:block">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Agregar Nueva Receta</h2>
              <button
                onClick={() => setIsAddRecipeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenido Desktop - Dos columnas */}
            <div className="p-6 flex gap-6">
              {/* Columna izquierda - Formulario */}
              <div className="w-1/2 space-y-6">
                {/* Botón seleccionar producto */}
                <div>
                  <button 
                    onClick={() => setIsSelectProductModalOpen(true)}
                    className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors"
                  >
                    {selectedProduct ? `Producto: ${selectedProduct.name}` : 'Seleccionar Producto'}
                  </button>
                  {selectedProduct && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                      {selectedProduct.image_url && selectedProduct.image_url.length > 0 ? (
                        <img 
                          src={selectedProduct.image_url[0]} 
                          alt={selectedProduct.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Sin imagen</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-blue-800 text-sm">{selectedProduct.name}</p>
                        <p className="text-xs text-blue-600">{selectedProduct.nombre_categoria}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          La receta llevará el nombre: "{selectedProduct.name}"
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          setSelectedProductId("");
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <IoClose className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Botón seleccionar insumos */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleSelectSupplies}
                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                  >
                    Seleccionar Insumos {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length})`}
                  </button>
                </div>
                
                {/* Botón Guardar */}
                <button
                  onClick={handleSaveRecipe}
                  disabled={isSubmittingRecipe}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingRecipe ? 'Guardando...' : 'Guardar Receta'}
                </button>

                {/* Mensajes de error y éxito */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {successMessage}
                  </div>
                )}
              </div>

              {/* Columna derecha - Insumos seleccionados */}
              <div className="w-1/2 border-l border-gray-200 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Insumos Seleccionados ({insumosSeleccionados.length})
                </h3>
                
                {insumosSeleccionados.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">Selecciona insumos para la receta</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {insumosSeleccionados.map((ingredientId) => {
                      const insumo = insumos.find(i => i.id_ingredient === ingredientId);
                      if (!insumo) return null;
                      
                      return (
                        <div key={ingredientId} className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                {insumo.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Stock: {insumo.stock} {insumo.unit}
                              </p>
                            </div>
                            <div className="w-20">
                              <input
                                type="text"
                                placeholder="0"
                                value={cantidadesInsumos[ingredientId] || ''}
                                onChange={(e) => handleCantidadChange(ingredientId, e.target.value)}
                                className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveIngredientFromAdd(ingredientId)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Eliminar ingrediente"
                            >
                              <IoClose className="text-lg" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile - Modal original con lista debajo */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto lg:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Agregar Nueva Receta</h2>
              <button
                onClick={() => setIsAddRecipeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenido Mobile */}
            <div className="p-6 space-y-6">
              {/* Botón seleccionar producto */}
              <div>
                <button 
                  onClick={() => setIsSelectProductModalOpen(true)}
                  className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors"
                >
                  {selectedProduct ? `Producto: ${selectedProduct.name}` : 'Seleccionar Producto'}
                </button>
                {selectedProduct && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                    {selectedProduct.image_url && selectedProduct.image_url.length > 0 ? (
                      <img 
                        src={selectedProduct.image_url[0]} 
                        alt={selectedProduct.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Sin imagen</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-blue-800 text-sm">{selectedProduct.name}</p>
                      <p className="text-xs text-blue-600">{selectedProduct.nombre_categoria}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Nombre de receta: "{selectedProduct.name}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setSelectedProductId("");
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <IoClose className="text-lg" />
                    </button>
                  </div>
                )}
              </div>

              {/* Botón seleccionar insumos */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSelectSupplies}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                >
                  Seleccionar Insumos {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length})`}
                </button>
              </div>

              {/* Lista de insumos seleccionados - MÓVIL */}
              {insumosSeleccionados.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Insumos Seleccionados ({insumosSeleccionados.length})
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {insumosSeleccionados.map((ingredientId) => {
                      const insumo = insumos.find(i => i.id_ingredient === ingredientId);
                      if (!insumo) return null;
                      
                      return (
                        <div key={ingredientId} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                              {insumo.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Stock: {insumo.stock} {insumo.unit}
                            </p>
                          </div>
                          <div className="w-16">
                            <input
                              type="text"
                              placeholder="0"
                              value={cantidadesInsumos[ingredientId] || ''}
                              onChange={(e) => handleCantidadChange(ingredientId, e.target.value)}
                              className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveIngredientFromAdd(ingredientId)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Eliminar"
                          >
                            <IoClose className="text-lg" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Costo total - Removido ya que no se usa */}
            </div>

            {/* Footer Mobile */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleSaveRecipe}
                disabled={isSubmittingRecipe}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingRecipe ? 'Guardando...' : 'Guardar Receta'}
              </button>

              {/* Mensajes de error y éxito */}
              {errorMessage && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Suscripción / Restricción de acceso (copiado de Ticketview) */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(countdown / 10) * 175.93} 175.93`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">{countdown}</span>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-4 text-green-600 text-center">Suscripción Requerida</h2>
            <p className="text-gray-700 mb-4 text-center">
              Tu suscripción ha expirado o no tienes permisos para acceder a esta funcionalidad.
              Por favor, renueva tu suscripción para continuar.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <p className="text-green-700 text-sm text-center">
                <span className="font-semibold">Redirección automática en {countdown} segundo{countdown !== 1 ? 's' : ''}</span>
                <br />
                Serás redirigido a la página de pagos automáticamente
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGoToPayments}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
              >
                Ir a Pagos Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Seleccionar Insumos */}
      {isSelectSuppliesModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-60 p-4"
          onClick={(e) => handleBackdropClick(e, () => setIsSelectSuppliesModalOpen(false))}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Seleccionar Insumos
                {insumosSeleccionados.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-green-600">
                    ({insumosSeleccionados.length} seleccionados)
                  </span>
                )}
              </h2>
              <button
                onClick={() => setIsSelectSuppliesModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Barra de búsqueda con botón agregar */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Buscar insumo..."
                  value={terminoBusquedaInsumos}
                  onChange={(e) => setTerminoBusquedaInsumos(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              {/* Lista de insumos */}
              <div className="max-h-96 overflow-y-auto">
                {isLoadingInsumos ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-gray-600">Cargando insumos...</span>
                  </div>
                ) : insumosFiltrados.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <p>
                      {terminoBusquedaInsumos 
                        ? "No se encontraron insumos con ese nombre" 
                        : "No hay insumos disponibles"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {insumosFiltrados.map((insumo) => (
                      <div
                        key={insumo.id_ingredient}
                        onClick={() => toggleSeleccionInsumo(insumo.id_ingredient)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          insumosSeleccionados.includes(insumo.id_ingredient)
                            ? 'border-green-500 bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-green-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 text-sm lg:text-base line-clamp-2">
                            {insumo.name}
                          </h3>
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-2 ${
                            insumosSeleccionados.includes(insumo.id_ingredient)
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300'
                          }`}>
                            {insumosSeleccionados.includes(insumo.id_ingredient) && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-2">
                          {insumo.description}
                        </p>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Stock:</span>
                            <span className="text-xs font-medium text-gray-700">
                              {insumo.stock} {insumo.unit}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Costo:</span>
                            <span className="text-xs font-medium text-green-600">
                              ${insumo.cost.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Total:</span>
                            <span className="text-xs font-bold text-green-700">
                              ${insumo.total_cost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer con botones de acción */}
              {!isLoadingInsumos && insumosFiltrados.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setInsumosSeleccionados([]);
                      setCantidadesInsumos({});
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Limpiar Selección
                  </button>
                  <button
                    onClick={() => setIsSelectSuppliesModalOpen(false)}
                    disabled={insumosSeleccionados.length === 0}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      insumosSeleccionados.length > 0
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Confirmar Selección ({insumosSeleccionados.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Seleccionar Productos */}
      {isSelectProductModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-60 p-4"
          onClick={(e) => handleBackdropClick(e, () => setIsSelectProductModalOpen(false))}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Seleccionar Producto
                {productosDisponibles.length !== products.length && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({productosDisponibles.length} disponibles de {products.length} total)
                  </span>
                )}
              </h2>
              <button
                onClick={() => setIsSelectProductModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Barra de búsqueda */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={terminoBusquedaProductos}
                  onChange={(e) => setTerminoBusquedaProductos(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              {/* Lista de productos */}
              <div className="max-h-96 overflow-y-auto">
                {isLoadingProducts ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Cargando productos...</span>
                  </div>
                ) : productosFiltrados.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <p>
                      {terminoBusquedaProductos 
                        ? "No se encontraron productos con ese nombre" 
                        : "No hay productos disponibles"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productosFiltrados.map((product) => (
                      <div
                        key={product.id_products}
                        onClick={() => handleSelectProduct(product)}
                        className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-300 bg-white"
                      >
                        {/* Imagen del producto */}
                        <div className="mb-3">
                          {product.image_url && product.image_url.length > 0 ? (
                            <img 
                              src={product.image_url[0]} 
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-sm">Sin imagen</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Información del producto */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-800 text-sm lg:text-base line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-blue-600 font-medium">
                            {product.nombre_categoria}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Receta */}
      {isEditRecipeModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
          onClick={(e) => handleBackdropClick(e, () => setIsEditRecipeModalOpen(false))}
        >
          {/* Desktop - Modal más ancho con dos columnas */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto hidden lg:block">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Editar Receta
                {editingRecipe && <span className="text-base font-normal text-gray-600 ml-2">- {editingRecipe.name}</span>}
              </h2>
              <button
                onClick={() => setIsEditRecipeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenido Desktop - Loading o Formulario */}
            {isLoadingRecipeDetails ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <span className="ml-4 text-lg text-gray-600">Cargando detalles de la receta...</span>
              </div>
            ) : (
              <div className="p-6 flex gap-6">
                {/* Columna izquierda - Formulario */}
                <div className="w-1/2 space-y-6">
                  {/* Nombre de la receta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la receta
                    </label>
                    <input
                      type="text"
                      value={recipeName}
                      onChange={(e) => setRecipeName(e.target.value)}
                      placeholder="Nombre de la receta..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                  </div>

                  {/* Botón seleccionar insumos adicionales */}
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleSelectSupplies}
                      className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                    >
                      Agregar Más Insumos {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length} total)`}
                    </button>
                  </div>
                  
                  {/* Botón Guardar */}
                  <button
                    onClick={handleUpdateRecipe}
                    disabled={isSubmittingRecipe}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingRecipe ? 'Actualizando...' : 'Actualizar Receta'}
                  </button>

                  {/* Mensajes de error y éxito */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                      {successMessage}
                    </div>
                  )}
                </div>

                {/* Columna derecha - Ingredientes actuales */}
                <div className="w-1/2 border-l border-gray-200 pl-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Ingredientes Actuales ({insumosSeleccionados.length})
                  </h3>
                  
                  {insumosSeleccionados.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p className="text-sm">No hay ingredientes en esta receta</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {insumosSeleccionados.map((ingredientId) => {
                        const insumo = insumos.find(i => i.id_ingredient === ingredientId);
                        if (!insumo) return null;
                        
                        return (
                          <div key={ingredientId} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                  {insumo.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Stock: {insumo.stock} {insumo.unit}
                                </p>
                              </div>
                              <div className="w-20">
                                <input
                                  type="text"
                                  placeholder="0"
                                  value={cantidadesInsumos[ingredientId] || ''}
                                  onChange={(e) => handleCantidadChange(ingredientId, e.target.value)}
                                  className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                              </div>
                              <button
                                onClick={() => handleRemoveIngredient(ingredientId)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                title="Eliminar ingrediente"
                              >
                                <IoClose className="text-lg" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile - Modal para editar */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto lg:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Editar Receta</h2>
              <button
                onClick={() => setIsEditRecipeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Contenido Mobile */}
            {isLoadingRecipeDetails ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-3 text-gray-600">Cargando...</span>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Nombre de la receta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la receta
                  </label>
                  <input
                    type="text"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="Nombre de la receta..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>

                {/* Botón seleccionar insumos adicionales */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleSelectSupplies}
                    className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                  >
                    Agregar Más Insumos {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length})`}
                  </button>
                </div>

                {/* Lista de ingredientes actuales - MÓVIL */}
                {insumosSeleccionados.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Ingredientes Actuales ({insumosSeleccionados.length})
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {insumosSeleccionados.map((ingredientId) => {
                        const insumo = insumos.find(i => i.id_ingredient === ingredientId);
                        if (!insumo) return null;
                        
                        return (
                          <div key={ingredientId} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                {insumo.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Stock: {insumo.stock} {insumo.unit}
                              </p>
                            </div>
                            <div className="w-16">
                              <input
                                type="text"
                                placeholder="0"
                                value={cantidadesInsumos[ingredientId] || ''}
                                onChange={(e) => handleCantidadChange(ingredientId, e.target.value)}
                                className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveIngredient(ingredientId)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Eliminar"
                            >
                              <IoClose className="text-lg" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer Mobile */}
            {!isLoadingRecipeDetails && (
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleUpdateRecipe}
                  disabled={isSubmittingRecipe}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingRecipe ? 'Actualizando...' : 'Actualizar Receta'}
                </button>

                {/* Mensajes de error y éxito */}
                {errorMessage && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {successMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}