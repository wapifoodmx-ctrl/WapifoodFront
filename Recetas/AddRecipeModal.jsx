import { IoClose, IoAddOutline } from "react-icons/io5";
import { useState, useCallback, useRef, useMemo, memo } from "react";

// Mover QuantityInput fuera del componente principal y usar memo
const QuantityInput = memo(({ ingredientId, cantidadesInsumos, unitsInKg, onCantidadChange, toggleUnit, className = "" }) => {
  const inputRef = useRef(null);
  const isKg = unitsInKg[ingredientId];
  const currentValue = cantidadesInsumos[ingredientId] || '';
  
  const handleChange = (e) => {
    let value = e.target.value;

    if (value === '') {
      onCantidadChange(ingredientId, '');
      return;
    }

    // Soporte para coma como separador decimal
    value = value.replace(',', '.');

    // Permitir números con decimales
    if (/^\d*\.?\d*$/.test(value)) {
      const isKg = unitsInKg[ingredientId];

      // Validar decimales según la unidad
      if (value.includes('.')) {
        const [, decimals = ''] = value.split('.');
        const maxDecimals = isKg ? 3 : 2;
        if (decimals.length > maxDecimals) return;
      }

      onCantidadChange(ingredientId, value);
    }
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
      'Home', 'End', 'Tab', 'Enter', 'Escape'
    ];
    
    if (allowedKeys.includes(e.key)) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
      }
      return;
    }

    if (!/[\d.,]/.test(e.key)) {
      e.preventDefault();
      return;
    }

    if ((e.key === '.' || e.key === ',') && e.target.value.includes('.')) {
      e.preventDefault();
      return;
    }
  };

  const handleToggleUnit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleUnit(ingredientId);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  
  return (
    <div className="flex items-center gap-1">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 pr-6 ${className}`}
          autoComplete="off"
          maxLength="10"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 pointer-events-none select-none">
          {isKg ? 'kg' : 'g'}
        </span>
      </div>
      <button
        onClick={handleToggleUnit}
        type="button"
        className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold transition-colors flex-shrink-0"
        title={isKg ? "Convertir a gramos" : "Convertir a kilos"}
      >
        {isKg ? 'g' : 'kg'}
      </button>
    </div>
  );
});

QuantityInput.displayName = 'QuantityInput';

export default function AddRecipeModal({
  isOpen,
  onClose,
  selectedProduct,
  insumosSeleccionados,
  insumos,
  cantidadesInsumos,
  isSubmittingRecipe,
  errorMessage,
  successMessage,
  onSelectProduct,
  onSelectSupplies,
  onSaveRecipe,
  onCantidadChange,
  onRemoveIngredient
}) {
  const [unitsInKg, setUnitsInKg] = useState({});

  const toggleUnit = useCallback((ingredientId) => {
    const currentValue = parseFloat(cantidadesInsumos[ingredientId]) || 0;
    const isCurrentlyKg = unitsInKg[ingredientId];

    if (isCurrentlyKg) {
      const gramos = currentValue * 1000;
      onCantidadChange(ingredientId, gramos.toString());
    } else {
      const kilos = currentValue / 1000;
      onCantidadChange(ingredientId, kilos.toFixed(3));
    }

    setUnitsInKg(prev => ({
      ...prev,
      [ingredientId]: !isCurrentlyKg
    }));
  }, [cantidadesInsumos, unitsInKg, onCantidadChange]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      {/* Desktop - Modal más ancho con dos columnas */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto hidden lg:block">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Agregar Nueva Receta</h2>
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
            {/* Botón seleccionar producto */}
            <div>
              <button 
                onClick={onSelectProduct}
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
                    onClick={onSelectProduct}
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
                onClick={onSelectSupplies}
                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
              >
                Seleccionar Insumos {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length})`}
              </button>
            </div>
            
            {/* Botón Guardar */}
            <button
              onClick={onSaveRecipe}
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
                        <div className="w-28">
                          <QuantityInput 
                            ingredientId={ingredientId}
                            cantidadesInsumos={cantidadesInsumos}
                            unitsInKg={unitsInKg}
                            onCantidadChange={onCantidadChange}
                            toggleUnit={toggleUnit}
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
      </div>

      {/* Mobile - Modal original con lista debajo */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto lg:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Agregar Nueva Receta</h2>
          <button
            onClick={onClose}
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
              onClick={onSelectProduct}
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
                  onClick={onSelectProduct}
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
              onClick={onSelectSupplies}
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
                    <div key={ingredientId} className="flex items-center gap-2 bg-white p-3 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {insumo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {insumo.stock} {insumo.unit}
                        </p>
                      </div>
                      <div className="w-24">
                        <QuantityInput 
                          ingredientId={ingredientId}
                          cantidadesInsumos={cantidadesInsumos}
                          unitsInKg={unitsInKg}
                          onCantidadChange={onCantidadChange}
                          toggleUnit={toggleUnit}
                          className="text-xs py-1.5"
                        />
                      </div>
                      <button
                        onClick={() => onRemoveIngredient(ingredientId)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 flex-shrink-0"
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

        {/* Footer Mobile */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onSaveRecipe}
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
  );
}