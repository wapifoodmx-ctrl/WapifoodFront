import { useState } from 'react';
import { GoChecklist } from "react-icons/go";
import { useRouter } from 'next/router';


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const mainPage = () => {
    router.push('/');
  };

  const login = () => {
    router.push('');
  };
  

  const menu = {
    inicios: {
      title: "Inicio",
      href: '/#main',
    },
    caracteristicas: {
      title: "Características",
      href: "/#caracteristicas",
    },
    funcion: {
      title: "Funcionamiento",
      href: "/#funcionamiento",
    },
    registro: {
      title: "Registro",
      href: "/#registro",
    },
    login: {
      title: "Iniciar Sesión",
      href: "/login",
    },

  };

  return (
    <header>
      <nav className="w-full bg-gray-100 text-gray-800 p-4">
        <div className="flex items-center max-w-7xl mx-auto justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={mainPage}>
            <GoChecklist size={36} className="text-green-600" />
            <h1 className="text-3xl hover:text-green-600 font-bold ml-2">Comandapp</h1>
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

          {/* Menú */}
          <div className={`
            md:flex md:items-center md:static
            fixed top-0 right-0 h-full w-auto min-w-0 bg-gray-100 
            transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          `}>

            {/* Elementos del menú */}
            <ul className="md:flex md:space-x-6 mt-16 md:mt-0 p-4 md:p-0 text-xl">
              {
                Object.keys(menu).map((item, index) => (
                  <li key={index} className="cursor-pointer hover:text-green-600 my-4 md:my-0">
                    <a href={menu[item].href}>{menu[item].title}</a>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
