import { IoClose } from "react-icons/io5";
import { useState, useCallback, useRef, useMemo, memo } from "react";

const QuantityInput = memo(({ ingredientId, cantidadesInsumos, unitsInKg, onCantidadChange, toggleUnit, className = "", insumo }) => {
  const inputRef = useRef(null);
  
  // Determinar el tipo de unidad del insumo
  const unitType = useMemo(() => {
    if (!insumo || !insumo.unit) return null;
    
    const unit = insumo.unit.toLowerCase();
    
    // Unidades de peso
    if (unit.includes('g') || unit.includes('gramo') || unit.includes('kilo') || unit.includes('kg')) {
      return 'weight';
    }
    // Unidades de volumen
    if (unit.includes('ml') || unit.includes('mililitro') || unit.includes('l') || unit.includes('litro')) {
      return 'volume';
    }
    // Unidades de cantidad
    if (unit.includes('pz') || unit.includes('pieza') || unit.includes('unidad') || unit.includes('ud')) {
      return 'quantity';
    }
    
    return null;
  }, [insumo]);
  
  const isLargeUnit = unitsInKg[ingredientId];
  const currentValue = cantidadesInsumos[ingredientId] || '';
  
  // Obtener las unidades según el tipo
  const getUnits = () => {
    if (unitType === 'weight') {
      return { small: 'g', large: 'kg' };
    }
    if (unitType === 'volume') {
      return { small: 'ml', large: 'L' };
    }
    return null; // No hay conversión para cantidades
  };
  
  const units = getUnits();
  
  const handleChange = (e) => {
    let value = e.target.value;

    if (value === '') {
      onCantidadChange(ingredientId, '');
      return;
    }

    value = value.replace(',', '.');

    if (/^\d*\.?\d*$/.test(value)) {
      if (value.includes('.')) {
        const [, decimals = ''] = value.split('.');
        const maxDecimals = isLargeUnit ? 3 : 2;
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
    
    toggleUnit(ingredientId, unitType);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  
  // Si no hay conversión disponible, solo mostrar el input sin botón
  if (!units) {
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
            className={`w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 pr-8 ${className}`}
            autoComplete="off"
            maxLength="10"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 pointer-events-none select-none">
            {insumo?.unit || ''}
          </span>
        </div>
      </div>
    );
  }
  
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
          className={`w-full text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 pr-10 ${className}`}
          autoComplete="off"
          maxLength="10"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 pointer-events-none select-none">
          {isLargeUnit ? units.large : units.small}
        </span>
      </div>
      <button
        onClick={handleToggleUnit}
        type="button"
        className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-semibold transition-colors flex-shrink-0"
        title={isLargeUnit ? `Convertir a ${units.small}` : `Convertir a ${units.large}`}
      >
        {isLargeUnit ? units.small : units.large}
      </button>
    </div>
  );
});

QuantityInput.displayName = 'QuantityInput';

export default function EditRecipeModal({
  isOpen,
  onClose,
  editingRecipe,
  recipeName,
  insumosSeleccionados,
  insumos,
  cantidadesInsumos,
  isDisplayableInsumos,
  isLoadingRecipeDetails,
  isSubmittingRecipe,
  errorMessage,
  successMessage,
  onRecipeNameChange,
  onSelectSupplies,
  onUpdateRecipe,
  onCantidadChange,
  onIsDisplayableChange,
  onRemoveIngredient
}) {
  const [unitsInKg, setUnitsInKg] = useState({});

  const toggleUnit = useCallback((ingredientId, unitType) => {
    const currentValue = parseFloat(cantidadesInsumos[ingredientId]) || 0;
    const isCurrentlyLarge = unitsInKg[ingredientId];

    if (unitType === 'weight') {
      // Conversión kg <-> g
      if (isCurrentlyLarge) {
        const gramos = currentValue * 1000;
        onCantidadChange(ingredientId, gramos.toString());
      } else {
        const kilos = currentValue / 1000;
        onCantidadChange(ingredientId, kilos.toFixed(3));
      }
    } else if (unitType === 'volume') {
      // Conversión L <-> ml
      if (isCurrentlyLarge) {
        const mililitros = currentValue * 1000;
        onCantidadChange(ingredientId, mililitros.toString());
      } else {
        const litros = currentValue / 1000;
        onCantidadChange(ingredientId, litros.toFixed(3));
      }
    }

    setUnitsInKg(prev => ({
      ...prev,
      [ingredientId]: !isCurrentlyLarge
    }));
  }, [cantidadesInsumos, unitsInKg, onCantidadChange]);

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
              
              {/* Nota informativa */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">Nota:</span> Selecciona los ingredientes que se pueden quitar de la receta, ej: "sin cebolla", "sin jitomate".
                </p>
              </div>
              
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
                          <div className="w-28">
                            <QuantityInput 
                              ingredientId={ingredientId}
                              cantidadesInsumos={cantidadesInsumos}
                              unitsInKg={unitsInKg}
                              onCantidadChange={onCantidadChange}
                              toggleUnit={toggleUnit}
                              insumo={insumo}
                            />
                          </div>
                          {/* Checkbox removible */}
                          <div className="flex items-center" title="¿Se puede quitar?">
                            <input
                              type="checkbox"
                              checked={isDisplayableInsumos[ingredientId] || false}
                              onChange={(e) => onIsDisplayableChange(ingredientId, e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
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
                
                {/* Nota informativa */}
                <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Nota:</span> Marca los ingredientes que se pueden quitar, ej: "sin cebolla", "sin jitomate".
                  </p>
                </div>
                
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
                        <div className="w-24">
                          <QuantityInput 
                            ingredientId={ingredientId}
                            cantidadesInsumos={cantidadesInsumos}
                            unitsInKg={unitsInKg}
                            onCantidadChange={onCantidadChange}
                            toggleUnit={toggleUnit}
                            className="text-xs py-1.5"
                            insumo={insumo}
                          />
                        </div>
                        {/* Checkbox removible */}
                        <div className="flex items-center" title="¿Se puede quitar?">
                          <input
                            type="checkbox"
                            checked={isDisplayableInsumos[ingredientId] || false}
                            onChange={(e) => onIsDisplayableChange(ingredientId, e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
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