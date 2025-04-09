import { GoChecklist } from "react-icons/go";
import React, { useState } from "react"; // Importa useState

export default function menucliente() {
    const [isOpen, setIsOpen] = useState(false); // Define el estado isOpen

    return (
        <section>
            <header>
                <nav className="w-full bg-gray-100 text-gray-800 p-4">
                    <div className="flex items-center max-w-7xl mx-auto justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <GoChecklist size={36} className="text-green-600" />
                            <h1 className="text-3xl font-bold ml-2">Comandapp</h1>
                        </div>
                    </div>
                </nav>
                <button
                    className="z-20 cursor-pointer py-3"
                    onClick={() => setIsOpen(!isOpen)} // Cambia el estado al hacer clic
                    aria-label="Toggle menu"
                >
                    <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-gray-800 mb-1.5 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
                </button>
            </header>
        </section>
    );
}