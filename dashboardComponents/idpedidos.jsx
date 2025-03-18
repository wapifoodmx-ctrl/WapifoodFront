export default function IdPedidos() {

    return (
        <section className="py-10">
            <div className="flex w-full text-gray-400 font-bold  gap-16 bg-gray-200">
                <span>ID Pedido </span>
                <span>Fecha y Hora</span>
                <span>total</span>
                <span>Estado</span>
                <span>Acciones</span>
            </div>
            <div className="flex">
                <div className="">PED-1001</div>
                <div className="flex flex-col">
                    <p>2025-03-15</p>
                    <p>13:45</p>
                </div>
            </div>
        </section>
    )
}