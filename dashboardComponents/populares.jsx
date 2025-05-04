import { useEffect, useState } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { loginUser } from "../useCases/getPopulares";

export default function Populares() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopulares = async () => {
            try {
                const response = await loginUser(); // Llama a la función para obtener los datos
                const populares = await response.json(); // Convierte la respuesta a JSON
                setData(populares); // Establece los datos en el estado
            } catch (err) {
                console.error("Error al obtener los productos populares:", err);
                setError("No se pudieron cargar los productos populares.");
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchPopulares();
    }, []);

    const getBackgroundColor = (index) => {
        if (index === 0) return "bg-yellow-400 text-yellow-800";
        if (index === 1) return "bg-gray-300 text-gray-900";
        return "bg-orange-200 text-orange-700";
    };

    if (loading) {
        return <p className="text-center">Cargando productos populares...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    // Manejar el caso en el que no haya productos populares
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-col gap-4 bg-white shadow-sm rounded-lg p-4 w-full h-full">
                    <h2 className="flex font-bold text-xl">Productos Populares</h2>
                    <p className="text-center text-gray-500">
                        No tienes productos populares. Conforme vayas creando productos y comiences a tener ventas, esta vista se irá actualizando.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-4 bg-white shadow-sm rounded-lg p-4 w-full h-full">
                <h2 className="flex font-bold text-xl">Productos Populares</h2>
                {data.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center">
                            <div className="flex">
                                <h3
                                    className={`flex justify-center items-center w-9 h-9 self-center rounded-md ${getBackgroundColor(index)}`}
                                >
                                    {item.position}
                                </h3>
                                <div className="flex flex-col ml-2">
                                    <p className="flex font-bold gap-4 items-center">
                                        {item.name}
                                        {index === 0 && (
                                            <>
                                                <FaMoneyBillTrendUp className="text-green-500" size={24} />
                                                <span className="text-gray-500 text-sm hidden md:block">
                                                    {"Tu producto más vendido"}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                    <p className="flex text-gray-500 text-sm">
                                        Vendidos: {item.units_sold}
                                    </p>
                                </div>
                            </div>
                            <p className="font-bold">${item.subtotal}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}