import React, { CSSProperties } from "react";
import { getPopulares } from "@/useCases/getPopulares";
import { useEffect, useState } from "react";

// Colores que van más acorde con tu identidad de marca
const colores = [
    "from-green-400 to-green-500 dark:from-green-500 dark:to-green-700", // Verde principal de tu marca
    "from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-700", // Esmeralda (verde azulado)
    "from-teal-400 to-teal-500 dark:from-teal-500 dark:to-teal-700",     // Teal (verde-azul)
    "from-lime-400 to-lime-500 dark:from-lime-500 dark:to-lime-700",     // Lima (verde amarillento)
    "from-cyan-400 to-cyan-500 dark:from-cyan-500 dark:to-cyan-700",     // Cian (azul verdoso)
    "from-green-500 to-green-600 dark:from-green-600 dark:to-green-800", // Verde más intenso
    "from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800", // Esmeralda intenso
    "from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-800"      // Teal intenso
];

export default function BarChartBreakdown() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Función para transformar los datos de la API
    const transformarDatos = (datosAPI) => {
        return datosAPI.map((item, index) => ({
            key: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name, // Limitar nombre
            value: item.units_sold, // Usar unidades vendidas como valor
            color: colores[index % colores.length], // Asignar color cíclicamente
            subtotal: item.subtotal,
            position: item.position,
            price: item.price
        }));
    };
    
    useEffect(() => {
        const fetchPopulares = async () => {
            try {
                const populares = await getPopulares();
                const datosTransformados = transformarDatos(populares);
                setData(datosTransformados);
            } catch (err) {
                console.error("Error al obtener los productos populares:", err);
                setError("No se pudieron cargar los productos populares.");
                // Datos de fallback en caso de error
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPopulares();
    }, []);

    // Mostrar estado de carga
    if (loading) {
        return (
            <div className="flex justify-center items-center h-16">
                <div className="text-gray-500">Cargando productos populares...</div>
            </div>
        );
    }

    // Mostrar error
    if (error) {
        return (
            <div className="flex justify-center items-center h-16">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    // Si no hay datos
    if (data.length === 0) {
        return (
            <div className="flex justify-center items-center h-16">
                <div className="text-gray-500">No hay productos populares disponibles</div>
            </div>
        );
    }

    const gap = 0.3;
    const totalValue = data.reduce((acc, d) => acc + d.value, 0);
    const barHeight = 54;
    const totalWidth = totalValue + gap * (data.length - 1);
    let cumulativeWidth = 0;
    const cornerRadius = 4;

    return (
        <div
            className="relative h-[var(--height)] mb-1.5"
            style={{
                "--marginTop": "0px",
                "--marginRight": "0px",
                "--marginBottom": "0px",
                "--marginLeft": "0px",
                "--height": `${barHeight}px`,
            }}
        >
            <div className="absolute inset-0 
                h-[calc(100%-var(--marginTop)-var(--marginBottom))]
                w-[calc(100%-var(--marginLeft)-var(--marginRight))]
                translate-x-[var(--marginLeft)]
                translate-y-[var(--marginTop)]
                overflow-visible"
            >
                {data.map((d, index) => {
                    const barWidth = (d.value / totalWidth) * 100;
                    const xPosition = cumulativeWidth;
                    cumulativeWidth += barWidth + gap;

                    return (
                        <div
                            key={index}
                            className="relative group cursor-pointer"
                            style={{
                                width: `${barWidth}%`,
                                height: `${barHeight}px`,
                                left: `${xPosition}%`,
                                position: "absolute",
                            }}
                            title={`${d.key} - ${d.value} vendidos - $${d.subtotal}`}
                        >
                            <div
                                className={`bg-gradient-to-b ${d.color} transition-all duration-200 group-hover:scale-105`}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: `${cornerRadius}px`,
                                }}
                            />
                            {/* Nombre del producto */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: `${barHeight / 5}px`,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    color: "white",
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    maxWidth: "90%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {d.key}
                            </div>
                            {/* Unidades vendidas */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: `${barHeight / 1.8}px`,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    color: "white",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    fontFamily: "monospace",
                                }}
                            >
                                {d.value}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}