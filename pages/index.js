import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { GoChecklist } from "react-icons/go";
import Características from "@/components/Características";
import Creditos from "@/components/Creditos";
import FormContainer from "@/components/FormContainer";
import Funcionamiento from "@/components/Funcionamiento";
import Header from "@/components/Header";
import Main from "@/components/Main";
import AppTickets from "@/components/appTickets";
import PaginaWeb from "@/components/paginaWeb";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  const mainPage = () => {
    router.push('/');
  };

  const loginPage = () => {
    router.push('/login');
  };

  const resetPage = () => {
    router.push('/resetLink');
  };

  const menu = {
    inicio: {
      title: "Inicio",
      action: mainPage,
    },
    login: {
      title: "Iniciar Sesión",
      action: loginPage,
    },
    reset: {
      title: "Recuperar Contraseña",
      action: resetPage,
    },
  };

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Header con mejor z-index y sombra sutil */}
      <div className="relative z-50">
        <Header />
      </div>

      {/* Contenido principal con animaciones suaves */}
      <main className="flex-1">
        {/* Sección Hero mejorada */}
        <section className="relative overflow-hidden">
          <div className="animate-fade-in">
            <Main />
          </div>
          {/* Decoración de fondo sutil */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-10 w-64 h-64 bg-green-100 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-emerald-100 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
          </div>
        </section>

        {/* Sección de Características con mejor espaciado */}
        <section className="relative py-8 md:py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="animate-fade-in-up">
            <Características />
          </div>
        </section>

        {/* Separador visual elegante */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-6 bg-white text-gray-500 font-medium">✨ Características Premium ✨</span>
          </div>
        </div>

        {/* Sección AppTickets con contenedor mejorado */}
        <section className="relative py-8 md:py-16 bg-white">
          <div className="animate-fade-in-up delay-200">
            <AppTickets />
          </div>
        </section>

        {/* Sección de Funcionamiento con fondo alternativo */}
        <section className="relative py-8 md:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="animate-fade-in-up delay-300">
            <Funcionamiento />
          </div>
          {/* Decoración lateral */}
          <div className="absolute left-0 top-1/2 w-2 h-32 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full opacity-30"></div>
          <div className="absolute right-0 top-1/3 w-2 h-40 bg-gradient-to-b from-emerald-400 to-green-500 rounded-l-full opacity-30"></div>
        </section>

        {/* Separador con patrón */}
        <div className="relative py-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent h-px top-1/2"></div>
          <div className="relative flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        {/* Sección Página Web con diseño mejorado */}
        <section className="relative py-8 md:py-16 bg-white">
          <div className="animate-fade-in-up delay-400">
            <PaginaWeb />
          </div>
        </section>

        {/* Sección de Registro con fondo llamativo */}
        <section className="relative py-8 md:py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <div className="animate-fade-in-up delay-500">
            <FormContainer />
          </div>
          {/* Efectos de fondo dinámicos */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-20 animate-spin-slow"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-200 to-teal-300 rounded-full opacity-20 animate-spin-slow reverse"></div>
          </div>
        </section>
      </main>

      {/* Footer mejorado */}
      <footer className="relative bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400">
        <div className="animate-fade-in">
          <Creditos />
        </div>
        {/* Onda decorativa en la parte superior del footer */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg 
            className="relative block w-full h-8" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
              fill="rgba(255,255,255,0.1)"
            />
          </svg>
        </div>
      </footer>

      {/* Estilos para animaciones personalizadas */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .reverse {
          animation-direction: reverse;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-400 {
          animation-delay: 400ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
