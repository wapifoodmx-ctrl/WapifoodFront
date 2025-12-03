import { IoClose } from "react-icons/io5";

export default function RecipeCard({ receta, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(receta.id_recipe)}
      className={`cursor-pointer border-2 rounded-xl p-4 lg:p-6 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] ${
        isSelected
          ? 'border-green-500 bg-green-50 shadow-lg scale-[1.02]'
          : 'border-gray-200 bg-white hover:border-green-300'
      }`}
    >
      {/* Header de la card con checkbox */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-lg lg:text-xl mb-1 truncate">
            {receta.name}
          </h3>
        </div>
        
        {/* Checkbox personalizado */}
        <div className="flex-shrink-0 ml-3">
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-400'
          }`}>
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Información de la receta */}
      <div className="space-y-3">
        {/* Ingredientes */}
        <div className="py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600 mb-2 block">Ingredientes:</span>
          {receta.ingredients && receta.ingredients.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {receta.ingredients.map((ingredient, index) => (
                <span 
                  key={ingredient.id_ingredient || index}
                  className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                >
                  {ingredient.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-500 italic">Sin ingredientes registrados</span>
          )}
        </div>
      </div>

      {/* Footer con indicador de selección */}
      {isSelected && (
        <div className="mt-4 py-2 px-3 bg-green-100 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-700 text-center">
            ✓ Receta seleccionada
          </p>
        </div>
      )}
    </div>
  );
}