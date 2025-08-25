import Head from "next/head";
import Navbar from "@/dashboardComponents/navbar";
import MenuComponentes from "@/menuComponents/menucomponentes";
import Cards from "@/menuComponents/Cards";
import { useState, useEffect } from "react";
import { getProducts } from "@/useCases/getProducts";
import { getCategoria } from "@/useCases/getCategoria";
import { checkPayment } from "@/useCases/checkPayment";
import { useRouter } from "next/router";

export default function Menu() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [products, setProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [availabilityFilter, setAvailabilityFilter] = useState("todos"); 
  const [loading, setLoading] = useState(true); 
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Función para obtener los productos
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data); 
    } catch (error) {
      console.error("Error al obtener los productos:", error.message);
      setProducts([]); 
    }
  };

  // Función para obtener las categorías
  const fetchCategories = async () => {
    try {
      const data = await getCategoria();
      setCategories(data); 
    } catch (error) {
      console.error("Error al obtener las categorías:", error.message);
      setCategories([]); 
    }
  };

  // Función para verificar suscripción
  const checkSubscription = async () => {
    try {
      const subscriptionData = await checkPayment();
      if (!subscriptionData.has_active_subscription) {
        setShowSubscriptionModal(true);
        setLoading(false);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al verificar suscripción:", error);
      setShowSubscriptionModal(true);
      setLoading(false);
      return false;
    }
  };

  // Obtener los datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      
      // Verificar suscripción primero
      const hasSubscription = await checkSubscription();
      if (!hasSubscription) return;

      // Si tiene suscripción, cargar datos
      await fetchProducts();
      await fetchCategories();
      setLoading(false); 
    };

    fetchData();
  }, []);

  // Función para manejar la actualización global
  const handleRefresh = async () => {
    setLoading(true); 
    
    // Verificar suscripción antes de actualizar
    const hasSubscription = await checkSubscription();
    if (!hasSubscription) return;

    await fetchProducts(); 
    await fetchCategories(); 
    setLoading(false); 
  };

  // Efecto para el contador de la modal de suscripción
  useEffect(() => {
    let interval = null;
    
    if (showSubscriptionModal && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (showSubscriptionModal && countdown === 0) {
      // Cuando llegue a 0, redirigir automáticamente
      handleGoToPayments();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showSubscriptionModal, countdown]);

  // Función para resetear el contador cuando se abre la modal
  useEffect(() => {
    if (showSubscriptionModal) {
      setCountdown(10);
    }
  }, [showSubscriptionModal]);

  const handleGoToPayments = () => {
    setShowSubscriptionModal(false);
    setCountdown(10); // Resetear contador
    router.push('/payments');
  };

  // Estado de carga mejorado
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <div className="text-center">
            {/* Spinner de carga elegante */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-emerald-400 rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Cargando menú</h2>
            <p className="text-gray-500">Preparando tus productos deliciosos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Modal de suscripción requerida
  if (showSubscriptionModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <Navbar />
        
        {/* Modal de suscripción */}
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            {/* Contador circular en la parte superior */}
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  {/* Círculo de fondo */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  {/* Círculo de progreso */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${(countdown / 10) * 175.93} 175.93`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                {/* Número del contador */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {countdown}
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4 text-green-600 text-center">
              Suscripción Requerida
            </h2>
            
            <p className="text-gray-700 mb-4 text-center">
              Tu suscripción ha expirado o no tienes permisos para acceder a esta funcionalidad. 
              Por favor, renueva tu suscripción para continuar.
            </p>

            {/* Mensaje del contador */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <p className="text-green-700 text-sm text-center">
                <span className="font-semibold">Redirección automática en {countdown} segundo{countdown !== 1 ? 's' : ''}</span>
                <br />
                Serás redirigido a la página de pagos automáticamente
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGoToPayments}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
              >
                Ir a Pagos Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado vacío mejorado
  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <Navbar />
        
        {/* Fondo decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
        </div>

        <main className="relative z-10 pt-16">
          {/* Header del menú */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Mi Menú</h1>
                  <p className="text-gray-600 mt-1">Gestiona tus productos y categorías</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-fade-in-up">
              <MenuComponentes
                onSearch={setSearchTerm}
                onCategoryChange={setSelectedCategory}
                onRefresh={handleRefresh}
                categories={categories}
                onAvailabilityChange={setAvailabilityFilter}
              />
            </div>
            
            {/* Estado vacío elegante */}
            <div className="mt-12 text-center animate-fade-in-up delay-200">
              <div className="max-w-md mx-auto">
                {/* Ilustración SVG */}
                <div className="mb-6">
                  <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">¡Comienza tu menú!</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Para comenzar, primero debes crear una categoría, después puedes comenzar a crear productos y ya podrás verlos en esta sección.
                </p>
                
                {/* Pasos de inicio */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 font-bold">1</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Crear categoría</h4>
                    <p className="text-sm text-gray-600">Organiza tus productos por categorías</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 font-bold">2</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Agregar productos</h4>
                    <p className="text-sm text-gray-600">Añade tus deliciosos productos</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 font-bold">3</div>
                    <h4 className="font-semibold text-gray-800 mb-2">¡Listo!</h4>
                    <p className="text-sm text-gray-600">Tu menú estará disponible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Estilos CSS */}
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
        `}</style>
      </div>
    );
  }

  // Vista principal mejorada
  return (
    <>
    <Head>
                <title>Productos - WapiFood</title>
                <meta name="description" content="Vista de cocina para gestionar órdenes en tiempo real" />
            </Head>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Navbar />
      
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-green-200 rounded-full opacity-15 blur-2xl animate-pulse delay-1500"></div>
      </div>

      <main className="relative z-10 pt-16">
        {/* Header del menú */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Mi Menú</h1>
                  <p className="text-gray-600 mt-1">Gestiona tus productos y categorías</p>
                </div>
              </div>
              
              {/* Estadísticas rápidas */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{products.length}</div>
                  <div className="text-xs text-gray-500">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{categories.length}</div>
                  <div className="text-xs text-gray-500">Categorías</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">
                    {products.filter(p => p.status === 'activo').length}
                  </div>
                  <div className="text-xs text-gray-500">Activos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Componentes de menú */}
          <div className="animate-fade-in-up">
            <MenuComponentes
              onSearch={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              onRefresh={handleRefresh}
              categories={categories}
              onAvailabilityChange={setAvailabilityFilter}
            />
          </div>

          {/* Grid de productos */}
          <div className="mt-8 animate-fade-in-up delay-200">
            <Cards
              products={products}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              categories={categories}
              onRefresh={handleRefresh}
              availabilityFilter={availabilityFilter}
            />
          </div>
        </div>

        {/* Footer del menú */}
        <footer className="relative z-10 bg-white/60 backdrop-blur-sm border-t border-gray-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Gestión de Menú - WapiFood</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </footer>
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
