import { useState, useEffect } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { RiCoinsLine } from "react-icons/ri";
import { GoArrowUpRight, GoArrowDownLeft } from "react-icons/go";
import { getAnalitics } from "../useCases/getAnalitics"; // Importar la función

export default function MainStats() {
    const [analyticsData, setAnalyticsData] = useState([]); // Estado para las analíticas
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(""); // Estado para manejar errores

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalitics(); // Llamar a la API

                // Verificar si los datos están vacíos o no contienen las propiedades esperadas
                if (!data || Object.keys(data).length === 0) {
                    setError(
                        "No tienes Ventas hasta el momento. Conforme comiences a tener ventas, esta vista se irá actualizando."
                    );
                    setAnalyticsData([]);
                    return;
                }

                // Mapear los datos de la API al formato esperado
                const mappedData = [
                    {
                        titulo: "Ventas totales",
                        monto: `$${data.total_sales.value.toLocaleString()}`,
                        porcentaje: `${data.total_sales.change}%`,
                        icon: <RiCoinsLine className="text-green-500" size={30} />,
                    },
                    {
                        titulo: "Pedidos Totales",
                        monto: `${data.total_orders.value}`,
                        porcentaje: `${data.total_orders.change}%`,
                        icon: <FiShoppingBag className="text-blue-400" size={30} />,
                    },
                    {
                        titulo: "Clientes nuevos",
                        monto: `${data.new_customers.value}`,
                        porcentaje: `${data.new_customers.change}%`,
                        icon: <IoPeopleSharp className="text-violet-500" size={30} />,
                    },
                    {
                        titulo: "Ticket Promedio",
                        monto: `$${data.average_daily_sales.value.toFixed(2)}`,
                        porcentaje: `${data.average_daily_sales.change}%`,
                        icon: <FaArrowTrendUp className="text-red-400" size={30} />,
                    },
                ];
                setAnalyticsData(mappedData); // Actualizar el estado con los datos mapeados
            } catch (error) {
                console.error("Error al obtener las analíticas:", error.message);
                setError(error.message); // Establecer el mensaje de error en el estado
                setAnalyticsData([]);
            } finally {
                setLoading(false); // Desactivar el estado de carga
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return <p className="text-gray-500">Cargando estadísticas...</p>;
    }

    if (error) {
        return (
            <p className="text-center text-gray-500">
                {error}
            </p>
        );
    }

    if (analyticsData.length === 0) {
        return (
            <p className="text-center text-gray-500">
                No se encontraron estadísticas. Por favor, verifica que los datos estén disponibles.
            </p>
        );
    }

    return (
        <div className="flex-wrap flex justify-center items-center gap-2 w-full md:flex-row flex-col">
            {analyticsData.map((item, index) => (
                <div key={index} className="flex gap-4 flex-col bg-white shadow-sm rounded-lg w-full md:p-4 md:w-4/9">
                    <div className="flex gap-30 w-full justify-between">
                        {item.titulo ? (
                            <p className="flex color text-gray-500">{item.titulo}</p>
                        ) : (
                            <p className="flex color text-gray-500">Error no se tiene la propiedad</p>
                        )}
                        {item.icon ? item.icon : <p className="flex color text-gray-500">Error no se encontró el icono</p>}
                    </div>
                    <h2 className="flex font-bold text-2xl">{item.monto}</h2>
                    <div className="flex gap-2">
                        {item.porcentaje ? (
                            <>
                                {item.porcentaje.includes("-") ? (
                                    <GoArrowDownLeft size={24} className="text-red-500" />
                                ) : (
                                    <GoArrowUpRight size={24} className="text-green-500" />
                                )}
                                {item.porcentaje.includes("-") ? (
                                    <p className="text-red-500">{item.porcentaje}</p>
                                ) : (
                                    <p className="text-green-500">{item.porcentaje}</p>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500">Error contactar al desarrollador</p>
                        )}
                        <p className="text-gray-500">vs la semana pasada</p>
                    </div>
                </div>
            ))}
        </div>
    );
}