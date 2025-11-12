import { LiaFilterSolid } from "react-icons/lia";
import { IoAddOutline, IoClose, IoEyeOutline, IoSwapHorizontalOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import Navbar from "@/dashboardComponents/navbar";
import NavegacionPestañas from "@/Inventarios/navegaciónPestañas";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { postInventarioIngredientes } from "@/useCases/postInventarioIngredientes";
import getIngredientesInventario from "@/useCases/getIngredientesInventario";
import { getIngredienteById } from "@/useCases/getIngredienteId";
import putEditarIngrediente from "@/useCases/putEditarIngrediente";
import { checkPayment } from "@/useCases/checkPayment";

export default function Inventario() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  // Modal de éxito (crear/editar)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState("");
  // NUEVOS ESTADOS para restricción de pago / modal de suscripción
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(true);
  const router = useRouter();
  const [pestañaActiva, setPestañaActiva] = useState('insumos');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [vistaActiva, setVistaActiva] = useState('cards'); // 'cards' o 'lista'
  const [insumos, setInsumos] = useState([]); // Estado para almacenar insumos creados
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [insumoAEditar, setInsumoAEditar] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState(''); // Nuevo estado para búsqueda
  const [formData, setFormData] = useState({
    nombreProducto: "",
    medida: "Gramos",
    cantidad: "",
    costo: "",
    comentarios: "",
    categoriaAdicional: "No"
  });

  // Nuevo estado para manejar la unidad de edición
  const [unidadEdit, setUnidadEdit] = useState("Gramos");

  // Cargar ingredientes al montar el componente
  useEffect(() => {
    cargarIngredientes();
  }, []);

  const cargarIngredientes = async () => {
    setIsLoadingData(true);
    try {
      const response = await getIngredientesInventario();
      
      if (response.success && response.data) {
        // Mapear los datos de la API al formato esperado por las cards
        const ingredientesMapeados = response.data.map(ingrediente => ({
          id: ingrediente.id_ingredient, // Usar id_ingredient como id
          originalId: ingrediente.id_ingredient, // Mantener el ID original para la API
          name: ingrediente.name,
          stock: ingrediente.stock,
          unit: ingrediente.unit,
          cost: ingrediente.cost,
          description: ingrediente.description,
          category: ingrediente.category, // Agregar categoría para filtrado
          total_cost: ingrediente.total_cost // Agregar total_cost
        }));
        
        setInsumos(ingredientesMapeados);
        console.log("Ingredientes cargados:", ingredientesMapeados);
      } else {
        console.error("Error al cargar ingredientes:", response.message);
        alert(`Error al cargar ingredientes: ${response.message}`);
      }
    } catch (error) {
      console.error("Error al cargar ingredientes:", error);
      alert("Error al cargar los ingredientes del inventario");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Función para obtener el texto según la pestaña activa
  const obtenerTextosPorPestaña = (pestaña) => {
    const textos = {
      insumos: {
        buscar: "Buscar insumo...",
        agregar: "Agregar insumo",
        modificar: "Modificar insumo",
        titulo: "Agregar Insumo",
        label: "Agregar Insumo"
      },
      productos: {
        buscar: "Buscar producto...",
        agregar: "Agregar producto",
        modificar: "Modificar producto",
        titulo: "Agregar Producto",
        label: "Agregar Producto"
      },
      otros: {
        buscar: "Buscar otros...",
        agregar: "Agregar otros",
        modificar: "Modificar otros",
        titulo: "Agregar Otros",
        label: "Agregar Otros"
      }
    };
    return textos[pestaña] || textos.insumos;
  };

  const textos = obtenerTextosPorPestaña(pestañaActiva);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para abrir el modal de agregar y limpiar formulario
  const abrirModalAgregar = () => {
    // Verificar suscripción antes de abrir
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    // Limpiar completamente el formulario
    setFormData({
      nombreProducto: "",
      medida: "Gramos",
      cantidad: "",
      costo: "",
      comentarios: "",
      categoriaAdicional: "No"
    });
    setIsAddProductModalOpen(true);
  };

  // También agregar una función para cerrar el modal de agregar y limpiar
  const cerrarModalAgregar = () => {
    setIsAddProductModalOpen(false);
    // Limpiar formulario al cerrar
    setFormData({
      nombreProducto: "",
      medida: "Gramos",
      cantidad: "",
      costo: "",
      comentarios: "",
      categoriaAdicional: "No"
    });
  };

  // Función para convertir unidades al formato de la API
  const convertirUnidadParaAPI = (cantidad, unidad) => {
    const cantidadNum = parseFloat(cantidad);
    
    switch (unidad) {
      case "Kilos":
        return {
          stock: cantidadNum * 1000, // Convertir kilos a gramos
          unit: "Gramos"
        };
      case "Litros":
        return {
          stock: cantidadNum * 1000, // Convertir litros a mililitros
          unit: "Mililitros"
        };
      case "Gramos":
      case "Mililitros":
      default:
        return {
          stock: cantidadNum,
          unit: unidad
        };
    }
  };

  // Función para convertir desde la API a unidades de visualización
  const convertirDesdeAPI = (stock, unit) => {
    // Asegurarse de trabajar con números
    const stockNum = Number(stock);

    const formatDivided = (value) => {
      // Dividir entre 1000 y dejar hasta 3 decimales, eliminando ceros innecesarios
      const divided = value / 1000;
      // toFixed(3) para asegurar precisión hasta 3 decimales, luego parseFloat quita ceros sobrantes
      return parseFloat(divided.toFixed(3));
    };

    switch (unit) {
      case "Gramos":
        // Si hay al menos 1000 gramos, mostrar en kilos con decimales (ej. 49850 -> 49.85)
        if (!isNaN(stockNum) && stockNum >= 1000) {
          return {
            cantidad: formatDivided(stockNum),
            unidad: "Kilos"
          };
        }
        return {
          cantidad: stockNum,
          unidad: "Gramos"
        };
      case "Mililitros":
        // Si hay al menos 1000 mililitros, mostrar en litros con decimales
        if (!isNaN(stockNum) && stockNum >= 1000) {
          return {
            cantidad: formatDivided(stockNum),
            unidad: "Litros"
          };
        }
        return {
          cantidad: stockNum,
          unidad: "Mililitros"
        };
      default:
        return {
          cantidad: stockNum,
          unidad: unit
        };
    }
  };

  // Función para alternar entre unidades en la modal de edición
  const toggleUnidadEdit = () => {
    const cantidadActual = parseFloat(formData.cantidad);
    
    if (unidadEdit === "Gramos") {
      // Convertir de gramos a kilos
      setUnidadEdit("Kilos");
      setFormData(prev => ({
        ...prev,
        cantidad: (cantidadActual / 1000).toString()
      }));
    } else if (unidadEdit === "Kilos") {
      // Convertir de kilos a gramos
      setUnidadEdit("Gramos");
      setFormData(prev => ({
        ...prev,
        cantidad: (cantidadActual * 1000).toString()
      }));
    } else if (unidadEdit === "Mililitros") {
      // Convertir de mililitros a litros
      setUnidadEdit("Litros");
      setFormData(prev => ({
        ...prev,
        cantidad: (cantidadActual / 1000).toString()
      }));
    } else if (unidadEdit === "Litros") {
      // Convertir de litros a mililitros
      setUnidadEdit("Mililitros");
      setFormData(prev => ({
        ...prev,
        cantidad: (cantidadActual * 1000).toString()
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convertir unidades para la API
      const { stock, unit } = convertirUnidadParaAPI(formData.cantidad, formData.medida);

      // Mapear los datos del formulario al formato de la API
      const ingredientData = {
        name: formData.nombreProducto,
        description: formData.comentarios || `${pestañaActiva === 'insumos' ? 'Insumo' : pestañaActiva === 'productos' ? 'Producto' : 'Otro'}: ${formData.nombreProducto}`,
        cost: parseFloat(formData.costo),
        stock: stock, // Usar stock convertido
        unit: pestañaActiva === 'insumos' ? unit : "Pieza", // Usar unidad convertida para insumos
        category: pestañaActiva === 'insumos' ? 'insumo' : pestañaActiva === 'productos' ? 'producto' : 'otros'
      };

      console.log('Datos originales:', { cantidad: formData.cantidad, medida: formData.medida });
      console.log('Datos convertidos:', { stock, unit });

      // Llamar a la API usando la misma función para todas las pestañas
      const result = await postInventarioIngredientes(ingredientData);
      
      console.log(`${pestañaActiva.charAt(0).toUpperCase() + pestañaActiva.slice(1, -1)} creado exitosamente:`, result);
      // Mostrar modal de éxito en vez de alert
      setSuccessModalMessage(`${pestañaActiva === 'insumos' ? 'Insumo' : pestañaActiva === 'productos' ? 'Producto' : 'Elemento'} "${ingredientData.name}" agregado exitosamente`);
      setShowSuccessModal(true);
      
      // Recargar la lista de ingredientes para mostrar el nuevo
      await cargarIngredientes();

      // Cerrar modal usando la función que limpia
      cerrarModalAgregar();

      // Mostrar modal de éxito
      setSuccessModalMessage(`${pestañaActiva === 'insumos' ? 'Insumo' : pestañaActiva === 'productos' ? 'Producto' : 'Elemento'} agregado exitosamente`);
      setShowSuccessModal(true);

    } catch (error) {
      console.error(`Error al crear ${pestañaActiva.slice(0, -1)}:`, error);
      alert(`Error al agregar ${pestañaActiva === 'insumos' ? 'insumo' : pestañaActiva === 'productos' ? 'producto' : 'elemento'}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModificarInsumo = async () => {
    // Verificar suscripción antes de permitir edición
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }
    // Verificar que hay exactamente un insumo seleccionado
    if (insumosSeleccionados.length !== 1) {
      if (insumosSeleccionados.length === 0) {
        alert('Por favor selecciona un elemento para modificar');
      }
      return;
    }

    setIsLoading(true);
    try {
      const ingredienteId = insumosSeleccionados[0];
      console.log("=== INICIANDO MODIFICAR INSUMO ===");
      console.log("ID seleccionado:", ingredienteId);
      
      // Verificar que el ID existe en los insumos locales
      const insumoLocal = insumos.find(i => i.id === ingredienteId);
      console.log("Insumo local encontrado:", insumoLocal);
      
      if (!insumoLocal) {
        throw new Error('Insumo no encontrado en la lista local');
      }
      
      console.log("Llamando a la API con ID:", ingredienteId);
      const response = await getIngredienteById(ingredienteId);
      console.log("Respuesta completa de la API:", response);
      
      // Manejar diferentes estructuras de respuesta
      let ingrediente = null;
      
      if (response.data) {
        ingrediente = response.data;
      } else if (response.id_ingredient || response.id) {
        ingrediente = response;
      } else {
        throw new Error('Estructura de respuesta no reconocida');
      }
      
      console.log("Ingrediente procesado:", ingrediente);
      
      if (ingrediente) {
        setInsumoAEditar(ingrediente);
        
        // Convertir unidades desde la API para la visualización
        const { cantidad, unidad } = convertirDesdeAPI(ingrediente.stock, ingrediente.unit);
        
        // Llenar el formulario con los datos del ingrediente
        setFormData({
          nombreProducto: ingrediente.name || "",
          medida: ingrediente.unit || "Gramos",
          cantidad: cantidad.toString(),
          costo: ingrediente.cost?.toString() || "",
          comentarios: ingrediente.description || "",
          categoriaAdicional: "No",
          total_cost: ingrediente.total_cost || 0
        });

        // Establecer la unidad de edición basada en la conversión
        setUnidadEdit(unidad);
        
        console.log("Formulario llenado con datos:", {
          nombreProducto: ingrediente.name || "",
          medida: ingrediente.unit || "Gramos",
          cantidad: cantidad.toString(),
          costo: ingrediente.cost?.toString() || "",
          unidadEdit: unidad,
          total_cost: ingrediente.total_cost || 0
        });
        
        setIsEditProductModalOpen(true);
      } else {
        throw new Error('No se pudieron procesar los datos del ingrediente');
      }
    } catch (error) {
      console.error("=== ERROR EN HANDLE MODIFICAR INSUMO ===");
      console.error("Error completo:", error);
      console.error("Tipo de error:", error.name);
      console.error("Mensaje:", error.message);
      
      let mensajeError = 'Error desconocido';
      
      if (error.message.includes('conectar') || error.message.includes('fetch')) {
        mensajeError = 'No se puede conectar con el servidor. Verifica la conexión.';
      } else if (error.message.includes('Token')) {
        mensajeError = 'Error de autenticación. Inicia sesión nuevamente.';
      } else {
        mensajeError = `Error al cargar el ingrediente: ${error.message}`;
      }
      
      alert(mensajeError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('=== INICIANDO EDIT SUBMIT ===');
      
      if (!insumoAEditar) {
        throw new Error('No hay insumo seleccionado para editar');
      }

      console.log('Insumo a editar:', insumoAEditar);
      console.log('Form data actual:', formData);
      console.log('Unidad de edición actual:', unidadEdit);

      // Validar que los campos numéricos sean válidos
      const cost = parseFloat(formData.costo);
      const cantidadInput = parseFloat(formData.cantidad);

      if (isNaN(cost) || cost < 0) {
        throw new Error('El costo debe ser un número válido mayor o igual a 0');
      }

      if (isNaN(cantidadInput) || cantidadInput < 0) {
        throw new Error('La cantidad debe ser un número válido mayor o igual a 0');
      }

      // Convertir la cantidad desde la unidad de edición a la unidad base de la API
      let stockFinal = cantidadInput;
      let unitFinal = unidadEdit;

      // Si estamos editando en kilos, convertir a gramos para la API
      if (unidadEdit === "Kilos") {
        stockFinal = cantidadInput * 1000;
        unitFinal = "Gramos";
      } 
      // Si estamos editando en litros, convertir a mililitros para la API
      else if (unidadEdit === "Litros") {
        stockFinal = cantidadInput * 1000;
        unitFinal = "Mililitros";
      }

      const ingredientData = {
        name: formData.nombreProducto.trim(),
        description: formData.comentarios.trim() || `${pestañaActiva === 'insumos' ? 'Insumo' : pestañaActiva === 'productos' ? 'Producto' : 'Elemento'}: ${formData.nombreProducto.trim()}`,
        cost: cost,
        stock: stockFinal, // Usar stock convertido
        unit: pestañaActiva === 'insumos' ? unitFinal : 'Pieza', // Usar unidad convertida
        category: insumoAEditar.category || (pestañaActiva === 'insumos' ? 'insumo' : pestañaActiva === 'productos' ? 'producto' : 'otros')
      };

      console.log('=== DATOS PREPARADOS PARA ENVIAR ===');
      console.log('ID del ingrediente:', insumoAEditar.id_ingredient);
      console.log('Datos del ingrediente:', ingredientData);
      console.log('Conversión realizada:', {
        cantidadOriginal: cantidadInput,
        unidadOriginal: unidadEdit,
        stockFinal: stockFinal,
        unitFinal: unitFinal
      });

      // Verificar conectividad antes de enviar
      try {
        const testResponse = await fetch('http://192.168.1.69:8000/health', { method: 'GET' });
        console.log('Test de conectividad:', testResponse.status);
      } catch (testError) {
        console.error('Error de conectividad:', testError);
        throw new Error('No se puede conectar con el servidor. Verifica que esté ejecutándose.');
      }

      console.log('=== LLAMANDO A LA API ===');
      const result = await putEditarIngrediente(insumoAEditar.id_ingredient, ingredientData);
      
      console.log('=== RESULTADO EXITOSO ===');
      console.log('Resultado:', result);
      
      // Mostrar modal de éxito en vez de alert
      setSuccessModalMessage(`Insumo "${ingredientData.name}" modificado exitosamente`);
      setShowSuccessModal(true);
      
      // Recargar la lista de ingredientes
      await cargarIngredientes();
      
      // Cerrar modal y resetear
      setIsEditProductModalOpen(false);
      setInsumoAEditar(null);
      setInsumosSeleccionados([]);
      setUnidadEdit("Gramos"); // Resetear unidad de edición
      setFormData({
        nombreProducto: "",
        medida: "Gramos",
        cantidad: "",
        costo: "",
        comentarios: "",
        categoriaAdicional: "No"
      });

      // Mostrar modal de éxito
      setSuccessModalMessage(`Insumo "${ingredientData.name}" modificado exitosamente`);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('=== ERROR EN HANDLE SUBMIT EDIT ===');
      console.error('Error completo:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Error desconocido al modificar insumo';
      
      if (error.message.includes('conectar') || error.message.includes('fetch') || error.message.includes('NetworkError')) {
        errorMessage = `Error de conexión: ${error.message}. Verifica que el servidor esté ejecutándose`;
      } else {
        errorMessage = `Error al modificar insumo: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para filtrar elementos por búsqueda
  const filtrarPorBusqueda = (elementos, termino) => {
    if (!termino.trim()) return elementos;
    
    const terminoLower = termino.toLowerCase();
    return elementos.filter(elemento => 
      elemento.name.toLowerCase().includes(terminoLower) ||
      elemento.description?.toLowerCase().includes(terminoLower) ||
      elemento.unit.toLowerCase().includes(terminoLower) ||
      elemento.category?.toLowerCase().includes(terminoLower)
    );
  };

  // Función para limpiar selecciones al cambiar de pestaña
  const handleCambiarPestaña = (nuevaPestaña) => {
    setPestañaActiva(nuevaPestaña);
    setInsumosSeleccionados([]); // Limpiar selecciones al cambiar pestaña
    setTerminoBusqueda(''); // Limpiar búsqueda al cambiar pestaña
  };

  // Función para manejar cambios en la búsqueda
  const handleBusquedaChange = (e) => {
    setTerminoBusqueda(e.target.value);
    setInsumosSeleccionados([]); // Limpiar selecciones al buscar
  };

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
        setHasActiveSubscription(false);
        setShowSubscriptionModal(true);
      }
    };

    checkSubscription();
  }, []);

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
            <div className="relative w-full lg:w-1/2">
              <input
                type="text"
                placeholder={textos.buscar}
                value={terminoBusqueda}
                onChange={handleBusquedaChange}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pl-10"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {terminoBusqueda && (
                <button
                  onClick={() => setTerminoBusqueda('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-1/2 lg:justify-center lg:items-center">
              {/* Botón Añadir */}
              <button 
                onClick={abrirModalAgregar}
                className="flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 bg-white border-2 border-green-500 text-green-600 hover:bg-orange-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 lg:text-base"
              >
                <IoAddOutline className="text-lg" />
                <span>{textos.agregar}</span>
              </button>
              
              {/* Botón Modificar */}
              <button 
                onClick={handleModificarInsumo}
                disabled={insumosSeleccionados.length !== 1 || isLoading}
                className={`flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform lg:text-base ${
                  insumosSeleccionados.length === 1 && !isLoading
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                <FiEdit className="text-lg" />
                <span>
                  {isLoading ? 'Cargando...' : 
                   insumosSeleccionados.length === 0 ? `Selecciona un elemento` :
                   'Editar elemento'}
                </span>
              </button>

              {/* Botón Cambiar Vista */}
              <button 
                onClick={() => setVistaActiva(vistaActiva === 'cards' ? 'lista' : 'cards')}
                className="flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 lg:text-base cursor-pointer"
                title={vistaActiva === 'cards' ? 'Cambiar a vista de lista' : 'Cambiar a vista de cards'}
              >
                <IoEyeOutline className="text-lg" />
                <span>{vistaActiva === 'cards' ? 'Lista' : 'Cards'}</span>
              </button>
            </div>
          </div>
          
          {/* Mostrar resultados de búsqueda si hay término */}
          {terminoBusqueda && (
            <div className="mt-2 text-sm text-gray-600">
              Búsqueda: "<span className="font-medium">{terminoBusqueda}</span>"
            </div>
          )}
        </div>

        {/* Navegación de pestañas y contenido */}
        <div className="px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Solo la navegación */}
            <NavegacionPestañas 
              pestañaActiva={pestañaActiva} 
              cambiarPestaña={handleCambiarPestaña}
              insumos={insumos}
              isLoadingData={isLoadingData}
              vistaActiva={vistaActiva}
              insumosSeleccionados={insumosSeleccionados}
              setInsumosSeleccionados={setInsumosSeleccionados}
              terminoBusqueda={terminoBusqueda}
              filtrarPorBusqueda={filtrarPorBusqueda}
            />
          </div>
        </div>
      </div>

      {/* Modal Agregar Producto */}
      {isAddProductModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
          onClick={cerrarModalAgregar}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{textos.titulo}</h2>
              <button
                onClick={cerrarModalAgregar}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nombre del Producto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {textos.label}
                </label>
                <input
                  type="text"
                  name="nombreProducto"
                  value={formData.nombreProducto}
                  onChange={handleInputChange}
                  placeholder={`Nombre del ${pestañaActiva === 'otros' ? 'elemento' : pestañaActiva.slice(0, -1)}`}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Medidas - Solo para insumos */}
              {pestañaActiva === 'insumos' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medidas
                  </label>
                  <select
                    name="medida"
                    value={formData.medida}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Gramos">Gramos</option>
                    <option value="Kilos">Kilos</option>
                    <option value="Litros">Litros</option>
                    <option value="Mililitros">Mililitros</option>
                  </select>
                  {(formData.medida === "Kilos" || formData.medida === "Litros") && (
                    <p className="text-xs text-blue-600 mt-1">
                      {formData.medida === "Kilos" 
                        ? "Se guardará automáticamente en gramos (1 kilo = 1000 gramos)"
                        : "Se guardará automáticamente en mililitros (1 litro = 1000 mililitros)"
                      }
                    </p>
                  )}
                </div>
              )}

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad a Añadir
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  placeholder="Cantidad"
                  min="0.01"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Costo por unidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo por unidad
                </label>
                <input
                  type="number"
                  name="costo"
                  value={formData.costo}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comentarios
                </label>
                <textarea
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleInputChange}
                  placeholder="Comentarios adicionales (opcional)"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Categoría Adicional - Solo para insumos */}
              {pestañaActiva === 'insumos' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría Adicional
                  </label>
                  <select
                    name="categoriaAdicional"
                    value={formData.categoriaAdicional}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="No">No</option>
                    <option value="Si">Sí</option>
                  </select>
                </div>
              )}

              {/* Botón Guardar */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  } text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <IoAddOutline className="text-lg" />
                      Guardar {pestañaActiva === 'otros' ? 'Elemento' : pestañaActiva.charAt(0).toUpperCase() + pestañaActiva.slice(1, -1)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Producto */}
      {isEditProductModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setIsEditProductModalOpen(false);
            setInsumoAEditar(null);
            setUnidadEdit("Gramos");
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {pestañaActiva === 'insumos' ? 'Editar Insumo' : 
                 pestañaActiva === 'productos' ? 'Editar Producto' : 'Editar Elemento'}
              </h2>
              <button
                onClick={() => {
                  setIsEditProductModalOpen(false);
                  setInsumoAEditar(null);
                  setUnidadEdit("Gramos");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              {/* Nombre del Producto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {pestañaActiva === 'insumos' ? 'Editar Insumo' : 
                   pestañaActiva === 'productos' ? 'Editar Producto' : 'Editar Elemento'}
                </label>
                <input
                  type="text"
                  name="nombreProducto"
                  value={formData.nombreProducto}
                  onChange={handleInputChange}
                  placeholder={`Nombre del ${pestañaActiva === 'insumos' ? 'insumo' : 
                               pestañaActiva === 'productos' ? 'producto' : 'elemento'}`}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Medidas - Solo para insumos */}
              {pestañaActiva === 'insumos' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unidad Base (Solo lectura)
                  </label>
                  <input
                    type="text"
                    value={formData.medida}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esta es la unidad base registrada en el sistema
                  </p>
                </div>
              )}

              {/* Cantidad con botón de conversión */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad
                  {pestañaActiva === 'insumos' && (
                    <span className="text-blue-600 ml-1">({unidadEdit})</span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                    placeholder="Cantidad"
                    min="0.01"
                    step="0.01"
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  {/* Botón de conversión - Solo para insumos con unidades convertibles */}
                  {pestañaActiva === 'insumos' && 
                   (unidadEdit === "Gramos" || unidadEdit === "Kilos" || 
                    unidadEdit === "Mililitros" || unidadEdit === "Litros") && (
                    <button
                      type="button"
                      onClick={toggleUnidadEdit}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1 text-sm"
                      title={`Cambiar a ${
                        unidadEdit === "Gramos" ? "Kilos" : 
                        unidadEdit === "Kilos" ? "Gramos" :
                        unidadEdit === "Mililitros" ? "Litros" : "Mililitros"
                      }`}
                    >
                      <IoSwapHorizontalOutline className="text-sm" />
                      {unidadEdit === "Gramos" ? "Kg" : 
                       unidadEdit === "Kilos" ? "g" :
                       unidadEdit === "Mililitros" ? "L" : "ml"}
                    </button>
                  )}
                </div>
                {pestañaActiva === 'insumos' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {unidadEdit === "Kilos" && "1 kilo = 1000 gramos"}
                    {unidadEdit === "Litros" && "1 litro = 1000 mililitros"}
                    {unidadEdit === "Gramos" && "Unidad base: gramos"}
                    {unidadEdit === "Mililitros" && "Unidad base: mililitros"}
                  </p>
                )}
              </div>

              {/* Costo por pieza */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo por pieza
                </label>
                <input
                  type="number"
                  name="costo"
                  value={formData.costo}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Costo Total */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo Total
                </label>
                <input
                  type="number"
                  value={formData.total_cost || 0}
                  placeholder="0.00"
                  step="0.01"
                  readOnly
                  className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Este campo se calcula automáticamente</p>
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comentarios
                </label>
                <textarea
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleInputChange}
                  placeholder="Comentarios adicionales (opcional)"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Categoría Adicional - Solo para insumos */}
              {pestañaActiva === 'insumos' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría Adicional
                  </label>
                  <select
                    name="categoriaAdicional"
                    value={formData.categoriaAdicional}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="No">No</option>
                    <option value="Si">Sí</option>
                  </select>
                </div>
              )}

              {/* Botón Guardar */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  } text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Editando...
                    </>
                  ) : (
                    <>
                      <FiEdit className="text-lg" />
                      {pestañaActiva === 'insumos' ? 'Editar Insumo' : 
                       pestañaActiva === 'productos' ? 'Editar Producto' : 'Editar Elemento'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal Suscripción / Restricción de acceso */}
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
      
      {/* Modal de Éxito (crear / editar) */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-green-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Operación exitosa</h3>
              <p className="text-center text-gray-600">{successModalMessage}</p>
              <div className="w-full mt-6">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}