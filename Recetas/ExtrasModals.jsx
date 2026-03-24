import { IoClose, IoAddOutline } from "react-icons/io5";

// Modal para seleccionar insumos
export const SelectExtrasIngredientsModal = ({
  isOpen,
  onClose,
  insumos,
  insumosSeleccionados,
  terminoBusqueda,
  isLoading,
  onSearchChange,
  onToggleInsumo,
}) => {
  if (!isOpen) return null;

  const insumosFiltrados = insumos?.filter(insumo =>
    insumo.name.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[70] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Seleccionar Insumos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Buscar insumo..."
            value={terminoBusqueda}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
            </div>
          ) : insumosFiltrados?.length > 0 ? (
            <div className="space-y-2">
              {insumosFiltrados.map((insumo) => (
                <label
                  key={insumo.id_ingredient}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    checked={insumosSeleccionados.includes(insumo.id_ingredient)}
                    onChange={() => onToggleInsumo(insumo.id_ingredient)}
                    className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{insumo.name}</div>
                    <div className="text-sm text-gray-500">
                      Unidad: {insumo.unit || 'No especificada'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No se encontraron insumos
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg"
          >
            Aceptar ({insumosSeleccionados.length})
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal principal para agregar extras
export const AddExtrasModal = ({
  isOpen,
  onClose,
  receta,
  extrasExistentes,
  insumosSeleccionados,
  insumos,
  cantidadesExtras,
  preciosExtras,
  isSubmitting,
  errorMessage,
  successMessage,
  onSelectExtrasIngredients,
  onCantidadChange,
  onPrecioChange,
  onSaveExtras,
  onRemoveIngredient,
}) => {
  if (!isOpen) return null;

  const getUnitLabel = (ingredientId) => {
    const insumo = insumos?.find(i => i.id_ingredient === ingredientId);
    if (!insumo) return '';

    const unit = insumo.unit?.toLowerCase();
    if (unit === 'gramos' || unit === 'gramo' || unit === 'grams' || unit === 'gram' || unit === 'g') {
      return 'Gramos';
    } else if (unit === 'mililitros' || unit === 'mililitro' || unit === 'milliliters' || unit === 'milliliter' || unit === 'ml') {
      return 'Mililitros';
    } else if (unit === 'piezas' || unit === 'pieza' || unit === 'pieces' || unit === 'piece' || unit === 'pz') {
      return 'Piezas';
    }
    return insumo.unit || 'Unidad';
  };

  const getIngredientName = (ingredientId) => {
    const insumo = insumos?.find(i => i.id_ingredient === ingredientId);
    return insumo?.name || 'Ingrediente';
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-[60] p-4"
      onClick={handleBackdropClick}
    >
      {/* Desktop - Modal más ancho con dos columnas */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto hidden lg:block">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Agregar Extras</h2>
            <p className="text-sm text-gray-600 mt-1">{receta?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Contenido Desktop - Dos columnas */}
        <div className="p-6 flex gap-6">
          {/* Columna izquierda - Formulario */}
          <div className="w-1/2 space-y-6">
            {/* Botón elegir extras */}
            <button
              onClick={onSelectExtrasIngredients}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
            >
              <IoAddOutline className="text-xl" />
              <span>Elegir Extras {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length})`}</span>
            </button>

            {/* Extras existentes - Solo mostrar si NO hay nada seleccionado aún */}
            {extrasExistentes && extrasExistentes.length > 0 && insumosSeleccionados.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Extras Actuales</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {extrasExistentes.map((extra) => (
                    <div
                      key={extra.id_extra}
                      className="p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="font-semibold text-gray-800 text-sm">{extra.ingredient_name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Cantidad: {extra.quantity} {extra.unit} | Precio: ${extra.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón Guardar */}
            {insumosSeleccionados.length > 0 && (
              <button
                onClick={onSaveExtras}
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Extras'}
              </button>
            )}

            {/* Mensajes */}
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

          {/* Columna derecha - Extras seleccionados */}
          <div className="w-1/2 border-l border-gray-200 pl-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Extras ({insumosSeleccionados.length})
            </h3>

            {insumosSeleccionados.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Selecciona insumos para agregar como extras</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {insumosSeleccionados.map((ingredientId) => (
                  <div
                    key={ingredientId}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-gray-800 text-sm">
                        {getIngredientName(ingredientId)}
                      </div>
                      <button
                        onClick={() => onRemoveIngredient(ingredientId)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Eliminar extra"
                      >
                        <IoClose className="text-lg" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Input de cantidad */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Cantidad ({getUnitLabel(ingredientId)})
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={cantidadesExtras[ingredientId] || ''}
                          onChange={(e) => onCantidadChange(ingredientId, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Input de precio */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                          Precio ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={preciosExtras[ingredientId] || ''}
                          onChange={(e) => onPrecioChange(ingredientId, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile - Modal original con lista debajo */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Agregar Extras</h2>
            <p className="text-sm text-gray-600">{receta?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Contenido Mobile */}
        <div className="p-6 space-y-6">
          {/* Botón elegir extras */}
          <button
            onClick={onSelectExtrasIngredients}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
          >
            <IoAddOutline className="text-xl" />
            <span>Elegir Extras {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length})`}</span>
          </button>

          {/* Extras existentes - Solo mostrar si NO hay nada seleccionado aún */}
          {extrasExistentes && extrasExistentes.length > 0 && insumosSeleccionados.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Extras Actuales</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {extrasExistentes.map((extra) => (
                  <div
                    key={extra.id_extra}
                    className="p-2 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="font-medium text-gray-800 text-xs">{extra.ingredient_name}</div>
                    <div className="text-xs text-gray-600">
                      {extra.quantity} {extra.unit} • ${extra.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de extras */}
          {insumosSeleccionados.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Extras ({insumosSeleccionados.length})
              </h3>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {insumosSeleccionados.map((ingredientId) => (
                  <div
                    key={ingredientId}
                    className="bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-800 flex-1 pr-2">
                        {getIngredientName(ingredientId)}
                      </div>
                      <button
                        onClick={() => onRemoveIngredient(ingredientId)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 flex-shrink-0"
                        title="Eliminar"
                      >
                        <IoClose className="text-lg" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Input de cantidad */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Cantidad ({getUnitLabel(ingredientId)})
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={cantidadesExtras[ingredientId] || ''}
                          onChange={(e) => onCantidadChange(ingredientId, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Input de precio */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Precio ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={preciosExtras[ingredientId] || ''}
                          onChange={(e) => onPrecioChange(ingredientId, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Mobile */}
        <div className="p-6 border-t border-gray-200">
          {insumosSeleccionados.length > 0 && (
            <button
              onClick={onSaveExtras}
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Extras'}
            </button>
          )}

          {/* Mensajes */}
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
  );
};
