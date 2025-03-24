import { FaMoneyBillTrendUp } from "react-icons/fa6";
export default function Populares() {
    const data = [
        {
            producto: "Pizza Margherita",
            vendidos: 145,
            precio: 15.15
        },
        {
            producto: "Hamburguesa Clásica",
            vendidos: 132,
            precio: 12.00
        },
        {
            producto: "Papas Fritas",
            vendidos: 80,
            precio: 7.00
        },
        {
            producto: "Coca Cola",
            vendidos: 110,
            precio: 3.00
        },
        {
            producto: "Pizza Hawaiana",
            vendidos: 100,
            precio: 17.00
        },
        {
            producto: "Hamburguesa Doble",
            vendidos: 90,
            precio: 20.00
        },
    ];

    const sortedData = data.sort((a, b) => b.vendidos - a.vendidos);

    const getBackgroundColor = (index) => {
        if (index === 0) return "bg-yellow-400 text-yellow-800";
        if (index === 1) return "bg-gray-300 text-gray-900";
        return "bg-orange-200 text-orange-700";
    };

    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col gap-4 bg-white shadow-sm rounded-lg p-4 w-full h-full">
                <h2 className="flex font-bold text-xl">Productos Populares</h2>
                {sortedData.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center">
                            <div className="flex ">
                                <h3 className={`flex justify-center items-center w-9 h-9 self-center rounded-md ${getBackgroundColor(index)}`}>{index + 1}</h3>
                                <div className="flex flex-col ml-2">
                                    <p className="flex font-bold gap-4 items-center">
                                        {item.producto}
                                        {index === 0 && (
                                            <>
                                                <FaMoneyBillTrendUp className="text-green-500" size={24} />

                                                <span className="text-gray-500 text-sm hidden md:block">
                                                    {"Tu producto más vendido"}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                    {item.vendidos ? (
                                        <p className="flex text-gray-500 text-sm">${item.vendidos}</p>
                                    ) : (
                                        <p className="flex text-gray-500 text-sm">Error no se encontró la cantidad</p>
                                    )}
                                </div>
                            </div>
                            {!item.vendidos || !item.precio ? (
                                <p className="font-bold">X</p>
                            ) : (
                                <p className="font-bold">${item.vendidos * item.precio}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}