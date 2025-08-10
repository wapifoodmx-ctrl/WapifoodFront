import Head from "next/head";
import Pntoventa from "@/Puntodeventa/pntoventa";

export default function PuntoDeVenta() {
  return (
    <>
    <Head>
                <title>Punto de Venta - WapiFood</title>
                <meta name="description" content="Vista de cocina para gestionar órdenes en tiempo real" />
            </Head>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Círculos decorativos */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>

        {/* Líneas decorativas */}
        <div className="absolute top-1/3 left-0 w-1 h-24 bg-gradient-to-b from-green-300 to-emerald-400 rounded-r-full opacity-40"></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-emerald-300 to-teal-400 rounded-l-full opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/2 w-20 h-1 bg-gradient-to-r from-green-300 to-emerald-400 rounded-full opacity-30"></div>
      </div>

      {/* Contenido principal con animación de entrada */}
      <main className="relative z-10 min-h-screen flex flex-col animate-fade-in-up">
        {/* Header del punto de venta */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Punto de Venta</h1>
                  <p className="text-gray-600 mt-1">Sistema completo de ventas y gestión</p>
                </div>
              </div>

              {/* Indicadores rápidos */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">🛒</div>
                  <div className="text-xs text-gray-500">Ventas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">💳</div>
                  <div className="text-xs text-gray-500">Pagos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">🎯</div>
                  <div className="text-xs text-gray-500">Productos</div>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del punto de venta */}
        <div className="flex-1 animate-fade-in-up delay-200">
          <Pntoventa />
        </div>

       
      </main>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .delay-1500 {
          animation-delay: 1500ms;
        }

        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
    </>
  );
}