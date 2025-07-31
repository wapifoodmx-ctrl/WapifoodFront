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
      <nav className="w-full bg-gray-100 text-gray-800 p-4 shadow-md">
        <div className="flex items-center max-w-7xl mx-auto justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={mainPage}>
            <GoChecklist size={36} className="text-green-600" />
            <h1 className="text-3xl hover:text-green-600 font-bold ml-2">WapiFood</h1>
          </div>

          {/* Botón Hamburguesa - Solo visible en móvil */}
          <button
            className="md:hidden z-20 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>

          {/* Menú Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {Object.values(menu).map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 cursor-pointer"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Menú Mobile */}
        <div
          ref={menuRef}
          className={`
            md:hidden absolute top-full left-0 w-full bg-gray-100 shadow-lg
            transition-transform duration-300 ease-in-out z-40
            ${isOpen ? 'translate-y-0' : '-translate-y-full opacity-0 pointer-events-none'}
          `}
        >
          <div className="py-4 px-4">
            {Object.values(menu).map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
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
