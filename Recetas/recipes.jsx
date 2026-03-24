import { IoAddOutline, IoClose } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from 'react-hot-toast';
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
import RecetasExtras from "./recetasExtras";
import { AddExtrasModal, SelectExtrasIngredientsModal } from "./ExtrasModals";
import getExtras from "@/useCases/getExtras";
import { postExtras } from "@/useCases/postExtras";

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
  const [isDisplayableInsumos, setIsDisplayableInsumos] = useState({});
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

  // Estado para controlar qué tab está activo (recetas o extras)
  const [activeTab, setActiveTab] = useState('recetas');

  // Estados para extras
  const [isAddExtrasModalOpen, setIsAddExtrasModalOpen] = useState(false);
  const [isSelectExtrasIngredientsModalOpen, setIsSelectExtrasIngredientsModalOpen] = useState(false);
  const [selectedRecetaForExtras, setSelectedRecetaForExtras] = useState(null);
  const [extrasExistentes, setExtrasExistentes] = useState([]);
  const [todosLosExtras, setTodosLosExtras] = useState([]); // Todos los extras para mapear
  const [insumosSeleccionadosExtras, setInsumosSeleccionadosExtras] = useState([]);
  const [cantidadesExtras, setCantidadesExtras] = useState({});
  const [preciosExtras, setPreciosExtras] = useState({});
  const [terminoBusquedaExtras, setTerminoBusquedaExtras] = useState("");
  const [isSubmittingExtras, setIsSubmittingExtras] = useState(false);
  const [errorMessageExtras, setErrorMessageExtras] = useState("");
  const [successMessageExtras, setSuccessMessageExtras] = useState("");

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
      setIsDisplayableInsumos({});
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

  // Cargar todos los extras cuando se monta el componente
  useEffect(() => {
    cargarTodosLosExtras();
  }, []);

  const cargarTodosLosExtras = async () => {
    try {
      const response = await getExtras();
      if (response.success && response.data) {
        setTodosLosExtras(response.data);
      }
    } catch (error) {
      console.error('Error al cargar todos los extras:', error);
      setTodosLosExtras([]);
    }
  };

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
      // Guardar TODAS las recetas (incluyendo las ocultas)
      // El filtro se aplicará solo en la UI para mostrar
      setRecetas(recetasData);
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
      } else {
        console.error('Error al cargar insumos:', response.message);
        toast.error('Error al cargar los insumos: ' + response.message, {
          duration: 2000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error al cargar insumos:', error);
      toast.error('Error al cargar los insumos: ' + error.message, {
        duration: 2000,
        position: 'top-center',
      });
    } finally {
      setIsLoadingInsumos(false);
    }
  };

  const cargarProductos = async () => {
    setIsLoadingProducts(true);
    try {
      const productosData = await getProducts();
      setProducts(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setErrorMessage('Error al cargar los productos: ' + error.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Filtrar recetas por búsqueda Y excluir las ocultas para mostrar en UI
  const recetasFiltradas = recetas
    .filter(receta => !receta.name.startsWith('recipeStatusNoDisplay.'))
    .filter(receta => receta.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
        setIsDisplayableInsumos(prevDisplayable => {
          const nuevosDisplayable = { ...prevDisplayable };
          delete nuevosDisplayable[insumoId];
          return nuevosDisplayable;
        });
      } else {
        // Por defecto, los ingredientes NO son removibles (is_displayable = false)
        setIsDisplayableInsumos(prev => ({
          ...prev,
          [insumoId]: false
        }));
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

  // Manejar cambio de is_displayable (checkbox removible)
  const handleIsDisplayableChange = (insumoId, value) => {
    setIsDisplayableInsumos(prev => ({
      ...prev,
      [insumoId]: value
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
          quantity: parseFloat(cantidadesInsumos[insumoId]),
          is_displayable: isDisplayableInsumos[insumoId] || false
        }))
      };

      
      const response = await postRecetas(recipeData);
      
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
        setIsDisplayableInsumos({});
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
      
      setEditingRecipe(recipeDetails);
      setRecipeName(recipeDetails.name);
      
      const ingredientIds = recipeDetails.ingredients.map(ing => ing.ingredient_id);
      const quantities = {};
      const displayableValues = {};
      recipeDetails.ingredients.forEach(ing => {
        quantities[ing.ingredient_id] = ing.quantity.toString();
        displayableValues[ing.ingredient_id] = ing.is_displayable || false;
      });
      
      setInsumosSeleccionados(ingredientIds);
      setCantidadesInsumos(quantities);
      setIsDisplayableInsumos(displayableValues);
      
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
    setIsDisplayableInsumos(prev => {
      const newDisplayable = { ...prev };
      delete newDisplayable[ingredientId];
      return newDisplayable;
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
          quantity: parseFloat(cantidadesInsumos[ingredientId]),
          is_displayable: isDisplayableInsumos[ingredientId] || false
        }))
      };

      
      const response = await putReceta(editingRecipe.id_recipe, updateData);
      
      setSuccessMessage("Receta actualizada exitosamente");
      
      await cargarRecetas();
      
      setTimeout(() => {
        setIsEditRecipeModalOpen(false);
        setEditingRecipe(null);
        setSelectedRecipeId(null);
        setRecipeName("");
        setInsumosSeleccionados([]);
        setCantidadesInsumos({});
        setIsDisplayableInsumos({});
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

  // Handlers para extras
  const handleOpenExtrasModal = async (receta) => {
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }

    setSelectedRecetaForExtras(receta);
    setErrorMessageExtras("");
    setSuccessMessageExtras("");

    // Cargar extras existentes para esta receta
    try {
      const response = await getExtras();
      if (response.success && response.data) {
        const extrasDeReceta = response.data.filter(
          extra => extra.recipe_id === receta.id_recipe
        );
        setExtrasExistentes(extrasDeReceta);

        // Pre-cargar los extras existentes en los inputs para editar
        if (extrasDeReceta.length > 0) {
          const ingredientIds = extrasDeReceta.map(extra => extra.ingredient_id);
          const quantities = {};
          const prices = {};

          extrasDeReceta.forEach(extra => {
            quantities[extra.ingredient_id] = extra.quantity.toString();
            prices[extra.ingredient_id] = extra.price.toString();
          });

          setInsumosSeleccionadosExtras(ingredientIds);
          setCantidadesExtras(quantities);
          setPreciosExtras(prices);
        } else {
          // Si no hay extras, limpiar los estados
          setInsumosSeleccionadosExtras([]);
          setCantidadesExtras({});
          setPreciosExtras({});
        }
      }
    } catch (error) {
      console.error('Error al cargar extras:', error);
      setExtrasExistentes([]);
      setInsumosSeleccionadosExtras([]);
      setCantidadesExtras({});
      setPreciosExtras({});
    }

    setIsAddExtrasModalOpen(true);
  };

  const handleSelectExtrasIngredients = () => {
    setIsSelectExtrasIngredientsModalOpen(true);
    if (insumos.length === 0) {
      cargarInsumos();
    }
  };

  const toggleSeleccionInsumoExtra = (insumoId) => {
    setInsumosSeleccionadosExtras(prev => {
      const nuevaSeleccion = prev.includes(insumoId)
        ? prev.filter(id => id !== insumoId)
        : [...prev, insumoId];

      if (prev.includes(insumoId)) {
        setCantidadesExtras(prevCantidades => {
          const nuevasCantidades = { ...prevCantidades };
          delete nuevasCantidades[insumoId];
          return nuevasCantidades;
        });
        setPreciosExtras(prevPrecios => {
          const nuevosPrecios = { ...prevPrecios };
          delete nuevosPrecios[insumoId];
          return nuevosPrecios;
        });
      }

      return nuevaSeleccion;
    });
  };

  const handleCantidadExtraChange = (insumoId, cantidad) => {
    const valorLimpio = cantidad.replace(/[^0-9.]/g, '');
    setCantidadesExtras(prev => ({
      ...prev,
      [insumoId]: valorLimpio
    }));
  };

  const handlePrecioExtraChange = (insumoId, precio) => {
    const valorLimpio = precio.replace(/[^0-9.]/g, '');
    setPreciosExtras(prev => ({
      ...prev,
      [insumoId]: valorLimpio
    }));
  };

  const handleRemoveIngredientExtra = (ingredientId) => {
    setInsumosSeleccionadosExtras(prev => prev.filter(id => id !== ingredientId));
    setCantidadesExtras(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[ingredientId];
      return newQuantities;
    });
    setPreciosExtras(prev => {
      const newPrices = { ...prev };
      delete newPrices[ingredientId];
      return newPrices;
    });
  };

  const handleSaveExtras = async () => {
    if (!selectedRecetaForExtras) return;

    if (insumosSeleccionadosExtras.length === 0) {
      setErrorMessageExtras("Debe seleccionar al menos un insumo");
      return;
    }

    // Validar que todos los insumos tengan cantidad y precio
    const insumosInvalidos = insumosSeleccionadosExtras.filter(id =>
      !cantidadesExtras[id] || parseFloat(cantidadesExtras[id]) <= 0 ||
      !preciosExtras[id] || parseFloat(preciosExtras[id]) < 0
    );

    if (insumosInvalidos.length > 0) {
      setErrorMessageExtras("Todos los extras deben tener cantidad y precio válidos");
      return;
    }

    setIsSubmittingExtras(true);
    setErrorMessageExtras("");
    setSuccessMessageExtras("");

    try {
      // Crear el array de extras
      const extrasData = insumosSeleccionadosExtras.map(insumoId => ({
        ingredient_id: parseInt(insumoId),
        recipe_id: parseInt(selectedRecetaForExtras.id_recipe),
        quantity: parseFloat(cantidadesExtras[insumoId]),
        price: parseFloat(preciosExtras[insumoId])
      }));

      // Enviar cada extra individualmente
      for (const extraData of extrasData) {
        await postExtras(extraData);
      }

      setSuccessMessageExtras("Extras guardados exitosamente");

      // Recargar extras existentes
      const response = await getExtras();
      if (response.success && response.data) {
        const extrasDeReceta = response.data.filter(
          extra => extra.recipe_id === selectedRecetaForExtras.id_recipe
        );
        setExtrasExistentes(extrasDeReceta);
        // También actualizar todos los extras
        setTodosLosExtras(response.data);
      }

      setTimeout(() => {
        setIsAddExtrasModalOpen(false);
        setSelectedRecetaForExtras(null);
        setInsumosSeleccionadosExtras([]);
        setCantidadesExtras({});
        setPreciosExtras({});
        setSuccessMessageExtras("");
      }, 1500);

    } catch (error) {
      console.error('Error al guardar extras:', error);
      setErrorMessageExtras(error.message || "Error al guardar los extras");
    } finally {
      setIsSubmittingExtras(false);
    }
  };

  return (
    <section>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />
      <div className="pt-16">
        {/* Header de Recetas */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Mis Recetas</h1>
                <p className="text-gray-600 mt-1">Crea y gestiona las recetas de tus platillos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y botones */}
        <div className="sticky top-16 z-30 bg-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 py-4 sm:py-6">{/* Agregado max-w-7xl mx-auto para centrar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Barra de búsqueda */}
            <input
              type="text"
              placeholder={activeTab === 'recetas' ? 'Buscar receta...' : 'Buscar extra...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />

            {/* Botones de acción - Solo se muestran en la pestaña de recetas */}
            {activeTab === 'recetas' && (
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
            )}
          </div>
        </div>

        {/* Contenido: componente de Recetas y Extras (presentacional) */}
        <RecetasExtras
          recetas={recetas}
          recetasFiltradas={recetasFiltradas}
          isLoadingRecetas={isLoadingRecetas}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRecipeId={selectedRecipeId}
          onSelectRecipe={handleSelectRecipe}
          onTabChange={setActiveTab}
          onOpenExtrasModal={handleOpenExtrasModal}
          todosLosExtras={todosLosExtras}
        />
      </div>

      {/* Modales */}
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={() => setIsAddRecipeModalOpen(false)}
        selectedProduct={selectedProduct}
        insumosSeleccionados={insumosSeleccionados}
        insumos={insumos}
        cantidadesInsumos={cantidadesInsumos}
        isDisplayableInsumos={isDisplayableInsumos}
        isSubmittingRecipe={isSubmittingRecipe}
        errorMessage={errorMessage}
        successMessage={successMessage}
        onSelectProduct={() => setIsSelectProductModalOpen(true)}
        onSelectSupplies={handleSelectSupplies}
        onSaveRecipe={handleSaveRecipe}
        onCantidadChange={handleCantidadChange}
        onIsDisplayableChange={handleIsDisplayableChange}
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
        isDisplayableInsumos={isDisplayableInsumos}
        isLoadingRecipeDetails={isLoadingRecipeDetails}
        isSubmittingRecipe={isSubmittingRecipe}
        errorMessage={errorMessage}
        successMessage={successMessage}
        onRecipeNameChange={setRecipeName}
        onSelectSupplies={handleSelectSupplies}
        onUpdateRecipe={handleUpdateRecipe}
        onCantidadChange={handleCantidadChange}
        onIsDisplayableChange={handleIsDisplayableChange}
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

      {/* Modales de Extras */}
      <AddExtrasModal
        isOpen={isAddExtrasModalOpen}
        onClose={() => setIsAddExtrasModalOpen(false)}
        receta={selectedRecetaForExtras}
        extrasExistentes={extrasExistentes}
        insumosSeleccionados={insumosSeleccionadosExtras}
        insumos={insumos}
        cantidadesExtras={cantidadesExtras}
        preciosExtras={preciosExtras}
        isSubmitting={isSubmittingExtras}
        errorMessage={errorMessageExtras}
        successMessage={successMessageExtras}
        onSelectExtrasIngredients={handleSelectExtrasIngredients}
        onCantidadChange={handleCantidadExtraChange}
        onPrecioChange={handlePrecioExtraChange}
        onSaveExtras={handleSaveExtras}
        onRemoveIngredient={handleRemoveIngredientExtra}
      />

      <SelectExtrasIngredientsModal
        isOpen={isSelectExtrasIngredientsModalOpen}
        onClose={() => setIsSelectExtrasIngredientsModalOpen(false)}
        insumos={insumos}
        insumosSeleccionados={insumosSeleccionadosExtras}
        terminoBusqueda={terminoBusquedaExtras}
        isLoading={isLoadingInsumos}
        onSearchChange={setTerminoBusquedaExtras}
        onToggleInsumo={toggleSeleccionInsumoExtra}
      />
    </section>
  );
}