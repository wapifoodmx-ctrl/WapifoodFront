import React from 'react';

const PestañasInventario = ({ pestañaActiva, cambiarPestaña }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Navegación de pestañas */}
      <div className="flex bg-gray-50 border-b border-gray-200 md:justify-start">
        <button
          className={`flex-1 md:flex-none md:px-8 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${pestañaActiva === 'insumos'
            ? 'text-green-600 border-green-600 bg-white'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
            }`}
          onClick={() => cambiarPestaña('insumos')}
        >
          Insumos
        </button>
        <button
          className={`flex-1 md:flex-none md:px-8 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${pestañaActiva === 'productos'
            ? 'text-green-600 border-green-600 bg-white'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
            }`}
          onClick={() => cambiarPestaña('productos')}
        >
          Productos
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="p-6 bg-white min-h-96">
        {pestañaActiva === 'insumos' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Insumos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Aquí va el contenido de los insumos...
            </p>
          </div>
        )}

        {pestañaActiva === 'productos' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Productos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Aquí va el contenido de los productos...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PestañasInventario;