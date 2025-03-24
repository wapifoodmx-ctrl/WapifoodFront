export default function Pedidos() {
    const data = [
        {
            Titulo: "Total de Pedidos",
            Cantidad: 5
        },
        {
            Titulo: "Pendientes",
            Cantidad: 1
        },
        {
            Titulo: "En Proceso",
            Cantidad: 1
        },
        {
            Titulo: "Completados",
            Cantidad: 2
        }
    ];

    return (
        <div className="flex flex-col items-center md:flex-row gap-4 md:px-4">
            {data.map((item, index) => (
                <section key={index} className="md:flex  bg-white p-4 rounded-md shadow-sm flex-col w-full h-25">
                    <div className="text-gray-500">{item.Titulo}</div>
                    <p className="flex font-bold text-2xl">{item.Cantidad}</p>
                </section>
            ))}
        </div>
    );
}