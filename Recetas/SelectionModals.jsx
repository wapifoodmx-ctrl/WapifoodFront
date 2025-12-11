import { IoClose } from "react-icons/io5";

export function SelectSuppliesModal({
  isOpen,
  onClose,
  insumos,
  insumosSeleccionados,
  terminoBusqueda,
  isLoading,
  onSearchChange,
  onToggleInsumo
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const insumosFiltrados = insumos.filter(insumo =>
    insumo.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    insumo.description.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-60 p-4"
      onClick={handleBackdropClick}
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
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Barra de búsqueda */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Buscar insumo..."
              value={terminoBusqueda}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>

          {/* Lista de insumos */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                <span className="ml-3 text-gray-600">Cargando insumos...</span>
              </div>
            ) : insumosFiltrados.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p>
                  {terminoBusqueda 
                    ? "No se encontraron insumos con ese nombre" 
                    : "No hay insumos disponibles"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insumosFiltrados.map((insumo) => (
                  <div
                    key={insumo.id_ingredient}
                    onClick={() => onToggleInsumo(insumo.id_ingredient)}
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
          {!isLoading && insumosFiltrados.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
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
  );
}

export function SelectProductModal({
  isOpen,
  onClose,
  products,
  recetas,
  terminoBusqueda,
  isLoading,
  onSearchChange,
  onSelectProduct
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const productosDisponibles = products.filter(product => {
    // Verificar si tiene CUALQUIER receta (visible o de inventario)
    // Si ya fue dado de alta en inventario O tiene receta visible, NO mostrarlo
    const tieneAlgunaReceta = recetas.some(receta => receta.product_id === product.id_products);
    
    
    return !tieneAlgunaReceta;
  });

  const productosFiltrados = productosDisponibles.filter(product =>
    product.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    product.description.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    product.nombre_categoria.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-60 p-4"
      onClick={handleBackdropClick}
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
            onClick={onClose}
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
              value={terminoBusqueda}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* Lista de productos */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Cargando productos...</span>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p>
                  {terminoBusqueda 
                    ? "No se encontraron productos con ese nombre" 
                    : "No hay productos disponibles"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productosFiltrados.map((product) => (
                  <div
                    key={product.id_products}
                    onClick={() => onSelectProduct(product)}
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
  );
}

export function SubscriptionModal({
  isOpen,
  countdown,
  onGoToPayments
}) {
  if (!isOpen) return null;

  return (
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
            onClick={onGoToPayments}
            className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
          >
            Ir a Pagos Ahora
          </button>
        </div>
      </div>
    </div>
  );
}