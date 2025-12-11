import { IoClose } from "react-icons/io5";
import { useState, useEffect, useCallback, useRef, memo } from "react";
import getIngredientesInventario from "../useCases/getIngredientesInventario";

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
    value = value.replace(',', '.');
    if (/^\d*\.?\d*$/.test(value)) {
      if (value.includes('.')) {
        const [, decimals = ''] = value.split('.');
        const maxDecimals = isKg ? 3 : 2;
        if (decimals.length > maxDecimals) return;
      }
      onCantidadChange(ingredientId, value);
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

export default function RecipeModalForProduct({ 
  isOpen, 
  onClose, 
  onSave,
  productName 
}) {
  const [insumos, setInsumos] = useState([]);
  const [insumosSeleccionados, setInsumosSeleccionados] = useState([]);
  const [cantidadesInsumos, setCantidadesInsumos] = useState({});
  const [unitsInKg, setUnitsInKg] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectingSupplies, setIsSelectingSupplies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchInsumos();
    }
  }, [isOpen]);

  const fetchInsumos = async () => {
    try {
      const result = await getIngredientesInventario();
      if (result.success && result.data) {
        setInsumos(result.data);
      }
    } catch (error) {
      console.error('Error al cargar insumos:', error);
    }
  };

  const toggleUnit = useCallback((ingredientId) => {
    const currentValue = parseFloat(cantidadesInsumos[ingredientId]) || 0;
    const isCurrentlyKg = unitsInKg[ingredientId];

    if (isCurrentlyKg) {
      const gramos = currentValue * 1000;
      setCantidadesInsumos(prev => ({ ...prev, [ingredientId]: gramos.toString() }));
    } else {
      const kilos = currentValue / 1000;
      setCantidadesInsumos(prev => ({ ...prev, [ingredientId]: kilos.toFixed(3) }));
    }

    setUnitsInKg(prev => ({ ...prev, [ingredientId]: !isCurrentlyKg }));
  }, [cantidadesInsumos, unitsInKg]);

  const handleSelectSupplies = () => {
    setIsSelectingSupplies(true);
  };

  const handleToggleInsumo = (ingredientId) => {
    setInsumosSeleccionados(prev => {
      if (prev.includes(ingredientId)) {
        const newSelected = prev.filter(id => id !== ingredientId);
        setCantidadesInsumos(current => {
          const { [ingredientId]: removed, ...rest } = current;
          return rest;
        });
        return newSelected;
      }
      return [...prev, ingredientId];
    });
  };

  const handleRemoveIngredient = (ingredientId) => {
    setInsumosSeleccionados(prev => prev.filter(id => id !== ingredientId));
    setCantidadesInsumos(current => {
      const { [ingredientId]: removed, ...rest } = current;
      return rest;
    });
  };

  const handleSave = async () => {
    if (insumosSeleccionados.length === 0) {
      alert('Selecciona al menos un ingrediente');
      return;
    }

    const hasEmptyQuantities = insumosSeleccionados.some(id => !cantidadesInsumos[id]);
    if (hasEmptyQuantities) {
      alert('Completa las cantidades de todos los ingredientes');
      return;
    }

    setIsSubmitting(true);
    
    const ingredients = insumosSeleccionados.map(ingredientId => {
      const cantidad = parseFloat(cantidadesInsumos[ingredientId]) || 0;
      const isKg = unitsInKg[ingredientId];
      const quantityInGrams = isKg ? cantidad * 1000 : cantidad;

      return {
        ingredient_id: ingredientId,
        quantity: quantityInGrams
      };
    });

    await onSave(ingredients);
    setIsSubmitting(false);
  };

  const filteredInsumos = insumos.filter(insumo =>
    insumo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  if (isSelectingSupplies) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Seleccionar Ingredientes</h3>
              <button onClick={() => setIsSelectingSupplies(false)} className="text-white hover:text-gray-200">
                <IoClose className="text-2xl" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <input
              type="text"
              placeholder="Buscar ingredientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredInsumos.map(insumo => (
                <label
                  key={insumo.id_ingredient}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    insumosSeleccionados.includes(insumo.id_ingredient)
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={insumosSeleccionados.includes(insumo.id_ingredient)}
                      onChange={() => handleToggleInsumo(insumo.id_ingredient)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{insumo.name}</p>
                      <p className="text-sm text-gray-500">Stock: {insumo.stock} {insumo.unit}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={() => setIsSelectingSupplies(false)}
              className="w-full mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
            >
              Confirmar Selección ({insumosSeleccionados.length})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Agregar Receta</h2>
              <p className="text-green-100 text-xs">Producto: {productName}</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="p-6 flex gap-6">
          <div className="w-1/2 space-y-4">
            <button
              onClick={handleSelectSupplies}
              className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold"
            >
              Seleccionar Ingredientes {insumosSeleccionados.length > 0 && `(${insumosSeleccionados.length})`}
            </button>

            <button
              onClick={handleSave}
              disabled={isSubmitting || insumosSeleccionados.length === 0}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Receta'}
            </button>
          </div>

          <div className="w-1/2 border-l border-gray-200 pl-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ingredientes Seleccionados ({insumosSeleccionados.length})
            </h3>

            {insumosSeleccionados.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">Selecciona ingredientes para la receta</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {insumosSeleccionados.map(ingredientId => {
                  const insumo = insumos.find(i => i.id_ingredient === ingredientId);
                  if (!insumo) return null;

                  return (
                    <div key={ingredientId} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{insumo.name}</p>
                          <p className="text-xs text-gray-500">Stock: {insumo.stock} {insumo.unit}</p>
                        </div>
                        <div className="w-28">
                          <QuantityInput
                            ingredientId={ingredientId}
                            cantidadesInsumos={cantidadesInsumos}
                            unitsInKg={unitsInKg}
                            onCantidadChange={(id, value) => 
                              setCantidadesInsumos(prev => ({ ...prev, [id]: value }))
                            }
                            toggleUnit={toggleUnit}
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveIngredient(ingredientId)}
                          className="text-red-500 hover:text-red-700 p-1"
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
    </div>
  );
}