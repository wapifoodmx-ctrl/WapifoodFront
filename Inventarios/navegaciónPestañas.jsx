import { useState } from "react";
import { IoSwapHorizontalOutline, IoChevronDownOutline, IoChevronUpOutline, IoEyeOutline } from "react-icons/io5";

const NavegacionPestañas = ({
  pestañaActiva,
  cambiarPestaña,
  insumos = [],
  isLoadingData = false,
  vistaActiva = 'cards',
  insumosSeleccionados = [],
  setInsumosSeleccionados,
  terminoBusqueda = '',
  filtrarPorBusqueda,
  onVerDetalles
}) => {
  const [insumoExpandido, setInsumoExpandido] = useState(null);
  // Estado para controlar la visualización de unidades por cada card
  const [unidadesVisualizacion, setUnidadesVisualizacion] = useState({});

  // Función para convertir desde la API a unidades de visualización
  const convertirDesdeAPI = (stock, unit) => {
    // Normalizar a número
    const stockNum = Number(stock);

    const formatDivided = (value) => {
      const divided = value / 1000;
      return parseFloat(divided.toFixed(3));
    };

    switch (unit) {
      case "Gramos":
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

  // Función para alternar la visualización de unidades de un elemento específico
  const toggleUnidadVisualizacion = (elementoId) => {
    setUnidadesVisualizacion(prev => ({
      ...prev,
      [elementoId]: !prev[elementoId]
    }));
  };

  // Función para filtrar elementos según la pestaña activa
  const filtrarElementosPorPestaña = (elementos, pestaña) => {
    switch (pestaña) {
      case 'insumos':
        return elementos.filter(elemento =>
          elemento.category === 'insumo' ||
          elemento.category === 'insumos' ||
          !elemento.category
        );
      case 'productos':
        return elementos.filter(elemento =>
          elemento.category === 'producto' ||
          elemento.category === 'productos'
        );
      default:
        return elementos;
    }
  };

  // Obtener elementos filtrados para la pestaña actual
  let elementosFiltrados = filtrarElementosPorPestaña(insumos, pestañaActiva);

  // Aplicar filtro de búsqueda si existe
  if (terminoBusqueda && filtrarPorBusqueda) {
    elementosFiltrados = filtrarPorBusqueda(elementosFiltrados, terminoBusqueda);
  }

  const toggleSeleccionInsumo = (insumoId) => {
    setInsumosSeleccionados(prev => {
      // Si el insumo ya está seleccionado, deseleccionarlo
      if (prev.includes(insumoId)) {
        return [];
      } else {
        // Si no está seleccionado, seleccionar solo este (reemplazar cualquier selección anterior)
        return [insumoId];
      }
    });
  };

  const toggleExpandirInsumo = (insumoId) => {
    setInsumoExpandido(prev => prev === insumoId ? null : insumoId);
  };

  const renderVistaCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {elementosFiltrados.map((elemento) => {
        // Determinar si mostrar en unidad base o convertida
        const mostrarEnUnidadBase = unidadesVisualizacion[elemento.id] || false;

        // Convertir unidades para visualización
        const { cantidad, unidad } = convertirDesdeAPI(elemento.stock, elemento.unit);

        // Determinar qué mostrar
        const stockMostrado = mostrarEnUnidadBase ? elemento.stock : cantidad;
        const unidadMostrada = mostrarEnUnidadBase ? elemento.unit : unidad;

        return (
          <div
            key={elemento.id}
            className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${insumosSeleccionados.includes(elemento.id)
              ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200'
              : 'border-gray-200 hover:border-gray-300'
              }`}
            onClick={() => toggleSeleccionInsumo(elemento.id)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (onVerDetalles) {
                onVerDetalles(elemento.id);
              }
            }}
          >
            {/* Header con checkbox y botón de ver detalles */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${insumosSeleccionados.includes(elemento.id)
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-400'
                  }`}>
                  {insumosSeleccionados.includes(elemento.id) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Botón de ver detalles */}
                {onVerDetalles && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onVerDetalles(elemento.id);
                    }}
                    className="p-1 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                    title="Ver detalles"
                  >
                    <IoEyeOutline className="text-lg" />
                  </button>
                )}
              </div>

              {/* Estado visual */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${elemento.stock > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
                }`}>
                {elemento.stock > 0 ? 'Disponible' : 'Agotado'}
              </div>
            </div>

            {/* Información del elemento */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 text-lg leading-tight line-clamp-2">
                {elemento.name}
              </h3>

              {/* Stock y Costo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm px-2 py-1 rounded ${elemento.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {stockMostrado} {unidadMostrada}
                      </span>
                      {/* Botón de conversión para unidades convertibles (excepto Piezas) */}
                      {(elemento.unit === "Gramos" || elemento.unit === "Mililitros") && elemento.unit !== "Piezas" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleUnidadVisualizacion(elemento.id);
                          }}
                          className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors flex items-center gap-1"
                          title={`Ver en ${mostrarEnUnidadBase
                            ? (elemento.unit === "Gramos" ? "kilos" : "litros")
                            : (elemento.unit === "Gramos" ? "gramos" : "mililitros")
                            }`}
                        >
                          <IoSwapHorizontalOutline className="text-xs" />
                          {mostrarEnUnidadBase
                            ? (elemento.unit === "Gramos" ? "Kg" : "L")
                            : (elemento.unit === "Gramos" ? "g" : "ml")
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Costo por unidad:</span>
                  <span className="font-medium text-green-600">${elemento.cost} MXN</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Costo total:</span>
                  <span className="font-bold text-green-700">${elemento.total_cost} MXN</span>
                </div>
              </div>

            </div>

            {/* Indicador de selección */}
            {insumosSeleccionados.includes(elemento.id) && (
              <div className="mt-3 py-2 px-3 bg-green-100 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-700 text-center">
                  ✓ Seleccionado
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderVistaLista = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Seleccionar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Costo Unitario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Costo Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {elementosFiltrados.map((elemento) => {
            // Determinar si mostrar en unidad base o convertida
            const mostrarEnUnidadBase = unidadesVisualizacion[elemento.id] || false;

            // Convertir unidades para visualización
            const { cantidad, unidad } = convertirDesdeAPI(elemento.stock, elemento.unit);

            // Determinar qué mostrar
            const stockMostrado = mostrarEnUnidadBase ? elemento.stock : cantidad;
            const unidadMostrada = mostrarEnUnidadBase ? elemento.unit : unidad;

            return (
              <tr
                key={elemento.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${insumosSeleccionados.includes(elemento.id) ? 'bg-green-50' : ''
                  }`}
                onClick={() => toggleSeleccionInsumo(elemento.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${insumosSeleccionados.includes(elemento.id)
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-400'
                    }`}>
                    {insumosSeleccionados.includes(elemento.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {elemento.name}
                    </div>
                    {elemento.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {elemento.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium px-2 py-1 rounded ${elemento.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {stockMostrado} {unidadMostrada}
                    </span>
                    {/* Botón de conversión para unidades convertibles en vista lista (excepto Piezas) */}
                    {(elemento.unit === "Gramos" || elemento.unit === "Mililitros") && elemento.unit !== "Piezas" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUnidadVisualizacion(elemento.id);
                        }}
                        className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors flex items-center gap-1"
                        title={`Ver en ${mostrarEnUnidadBase
                          ? (elemento.unit === "Gramos" ? "kilos" : "litros")
                          : (elemento.unit === "Gramos" ? "gramos" : "mililitros")
                          }`}
                      >
                        <IoSwapHorizontalOutline className="text-xs" />
                        {mostrarEnUnidadBase
                          ? (elemento.unit === "Gramos" ? "Kg" : "L")
                          : (elemento.unit === "Gramos" ? "g" : "ml")
                        }
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${elemento.cost} MXN
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  ${elemento.total_cost} MXN
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${elemento.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {elemento.stock > 0 ? 'Disponible' : 'Agotado'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full">
      {/* Pestañas de navegación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { key: 'insumos', label: 'Insumos', count: filtrarElementosPorPestaña(insumos, 'insumos').length },
            { key: 'productos', label: 'Productos', count: filtrarElementosPorPestaña(insumos, 'productos').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => cambiarPestaña(tab.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${pestañaActiva === tab.key
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 py-1 px-2 rounded-full text-xs ${pestañaActiva === tab.key
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="p-6">
        {isLoadingData ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <span className="ml-4 text-lg text-gray-600">Cargando {pestañaActiva}...</span>
          </div>
        ) : elementosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg">
              {terminoBusqueda ? (
                <>
                  <p className="mb-2">No se encontraron {pestañaActiva} con "{terminoBusqueda}"</p>
                  <button
                    onClick={() => filtrarPorBusqueda && filtrarPorBusqueda([], '')}
                    className="text-green-500 hover:text-green-600 font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <p>No hay {pestañaActiva} disponibles</p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Contador de resultados */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 capitalize">
                {pestañaActiva} {terminoBusqueda && `- "${terminoBusqueda}"`}
              </h2>
              <span className="text-sm text-gray-500">
                {elementosFiltrados.length} {pestañaActiva} encontrado{elementosFiltrados.length !== 1 ? 's' : ''}
                {insumosSeleccionados.length > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    ({insumosSeleccionados.length} seleccionado{insumosSeleccionados.length !== 1 ? 's' : ''})
                  </span>
                )}
              </span>
            </div>

            {/* Renderizar vista según la selección */}
            {vistaActiva === 'cards' ? renderVistaCards() : renderVistaLista()}
          </>
        )}
      </div>
    </div>
  );
};

export default NavegacionPestañas;