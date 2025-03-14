import { FaArrowTrendUp } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { RiCoinsLine } from "react-icons/ri";
import { GoArrowUpRight } from "react-icons/go";
import { GoArrowDownLeft } from "react-icons/go";

export default function MicroComponent() {
    const data = [
        {
            titulo: "Ventas totales",
            monto: "$12,628",
            porcentaje: "8.2",
            icon: <RiCoinsLine className="text-green-500 " size={30} />,
        },
        {
            titulo: "Pedidos Totales",
            monto: "5.3%",
            porcentaje: "8.2%",
            icon: <FiShoppingBag className="text-blue-400" size={30} />,
        },
        {
            titulo: "Clientes nuevos",
            monto: "32",
            porcentaje: "12.5%",
            icon: <IoPeopleSharp className="text-violet-500" size={30} />,
        },
        {
            titulo: "ticket Promedio",
            monto: "$50.92",
            porcentaje: "-2.1%",
            icon: <FaArrowTrendUp className="text-red-400" size={30}/>,
        },
    ];

    return (
        <div className="flex-wrap flex justify-center items-center gap-4 w-full">
            {data.map((item, index) => (
                <div key={index} className="flex gap-4 flex-col bg-white shadow-sm rounded-lg p-4">
                    <div className="flex gap-30">
                        {item.titulo ? <p className="flex color text-gray-500">{item.titulo}</p> : <p className="flex color text-gray-500">Error no se tiene la propiedad</p>}
                        {item.icon ? item.icon : <p className="flex color text-gray-500">Error no se encontró el icono</p>}
                    </div>
                    <h1 className="flex font-bold text-2xl">{item.monto}</h1>
                    <div className="flex gap-2">
                        {item.porcentaje ? (
                            <>
                                {item.porcentaje.includes("-") ? <GoArrowDownLeft size={24} className="text-red-500" /> : <GoArrowUpRight size={24} className="text-green-500" />}
                                {item.porcentaje.includes("-") ? <p className="text-red-500">{item.porcentaje}</p> : <p className="text-green-500">{item.porcentaje}</p>}
                            </>
                        ) : (
                            <p className="text-gray-500">Error contactar al desarrollador</p>
                        )}
                    </div>
                    <p className="text-gray-500">vs la semana pasada</p>
                </div>
            ))}
        </div>
    );
}