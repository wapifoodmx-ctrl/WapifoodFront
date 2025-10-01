import React from 'react';

const NavegacionPestañas = ({ pestañaActiva, cambiarPestaña }) => {
  return (
    <div className="flex bg-gray-50 border-b border-gray-200 md:justify-start">
      <button
        className={`flex-1 md:flex-none md:px-8 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
          pestañaActiva === 'insumos'
            ? 'text-green-600 border-green-600 bg-white'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => cambiarPestaña('insumos')}
      >
        Insumos
      </button>
      <button
        className={`flex-1 md:flex-none md:px-8 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
          pestañaActiva === 'productos'
            ? 'text-green-600 border-green-600 bg-white'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => cambiarPestaña('productos')}
      >
        Productos
      </button>
      <button
        className={`flex-1 md:flex-none md:px-8 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
          pestañaActiva === 'otros'
            ? 'text-green-600 border-green-600 bg-white'
            : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => cambiarPestaña('otros')}
      >
        Otros
      </button>
    </div>
  );
};

export default NavegacionPestañas;