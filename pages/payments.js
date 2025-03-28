export default function Payments() {

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Métodos de Pago</h1>
            <p className="text-lg text-gray-700 mb-8">Selecciona tu método de pago preferido.</p>
            <div className="flex flex-wrap justify-center gap-4">
                {/* Aquí puedes agregar los métodos de pago */}
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Tarjeta de Crédito</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">PayPal</button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded">Transferencia Bancaria</button>
            </div>
        </div>
    );
}