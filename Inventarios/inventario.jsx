import { LiaFilterSolid } from "react-icons/lia";
import { IoAddOutline, IoClose, IoEyeOutline, IoSwapHorizontalOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdInventory } from "react-icons/md";
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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  // NUEVO: Estados para modal de PIN
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinModalType, setPinModalType] = useState(''); // 'create' o 'edit'
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
  const [insumoDetalles, setInsumoDetalles] = useState(null);
  const [stockInicial, setStockInicial] = useState(0);
  const [terminoBusqueda, setTerminoBusqueda] = useState(''); // Nuevo estado para búsqueda
  const [formData, setFormData] = useState({
    nombreProducto: "",
    medida: "Gramos",
    cantidad: "",
    costo: "",
    comentarios: ""
  });

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
      } else {
        alert(`Error al cargar ingredientes: ${response.message}`);
      }
    } catch (error) {
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

    // Si está en la pestaña de productos, redirigir a la página de menú
    if (pestañaActiva === 'productos') {
      router.push('/menu');
      return;
    }

    // Para insumos y otros, abrir el modal normalmente
    setFormData({
      nombreProducto: "",
      medida: "Gramos",
      cantidad: "",
      costo: "",
      comentarios: ""
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
      comentarios: ""
    });
  };

  // Función para convertir unidades al formato de la API
  const convertirUnidadParaAPI = (cantidad, unidad, costoUnitario) => {
    const cantidadNum = parseFloat(cantidad);
    const costoNum = parseFloat(costoUnitario);

    switch (unidad) {
      case "Kilos":
        return {
          stock: cantidadNum * 1000, // Convertir kilos a gramos
          unit: "Gramos",
          cost: costoNum / 1000 // Ajustar costo: si puso $15 por kilo, guardamos $0.015 por gramo
        };
      case "Litros":
        return {
          stock: cantidadNum * 1000, // Convertir litros a mililitros
          unit: "Mililitros",
          cost: costoNum / 1000 // Ajustar costo: si puso $15 por litro, guardamos $0.015 por mililitro
        };
      case "Gramos":
      case "Mililitros":
      default:
        return {
          stock: cantidadNum,
          unit: unidad,
          cost: costoNum // El costo ya está por gramo/mililitro
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

  // MODIFICAR: handleSubmit ahora envía directamente sin PIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que los campos obligatorios estén completos
    if (!formData.nombreProducto || !formData.cantidad || !formData.costo) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Ejecutar creación directamente sin PIN
    await ejecutarCrearInsumo(null);
  };

  // MODIFICAR: ejecutarCrearInsumo ahora acepta PIN nulo para crear
  const ejecutarCrearInsumo = async (confirmationCode) => {
    setIsLoading(true);

    try {
      const { stock, unit, cost } = convertirUnidadParaAPI(
        formData.cantidad,
        formData.medida,
        formData.costo
      );

      const ingredientData = {
        name: formData.nombreProducto,
        description: formData.comentarios || `${pestañaActiva === 'insumos' ? 'Insumo' : pestañaActiva === 'productos' ? 'Producto' : 'Otro'}: ${formData.nombreProducto}`,
        cost: cost,
        stock: stock,
        unit: pestañaActiva === 'insumos' ? unit : "Pieza",
        category: pestañaActiva === 'insumos' ? 'insumo' : pestañaActiva === 'productos' ? 'producto' : 'otros'
      };

      // Solo agregar confirmation_code si no es null
      if (confirmationCode) {
        ingredientData.confirmation_code = confirmationCode;
      }

      const result = await postInventarioIngredientes(ingredientData);

      if (!result.success) {
        throw new Error(result.error || 'Error al crear ingrediente');
      }


      setSuccessModalMessage(`${pestañaActiva === 'insumos' ? 'Insumo' : pestañaActiva === 'productos' ? 'Producto' : 'Elemento'} "${ingredientData.name}" agregado exitosamente`);
      setShowSuccessModal(true);

      await cargarIngredientes();
      cerrarModalAgregar();

    } catch (error) {
      console.error(`Error al crear ${pestañaActiva.slice(0, -1)}:`, error);
      alert(`Error al agregar ${pestañaActiva === 'insumos' ? 'insumo' : pestañaActiva === 'productos' ? 'producto' : 'elemento'}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // NUEVO: Funciones para manejar el modal de PIN
  const abrirModalPin = (tipo) => {
    setPinModalType(tipo);
    setPinValue('');
    setPinError('');
    setIsPinModalOpen(true);
  };

  const cerrarModalPin = () => {
    setIsPinModalOpen(false);
    setPinValue('');
    setPinError('');
    setPinModalType('');
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPinValue(value);
    if (pinError) {
      setPinError('');
    }
  };

  const confirmarPin = async () => {
    if (pinValue.length !== 4) {
      setPinError('El PIN debe tener 4 dígitos');
      return;
    }

    if (pinModalType === 'edit') {
      await ejecutarEditarInsumo(pinValue);
    }
  };

  // MODIFICAR: handleSubmitEdit ahora solo abre el modal de PIN
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!formData.nombreProducto || !formData.cantidad || !formData.costo) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    // Abrir modal de PIN en lugar de enviar directamente
    abrirModalPin('edit');
  };

  // NUEVA FUNCIÓN: Ejecutar edición de insumo con PIN
  const ejecutarEditarInsumo = async (confirmationCode) => {
    setIsLoading(true);

    try {
      if (!insumoAEditar) {
        throw new Error('No hay insumo seleccionado para editar');
      }

      const cost = parseFloat(formData.costo);
      const cantidadInput = parseFloat(formData.cantidad);

      if (isNaN(cost) || cost < 0) {
        throw new Error('El costo debe ser un número válido mayor o igual a 0');
      }

      if (isNaN(cantidadInput) || cantidadInput < 0) {
        throw new Error('La cantidad debe ser un número válido mayor o igual a 0');
      }

      let stockFinal = cantidadInput;
      let unitFinal = unidadEdit;
      let costFinal = cost;

      if (unidadEdit === "Kilos") {
        stockFinal = cantidadInput * 1000;
        unitFinal = "Gramos";
        costFinal = cost / 1000; // Ajustar costo por gramo
      } else if (unidadEdit === "Litros") {
        stockFinal = cantidadInput * 1000;
        unitFinal = "Mililitros";
        costFinal = cost / 1000; // Ajustar costo por mililitro
      }

      const ingredientData = {
        name: formData.nombreProducto.trim(),
        description: formData.comentarios.trim() || `${pestañaActiva === 'insumos' ? 'Insumo' : pestañaActiva === 'productos' ? 'Producto' : 'Elemento'}: ${formData.nombreProducto.trim()}`,
        cost: costFinal,
        stock: stockFinal,
        unit: pestañaActiva === 'insumos' ? unitFinal : 'Pieza',
        category: insumoAEditar.category || (pestañaActiva === 'insumos' ? 'insumo' : pestañaActiva === 'productos' ? 'producto' : 'otros'),
        confirmation_code: confirmationCode
      };

      const result = await putEditarIngrediente(insumoAEditar.id_ingredient, ingredientData);

      setSuccessModalMessage(`Insumo "${ingredientData.name}" modificado exitosamente`);
      setShowSuccessModal(true);

      // Cerrar modal de PIN primero
      cerrarModalPin();

      // Cerrar modal de edición
      setIsEditProductModalOpen(false);
      setInsumoAEditar(null);
      setInsumosSeleccionados([]);
      setUnidadEdit("Gramos");
      setFormData({
        nombreProducto: "",
        medida: "Gramos",
        cantidad: "",
        costo: "",
        comentarios: ""
      });

      // Recargar la página después de un breve delay para que se vea el modal de éxito
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error al modificar insumo:', error);

      // Verificar si el error es por PIN incorrecto
      if (error.message.includes('confirmation') || error.message.includes('PIN') || error.message.includes('código')) {
        setPinError('PIN incorrecto. Intenta nuevamente.');
      } else {
        cerrarModalPin();
        alert(`Error al modificar insumo: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para ver detalles de un insumo
  const handleVerDetalles = async (insumoId) => {
    setIsLoading(true);
    try {
      const response = await getIngredienteById(insumoId);

      if (!response.success || !response.data) {
        throw new Error('No se pudieron cargar los datos del ingrediente');
      }

      const ingrediente = response.data;
      setInsumoDetalles(ingrediente);
      setIsDetailsModalOpen(true);

    } catch (error) {
      console.error('Error al cargar el ingrediente para ver detalles:', error);
      alert(`Error al cargar los datos del ingrediente: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar la edición de un insumo
  const handleModificarInsumo = async () => {
    if (insumosSeleccionados.length !== 1) {
      alert('Por favor selecciona exactamente un elemento para editar');
      return;
    }

    // Verificar suscripción antes de editar
    if (!hasActiveSubscription) {
      setShowSubscriptionModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const insumoId = insumosSeleccionados[0];

      const response = await getIngredienteById(insumoId);

      if (!response.success || !response.data) {
        throw new Error('No se pudieron cargar los datos del ingrediente');
      }

      const ingrediente = response.data;

      setInsumoAEditar(ingrediente);

      // Convertir las unidades para mostrar en el formulario
      const { cantidad, unidad } = convertirDesdeAPI(ingrediente.stock, ingrediente.unit);

      // Guardar stock inicial para calcular entrada/salida
      setStockInicial(cantidad);

      // Ajustar el costo mostrado según la unidad
      let costoMostrado = ingrediente.cost;
      if (unidad === "Kilos") {
        costoMostrado = ingrediente.cost * 1000; // Mostrar costo por kilo
      } else if (unidad === "Litros") {
        costoMostrado = ingrediente.cost * 1000; // Mostrar costo por litro
      }

      setFormData({
        nombreProducto: ingrediente.name || '',
        medida: ingrediente.unit || 'Gramos',
        cantidad: cantidad.toString(),
        costo: costoMostrado.toString(),
        comentarios: ingrediente.description || '',
        total_cost: ingrediente.total_cost || 0
      });

      setUnidadEdit(unidad);
      setIsEditProductModalOpen(true);

    } catch (error) {
      console.error('Error al cargar el ingrediente para editar:', error);
      alert(`Error al cargar los datos del ingrediente: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para alternar entre unidades en la modal de edición
  const toggleUnidadEdit = () => {
    const cantidadActual = parseFloat(formData.cantidad);
    const costoActual = parseFloat(formData.costo);

    if (unidadEdit === "Gramos") {
      // Convertir de gramos a kilos
      setUnidadEdit("Kilos");
      setFormData(prev => ({
        ...prev,
        cantidad: (cantidadActual / 1000).toString(),
        costo: (costoActual * 1000).toString() // Ajustar costo: de $/gramo a $/kilo
      }));
    } else if (unidadEdit === "Kilos") {
      // Convertir de kilos a gramos
      setUnidadEdit("Gramos");
      setFormData(prev => ({
        ...prev,
        cantidad: (cantidadActual * 1000).toString(),
        costo: (costoActual / 1000).toString() // Ajustar costo: de $/kilo a $/gramo
      }));
    } else if (unidadEdit === "Mililitros") {
      // Convertir de mililitros a litros
      setUnidadEdit("Litros");
      setFormData(prev => ({
        ...prev,
        cantidad: (cantidadActual / 1000).toString(),
        costo: (costoActual * 1000).toString() // Ajustar costo: de $/ml a $/litro
      }));
    } else if (unidadEdit === "Litros") {
      // Convertir de litros a mililitros
      setUnidadEdit("Mililitros");
      setFormData(prev => ({
        ...prev,
        cantidad: (cantidadActual * 1000).toString(),
        costo: (costoActual / 1000).toString() // Ajustar costo: de $/litro a $/ml
      }));
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
      <div className="pt-16">
        {/* Header de Inventarios */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Mi Inventario</h1>
                <p className="text-gray-600 mt-1">Controla y gestiona tus insumos y productos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y botones */}
        <div className="sticky top-16 z-30 bg-white w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 py-4 sm:py-6">{/* Agregado max-w-7xl mx-auto para centrar */}
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
                className={`flex items-center gap-3 px-6 py-3 lg:px-6 lg:py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 transform lg:text-base ${insumosSeleccionados.length === 1 && !isLoading
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
              >
                <FiEdit className="text-lg" />
                <span>
                  {isLoading ? 'Cargando...' :
                    insumosSeleccionados.length === 0 ? `Registrar movimiento` :
                      'Registrar movimiento'}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quitado el contenedor con borde para verse más limpio */}
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
            onVerDetalles={handleVerDetalles}
          />
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
                className="text-gray-400 hover:text-gray-600 transition-colores p-1 rounded-lg hover:bg-gray-100"
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
                    <option value="Piezas">Piezas</option>
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
                  {pestañaActiva === 'insumos' ? 'Cantidad a Añadir' : 'Piezas a Añadir'}
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  placeholder={pestañaActiva === 'insumos' ? "Cantidad" : "Piezas"}
                  min="0.01"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                  onKeyDown={(e) => {
                    // Prevenir letras y algunos caracteres, pero permitir teclas de control
                    if (
                      e.key === '-' ||
                      e.key === 'e' ||
                      e.key === 'E' ||
                      e.key === '+' ||
                      (e.key.length === 1 && /[a-zA-Z]/.test(e.key))
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    // Prevenir pegar texto con letras
                    const pastedText = e.clipboardData.getData('text');
                    if (!/^[0-9.]*$/.test(pastedText)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              {/* Costo por unidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo por unidad (Costo por Kilo, Litro o Pieza)
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
                  onKeyDown={(e) => {
                    // Prevenir letras y algunos caracteres, pero permitir teclas de control
                    if (
                      e.key === '-' ||
                      e.key === 'e' ||
                      e.key === 'E' ||
                      e.key === '+' ||
                      (e.key.length === 1 && /[a-zA-Z]/.test(e.key))
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    // Prevenir pegar texto con letras
                    const pastedText = e.clipboardData.getData('text');
                    if (!/^[0-9.]*$/.test(pastedText)) {
                      e.preventDefault();
                    }
                  }}
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

              {/* Botón Guardar */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${isLoading
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
                className="text-gray-400 hover:text-gray-600 transition-colores p-1 rounded-lg hover:bg-gray-100"
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

              {/* Cantidad con botón de conversión - En modal de editar */}
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
                    onKeyDown={(e) => {
                      // Prevenir letras y algunos caracteres, pero permitir teclas de control
                      if (
                        e.key === '-' ||
                        e.key === 'e' ||
                        e.key === 'E' ||
                        e.key === '+' ||
                        (e.key.length === 1 && /[a-zA-Z]/.test(e.key))
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      // Prevenir pegar texto con letras
                      const pastedText = e.clipboardData.getData('text');
                      if (!/^[0-9.]*$/.test(pastedText)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {/* Botón de conversión - Solo para insumos con unidades convertibles (excepto Piezas) */}
                  {pestañaActiva === 'insumos' &&
                    formData.medida !== "Piezas" &&
                    (unidadEdit === "Gramos" || unidadEdit === "Kilos" ||
                      unidadEdit === "Mililitros" || unidadEdit === "Litros") && (
                      <button
                        type="button"
                        onClick={toggleUnidadEdit}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1 text-sm"
                        title={`Cambiar a ${unidadEdit === "Gramos" ? "Kilos" :
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
                {pestañaActiva === 'insumos' && formData.medida !== "Piezas" && (
                  <p className="text-xs text-gray-500 mt-1">
                    {unidadEdit === "Kilos" && "1 kilo = 1000 gramos"}
                    {unidadEdit === "Litros" && "1 litro = 1000 mililitros"}
                    {unidadEdit === "Gramos" && "Unidad base: gramos"}
                    {unidadEdit === "Mililitros" && "Unidad base: mililitros"}
                  </p>
                )}
              </div>

              {/* Costo por pieza - En modal de editar */}
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
                  onKeyDown={(e) => {
                    // Prevenir letras y algunos caracteres, pero permitir teclas de control
                    if (
                      e.key === '-' ||
                      e.key === 'e' ||
                      e.key === 'E' ||
                      e.key === '+' ||
                      (e.key.length === 1 && /[a-zA-Z]/.test(e.key))
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    // Prevenir pegar texto con letras
                    const pastedText = e.clipboardData.getData('text');
                    if (!/^[0-9.]*$/.test(pastedText)) {
                      e.preventDefault();
                    }
                  }}
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

              {/* Registro de Inventario - Campo calculado automáticamente */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registro de Inventario
                </label>
                <input
                  type="text"
                  value={
                    formData.cantidad && stockInicial
                      ? parseFloat(formData.cantidad) > stockInicial
                        ? 'Entrada'
                        : parseFloat(formData.cantidad) < stockInicial
                          ? 'Salida'
                          : 'Sin cambios'
                      : 'Sin cambios'
                  }
                  readOnly
                  className={`w-full border border-gray-300 rounded-lg p-3 font-semibold focus:outline-none ${formData.cantidad && stockInicial
                    ? parseFloat(formData.cantidad) > stockInicial
                      ? 'bg-green-50 text-green-700'
                      : parseFloat(formData.cantidad) < stockInicial
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    : 'bg-gray-100 text-gray-600'
                    } cursor-not-allowed`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este campo se calcula automáticamente según la cantidad modificada
                </p>
              </div>

              {/* Botón Guardar */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    } text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <MdInventory className="text-lg" />
                      Registrar Movimiento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalles (Solo lectura) */}
      {isDetailsModalOpen && insumoDetalles && (
        <div
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setIsDetailsModalOpen(false);
            setInsumoDetalles(null);
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <IoEyeOutline className="text-2xl" />
                Detalles del {pestañaActiva === 'insumos' ? 'Insumo' :
                  pestañaActiva === 'productos' ? 'Producto' : 'Elemento'}
              </h2>
              <button
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setInsumoDetalles(null);
                }}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/20"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre
                </label>
                <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 font-medium">
                  {insumoDetalles.name}
                </div>
              </div>

              {/* Unidad - Solo para insumos */}
              {pestañaActiva === 'insumos' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unidad
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800">
                    {insumoDetalles.unit}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Actual
                </label>
                <div className={`w-full border border-gray-300 rounded-lg p-3 font-semibold ${insumoDetalles.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                  {(() => {
                    const { cantidad, unidad } = convertirDesdeAPI(insumoDetalles.stock, insumoDetalles.unit);
                    return `${cantidad} ${unidad}`;
                  })()}
                </div>
              </div>

              {/* Costo por unidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo por unidad (Costo por Kilo, Litro o Pieza)
                </label>
                <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-green-600 font-semibold">
                  ${(insumoDetalles.cost || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Costo Total */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo Total
                </label>
                <div className="w-full border border-gray-300 rounded-lg p-3 bg-green-50 text-green-700 font-bold text-lg">
                  ${(insumoDetalles.total_cost || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                </div>
              </div>

              {/* Descripción/Comentarios */}
              {insumoDetalles.description && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800">
                    {insumoDetalles.description}
                  </div>
                </div>
              )}

              {/* Botón Cerrar */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setInsumoDetalles(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <IoClose className="text-lg" />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NUEVO: Modal de PIN */}
      {isPinModalOpen && (
        <div
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[60] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cerrarModalPin();
            }
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Ingresa PIN de Inventario</h2>
              <button
                onClick={cerrarModalPin}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colores p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-center mb-4">
                Ingresa tu PIN de 4 dígitos para confirmar la operación
              </p>

              {/* Input PIN */}
              <div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="4"
                  value={pinValue}
                  onChange={handlePinChange}
                  placeholder="••••"
                  disabled={isLoading}
                  className={`w-full border ${pinError ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 ${pinError ? 'focus:ring-red-500' : 'focus:ring-green-500'} focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  autoFocus
                />

                {/* Indicador de dígitos */}
                <div className="flex justify-center gap-2 mt-3">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${pinValue.length >= index
                        ? 'bg-green-500 scale-110'
                        : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>

                {/* Error message */}
                {pinError && (
                  <p className="text-red-500 text-sm mt-2 text-center">{pinError}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModalPin}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarPin}
                  disabled={pinValue.length !== 4 || isLoading}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${pinValue.length === 4 && !isLoading
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Procesando...
                    </div>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>
            </div>
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