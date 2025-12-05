import Navbar from "@/dashboardComponents/navbar";
import { HiExclamationTriangle, HiArrowLeft, HiCreditCard } from "react-icons/hi2";

export default function Error() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Navbar />
      
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-orange-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-yellow-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-100 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
      </div>

      <section className="min-h-screen flex flex-col w-full pt-16 relative z-10">
        
        {/* Contenido principal */}
        <div className="flex flex-col items-center justify-center flex-grow text-center p-8">
          {/* Icono de error */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center shadow-xl">
              <HiExclamationTriangle className="text-6xl text-red-500 animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>

          {/* Contenedor principal */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto border border-gray-100">
            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Pago incorrecto...
              </span>
            </h1>

            {/* Descripción */}
            <div className="space-y-4 mb-8">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Lamentamos decirte que hubo un error con tu pago
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Pero no te preocupes, puedes intentarlo nuevamente con otra tarjeta o revisar el tema con tu banco
              </p>
            </div>

            {/* Sugerencias */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 border-l-4 border-yellow-400">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <HiCreditCard className="text-yellow-500" />
                Qué puedes hacer:
              </h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                  Verificar que tu tarjeta tenga fondos suficientes
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                  Intentar con otra tarjeta de crédito o débito
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                  Contactar a tu banco para verificar restricciones
                </li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/payments")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <HiCreditCard className="text-xl" />
                Regresar a pagos
              </button>
              
              
            </div>
          </div>

          {/* Información de contacto */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">
              ¿Necesitas ayuda? 
            </p>
            <p className="text-green-600 font-medium">
              Contáctanos y te ayudaremos a resolver el problema
            </p>
          </div>
        </div>
      </section>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .delay-1500 {
          animation-delay: 1500ms;
        }
      `}</style>
    </div>
  );
}
