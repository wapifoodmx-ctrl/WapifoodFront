import { useState, useEffect, useRef } from 'react';
import { GoChecklist } from "react-icons/go";
import { useRouter } from 'next/router';

export default function Header() {
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

  // Función para manejar la navegación a secciones de la página principal
  const navigateToSection = (sectionId) => {
    if (router.pathname === '/') {
      // Si ya estamos en la página principal, hacer scroll a la sección
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Si estamos en otra página, navegar a la página principal con el hash
      router.push(`/#${sectionId}`);
    }
    setIsOpen(false); // Cerrar el menú móvil
  };

  const menu = {
    inicios: {
      title: "Inicio",
      action: () => navigateToSection('main'),
    },
    caracteristicas: {
      title: "Características",
      action: () => navigateToSection('caracteristicas'),
    },
    funcion: {
      title: "Funcionamiento",
      action: () => navigateToSection('funcionamiento'),
    },
    registro: {
      title: "Registro",
      action: () => navigateToSection('registro'),
    },
    login: {
      title: "Iniciar Sesión",
      action: loginPage,
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

  // Manejar navegación cuando la página se carga con un hash
  useEffect(() => {
    if (router.asPath.includes('#') && router.pathname === '/') {
      const hash = router.asPath.split('#')[1];
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [router.asPath, router.pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="w-full bg-gradient-to-r from-green-500 via-emerald-400 to-teal-400 text-white p-4 shadow-xl border-b border-green-200">
        <div className="flex items-center max-w-7xl mx-auto justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={mainPage}>
            <GoChecklist size={36} className="text-yellow-300 drop-shadow-lg" />
            <h1 className="text-3xl font-bold ml-2 bg-gradient-to-r from-yellow-300 via-green-100 to-white bg-clip-text text-transparent hover:text-green-200 transition-colors duration-200">WapiFood</h1>
          </div>

          {/* Botón Hamburguesa - Solo visible en móvil y tablet */}
          <button
            className="lg:hidden z-20 cursor-pointer bg-white/20 rounded-full p-2 shadow-lg border border-green-200 hover:bg-white/40 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-white mb-1.5 rounded transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-white mb-1.5 rounded transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-white rounded transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>

          {/* Menú Desktop - SOLO visible en lg y arriba */}
          <div className="hidden lg:flex items-center space-x-6">
            {Object.values(menu).map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="text-white hover:text-yellow-300 font-semibold transition-colors duration-200 cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 shadow hover:scale-105"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Menú Mobile/Tablet - SOLO visible en móvil y tablet */}
        <div
          ref={menuRef}
          className={`
            lg:hidden fixed top-16 left-0 w-full bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-2xl
            transition-transform duration-300 ease-in-out z-40
            ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
          `}
        >
          <div className="flex justify-end px-4">
            <button
              className="text-green-700 text-2xl font-bold hover:text-emerald-600 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>
          <div className="py-4 px-4">
            {Object.values(menu).map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="block w-full text-left py-3 px-4 text-green-700 hover:text-emerald-700 hover:bg-green-100 rounded-xl font-semibold transition-all duration-200 cursor-pointer bg-gradient-to-r from-green-100 to-emerald-100 shadow"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
