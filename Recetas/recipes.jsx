import { IoAddOutline, IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/dashboardComponents/navbar";
import getIngredientesInventario from "@/useCases/getIngredientesInventario";
import { postRecetas } from "@/useCases/postRecetas";
import { getRecetas } from "@/useCases/getRecetas";
import { getProducts } from "@/useCases/getProducts";
import { getRecetaById } from "@/useCases/getRecetasId";
import { putReceta } from "@/useCases/putRecetas";
import { checkPayment } from "@/useCases/checkPayment";

// Importar los componentes separados
import RecipeCard from "./RecipeCard";
import AddRecipeModal from "./AddRecipeModal";
import EditRecipeModal from "./EditRecipeModal";
import { SelectSuppliesModal, SelectProductModal, SubscriptionModal } from "./SelectionModals";

export default function Recipes() {
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [isEditRecipeModalOpen, setIsEditRecipeModalOpen] = useState(false);
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
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isLoadingRecipeDetails, setIsLoadingRecipeDetails] = useState(false);

  // Estados para restricción de pago / modal de suscripción
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

  // Chequear suscripción al montar
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

  // Filtrar recetas por búsqueda
  const recetasFiltradas = recetas.filter(receta =>
    receta.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar selección de insumos
  const toggleSeleccionInsumo = (insumoId) => {
    setInsumosSeleccionados(prev => {
      const nuevaSeleccion = prev.includes(insumoId) 
        ? prev.filter(id => id !== insumoId)
        : [...prev, insumoId];
      
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
    const valorLimpio = cantidad.replace(/[^0-9.]/g, '');
    setCantidadesInsumos(prev => ({
      ...prev,
      [insumoId]: valorLimpio
    }));
  };

  // Manejar selección de receta
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

  // Abrir modal de agregar (verifica suscripción)
  const handleOpenAddRecipe = () => {
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    setIsAddRecipeModalOpen(true);
  };

  const handleSaveRecipe = async () => {
    if (!selectedProductId) {
      setErrorMessage("Debe seleccionar un producto");
      return;
    }

    if (insumosSeleccionados.length === 0) {
      setErrorMessage("Debe seleccionar al menos un insumo");
      return;
    }

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
      const recipeData = {
        name: selectedProduct.name,
        product_id: parseInt(selectedProductId),
        ingredients: insumosSeleccionados.map(insumoId => ({
          ingredient_id: parseInt(insumoId),
          quantity: parseFloat(cantidadesInsumos[insumoId])
        }))
      };

      console.log('Enviando receta:', JSON.stringify(recipeData, null, 2));
      
      const response = await postRecetas(recipeData);
      console.log('Receta creada exitosamente:', response);
      
      setSuccessMessage("Receta creada exitosamente");
      
      await cargarRecetas();
      
      setTimeout(() => {
        setIsAddRecipeModalOpen(false);
        setRecipeName("");
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
      const errorMsg = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
            ? error.response.data.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
            : error.response.data.detail)
        : error.message || "Error al guardar la receta";
      setErrorMessage(errorMsg);
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

  const handleEditRecipe = async () => {
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }

    if (!selectedRecipeId) return;

    setIsLoadingRecipeDetails(true);
    setIsEditRecipeModalOpen(true);
    
    try {
      const recipeDetails = await getRecetaById(selectedRecipeId);
      console.log('Detalles de la receta:', recipeDetails);
      
      setEditingRecipe(recipeDetails);
      setRecipeName(recipeDetails.name);
      
      const ingredientIds = recipeDetails.ingredients.map(ing => ing.ingredient_id);
      const quantities = {};
      recipeDetails.ingredients.forEach(ing => {
        quantities[ing.ingredient_id] = ing.quantity.toString();
      });
      
      setInsumosSeleccionados(ingredientIds);
      setCantidadesInsumos(quantities);
      
      await cargarInsumos();
      
    } catch (error) {
      console.error('Error al cargar detalles de la receta:', error);
      setErrorMessage('Error al cargar los detalles de la receta: ' + error.message);
      setIsEditRecipeModalOpen(false);
    } finally {
      setIsLoadingRecipeDetails(false);
    }
  };

  const handleRemoveIngredient = (ingredientId) => {
    setInsumosSeleccionados(prev => prev.filter(id => id !== ingredientId));
    setCantidadesInsumos(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[ingredientId];
      return newQuantities;
    });
  };

  const handleUpdateRecipe = async () => {
    if (!editingRecipe) return;

    if (!recipeName.trim()) {
      setErrorMessage("El nombre de la receta es requerido");
      return;
    }

    if (insumosSeleccionados.length === 0) {
      setErrorMessage("Debe tener al menos un ingrediente");
      return;
    }

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
      const updateData = {
        name: recipeName.trim(),
        product_id: parseInt(editingRecipe.product_id),
        ingredients: insumosSeleccionados.map(ingredientId => ({
          ingredient_id: parseInt(ingredientId),
          quantity: parseFloat(cantidadesInsumos[ingredientId])
        }))
      };

      console.log('Actualizando receta:', JSON.stringify(updateData, null, 2));
      
      const response = await putReceta(editingRecipe.id_recipe, updateData);
      console.log('Receta actualizada exitosamente:', response);
      
      setSuccessMessage("Receta actualizada exitosamente");
      
      await cargarRecetas();
      
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
      const errorMsg = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
            ? error.response.data.detail.map(err => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
            : error.response.data.detail)
        : error.message || "Error al actualizar la receta";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmittingRecipe(false);
    }
  };

  // Efecto para el contador de la modal de suscripción
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
                onClick={handleEditRecipe}
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
                  <RecipeCard
                    key={receta.id_recipe}
                    receta={receta}
                    isSelected={selectedRecipeId === receta.id_recipe}
                    onSelect={handleSelectRecipe}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modales */}
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={() => setIsAddRecipeModalOpen(false)}
        selectedProduct={selectedProduct}
        insumosSeleccionados={insumosSeleccionados}
        insumos={insumos}
        cantidadesInsumos={cantidadesInsumos}
        isSubmittingRecipe={isSubmittingRecipe}
        errorMessage={errorMessage}
        successMessage={successMessage}
        onSelectProduct={() => setIsSelectProductModalOpen(true)}
        onSelectSupplies={handleSelectSupplies}
        onSaveRecipe={handleSaveRecipe}
        onCantidadChange={handleCantidadChange}
        onRemoveIngredient={handleRemoveIngredient}
      />

      <EditRecipeModal
        isOpen={isEditRecipeModalOpen}
        onClose={() => setIsEditRecipeModalOpen(false)}
        editingRecipe={editingRecipe}
        recipeName={recipeName}
        insumosSeleccionados={insumosSeleccionados}
        insumos={insumos}
        cantidadesInsumos={cantidadesInsumos}
        isLoadingRecipeDetails={isLoadingRecipeDetails}
        isSubmittingRecipe={isSubmittingRecipe}
        errorMessage={errorMessage}
        successMessage={successMessage}
        onRecipeNameChange={setRecipeName}
        onSelectSupplies={handleSelectSupplies}
        onUpdateRecipe={handleUpdateRecipe}
        onCantidadChange={handleCantidadChange}
        onRemoveIngredient={handleRemoveIngredient}
      />

      <SelectSuppliesModal
        isOpen={isSelectSuppliesModalOpen}
        onClose={() => setIsSelectSuppliesModalOpen(false)}
        insumos={insumos}
        insumosSeleccionados={insumosSeleccionados}
        terminoBusqueda={terminoBusquedaInsumos}
        isLoading={isLoadingInsumos}
        onSearchChange={setTerminoBusquedaInsumos}
        onToggleInsumo={toggleSeleccionInsumo}
      />

      <SelectProductModal
        isOpen={isSelectProductModalOpen}
        onClose={() => setIsSelectProductModalOpen(false)}
        products={products}
        recetas={recetas}
        terminoBusqueda={terminoBusquedaProductos}
        isLoading={isLoadingProducts}
        onSearchChange={setTerminoBusquedaProductos}
        onSelectProduct={handleSelectProduct}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        countdown={countdown}
        onGoToPayments={handleGoToPayments}
      />
    </section>
  );
}