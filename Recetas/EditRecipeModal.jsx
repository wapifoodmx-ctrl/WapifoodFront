import { IoClose } from "react-icons/io5";

export default function EditRecipeModal({
  isOpen,
  onClose,
  editingRecipe,
  recipeName,
  insumosSeleccionados,
  insumos,
  cantidadesInsumos,
  isLoadingRecipeDetails,
  isSubmittingRecipe,
  errorMessage,
  successMessage,
  onRecipeNameChange,
  onSelectSupplies,
  onUpdateRecipe,
  onCantidadChange,
  onRemoveIngredient
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
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
            onClick={onClose}
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
                  onChange={(e) => onRecipeNameChange(e.target.value)}
                  placeholder="Nombre de la receta..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                />
              </div>

              {/* Botón seleccionar insumos adicionales */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={onSelectSupplies}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
                >
                  Agregar Más Insumos {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length} total)`}
                </button>
              </div>
              
              {/* Botón Guardar */}
              <button
                onClick={onUpdateRecipe}
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
                              onChange={(e) => onCantidadChange(ingredientId, e.target.value)}
                              className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                          <button
                            onClick={() => onRemoveIngredient(ingredientId)}
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
            onClick={onClose}
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
                onChange={(e) => onRecipeNameChange(e.target.value)}
                placeholder="Nombre de la receta..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>

            {/* Botón seleccionar insumos adicionales */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={onSelectSupplies}
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
                            onChange={(e) => onCantidadChange(ingredientId, e.target.value)}
                            className="w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                        </div>
                        <button
                          onClick={() => onRemoveIngredient(ingredientId)}
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
              onClick={onUpdateRecipe}
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
  );
}