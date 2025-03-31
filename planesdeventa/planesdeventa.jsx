import { LuNotebookPen } from "react-icons/lu";
export default function PlanDeVentas() {
    return (
        <section className="">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                <div className="flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">1</span>
                    <span className="flex-1 h-1 mx-2 bg-black"></span>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border-1">2</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 pt-14">Elige tu plan</h2>
                <p className="text-lg text-gray-600">Selecciona el plan que mejor se adapte a las necesidades de tu negocio</p>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white shadow-lg rounded-lg p-6 flex gap-4">
                        <LuNotebookPen className="text-3xl bg-green-500 w-9 h-8 rounded-full" /> <h3 className=" flex font-bold text-2xl">Registra tus pedidos en tiempo real</h3>
                    </div>
                    {/* Planes de venta */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Plan Básico</h3>
                        <p className="text-gray-600 mb-4">Ideal para negocios pequeños que están empezando.</p>
                        <p className="text-2xl font-bold mb-4">$29.99/mes</p>
                        <button className="bg-green-500 text-white py-2 px-4 rounded">Seleccionar</button>
                        <div></div>
                    </div>
                </div>
            </div>
        </section>
    );
}