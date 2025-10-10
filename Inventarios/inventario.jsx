import { LiaFilterSolid } from "react-icons/lia";
import { IoAddOutline, IoClose, IoEyeOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import Navbar from "@/dashboardComponents/navbar";
import NavegacionPestañas from "@/Inventarios/navegaciónPestañas";
import { useState, useEffect } from "react";
import { postInventarioIngredientes } from "@/useCases/postInventarioIngredientes";
import getIngredientesInventario from "@/useCases/getIngredientesInventario";
import { getIngredienteById } from "@/useCases/getIngredienteId";
import putEditarIngrediente from "@/useCases/putEditarIngrediente";

export default function Inventario() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState('insumos');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [vistaActiva, setVistaActiva] = useState('cards'); // 'cards' o 'lista'
  const [insumos, setInsumos] = useState([]); // Estado para almacenar insumos creados
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [insumoAEditar, setInsumoAEditar] = useState(null);
  const [formData, setFormData] = useState({
    nombreProducto: "",
    medida: "Gramos",
    cantidad: "",
    costo: "",
    comentarios: "",
    categoriaAdicional: "No"
  });

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
          description: ingrediente.description
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Solo procesar si estamos en la pestaña de insumos
      if (pestañaActiva === 'insumos') {
        // Mapear los datos del formulario al formato de la API
        const ingredientData = {
          name: formData.nombreProducto,
          description: formData.comentarios || `Insumo: ${formData.nombreProducto}`,
          cost: parseFloat(formData.costo),
          stock: parseInt(formData.cantidad),
          unit: formData.medida
        };

        // Llamar a la API
        const result = await postInventarioIngredientes(ingredientData);
        
        console.log("Insumo creado exitosamente:", result);
        alert("Insumo agregado exitosamente");
        
        // Recargar la lista de ingredientes para mostrar el nuevo
        await cargarIngredientes();
        
      } else {
        // Para productos y otros, solo mostrar en consola por ahora
        console.log("Producto a guardar:", formData);
      }

      // Cerrar modal y resetear formulario
      setIsAddProductModalOpen(false);
      setFormData({
        nombreProducto: "",
        medida: "Gramos",
        cantidad: "",
        costo: "",
        comentarios: "",
        categoriaAdicional: "No"
      });

    } catch (error) {
      console.error("Error al crear insumo:", error);
      alert(`Error al agregar insumo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModificarInsumo = async () => {
    // Verificar que solo hay un insumo seleccionado
    if (insumosSeleccionados.length !== 1) {
      if (insumosSeleccionados.length === 0) {
        alert('Por favor selecciona un insumo para modificar');
      } else {
        alert('Solo puedes modificar un insumo a la vez');
      }
      return;
    }

    setIsLoading(true);
    try {
      const ingredienteId = insumosSeleccionados[0];
      console.log("ID seleccionado:", ingredienteId);
      console.log("Cargando ingrediente con ID:", ingredienteId);
      
      const response = await getIngredienteById(ingredienteId);
      console.log("Respuesta completa de la API:", response);
      
      // La respuesta puede venir directamente o dentro de response.data
      const ingrediente = response.data || response;
      
      if (ingrediente) {
        console.log("Datos del ingrediente:", ingrediente);
        setInsumoAEditar(ingrediente);
        
        // Llenar el formulario con los datos del ingrediente
        setFormData({
          nombreProducto: ingrediente.name || "",
          medida: ingrediente.unit || "Gramos",
          cantidad: ingrediente.stock?.toString() || "",
          costo: ingrediente.cost?.toString() || "",
          comentarios: ingrediente.description || "",
          categoriaAdicional: "No"
        });
        
        setIsEditProductModalOpen(true);
      } else {
        throw new Error('No se pudieron cargar los datos del ingrediente');
      }
    } catch (error) {
      console.error("Error completo:", error);
      alert(`Error al cargar el ingrediente: ${error.message}`);
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

      // Validar que los campos numéricos sean válidos
      const cost = parseFloat(formData.costo);
      const stock = parseInt(formData.cantidad);

      if (isNaN(cost) || cost < 0) {
        throw new Error('El costo debe ser un número válido mayor o igual a 0');
      }

      if (isNaN(stock) || stock < 0) {
        throw new Error('La cantidad debe ser un número válido mayor o igual a 0');
      }

      const ingredientData = {
        name: formData.nombreProducto.trim(),
        description: formData.comentarios.trim() || `Insumo: ${formData.nombreProducto.trim()}`,
        cost: cost,
        stock: stock,
        unit: formData.medida
      };

      console.log('=== DATOS PREPARADOS PARA ENVIAR ===');
      console.log('ID del ingrediente:', insumoAEditar.id_ingredient);
      console.log('Datos del ingrediente:', ingredientData);

      // Verificar conectividad antes de enviar
      try {
        const testResponse = await fetch('http://192.168.1.69:8001/health', { method: 'GET' });
        console.log('Test de conectividad:', testResponse.status);
      } catch (testError) {
        console.error('Error de conectividad:', testError);
        throw new Error('No se puede conectar con el servidor. Verifica que esté ejecutándose.');
      }

      console.log('=== LLAMANDO A LA API ===');
      const result = await putEditarIngrediente(insumoAEditar.id_ingredient, ingredientData);
      
      console.log('=== RESULTADO EXITOSO ===');
      console.log('Resultado:', result);
      
      // Mostrar mensaje de éxito más específico
      alert(`Insumo "${ingredientData.name}" modificado exitosamente`);
      
      // Recargar la lista de ingredientes
      await cargarIngredientes();
      
      // Cerrar modal y resetear
      setIsEditProductModalOpen(false);
      setInsumoAEditar(null);
      setInsumosSeleccionados([]);
      setFormData({
        nombreProducto: "",
        medida: "Gramos",
        cantidad: "",
        costo: "",
        comentarios: "",
        categoriaAdicional: "No"
      });

    } catch (error) {
      console.error('=== ERROR EN HANDLE SUBMIT EDIT ===');
      console.error('Error completo:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Error desconocido al modificar insumo';
      
      if (error.message.includes('conectar') || error.message.includes('fetch') || error.message.includes('NetworkError')) {
        errorMessage = `Error de conexión: ${error.message}. Verifica que el servidor esté ejecutándose en http://192.168.1.69:8001`;
      } else {
        errorMessage = `Error al modificar insumo: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
              placeholder={textos.buscar}
              className="border border-gray-300 rounded-lg p-3 w-full lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-1/2 lg:justify-center lg:items-center">
              {/* Botón Añadir */}
              <button 
                onClick={() => setIsAddProductModalOpen(true)}
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
                   insumosSeleccionados.length === 0 ? 'Selecciona un insumo' :
                   insumosSeleccionados.length > 1 ? 'Solo un insumo' :
                   textos.modificar}
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
        </div>

        {/* Navegación de pestañas y contenido */}
        <div className="px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Solo la navegación */}
            <NavegacionPestañas 
              pestañaActiva={pestañaActiva} 
              cambiarPestaña={setPestañaActiva}
              insumos={insumos}
              isLoadingData={isLoadingData}
              vistaActiva={vistaActiva}
              insumosSeleccionados={insumosSeleccionados}
              setInsumosSeleccionados={setInsumosSeleccionados}
            />
          </div>
        </div>
      </div>

      {/* Modal Agregar Producto */}
      {isAddProductModalOpen && (
        <div 
          className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
          onClick={() => setIsAddProductModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{textos.titulo}</h2>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
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
                    <option value="Tazas">Tazas</option>
                    <option value="Cucharada (tbsp)">Cucharada (tbsp)</option>
                    <option value="Cucharadita (tsp)">Cucharadita (tsp)</option>
                  </select>
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
                  min="1"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
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
            setInsumosSeleccionados([]);
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Editar Insumo</h2>
              <button
                onClick={() => {
                  setIsEditProductModalOpen(false);
                  setInsumoAEditar(null);
                  setInsumosSeleccionados([]);
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
                  Editar Insumo
                </label>
                <input
                  type="text"
                  name="nombreProducto"
                  value={formData.nombreProducto}
                  onChange={handleInputChange}
                  placeholder="Nombre del insumo"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Medidas */}
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
                  <option value="Tazas">Tazas</option>
                  <option value="Cucharada (tbsp)">Cucharada (tbsp)</option>
                  <option value="Cucharadita (tsp)">Cucharadita (tsp)</option>
                </select>
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  placeholder="Cantidad"
                  min="1"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
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

              {/* Categoría Adicional */}
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

              {/* Botón Editar */}
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
                      Editar Insumo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}