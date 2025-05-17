import Navbar from "@/dashboardComponents/navbar";

export default function Success() {
    return (
        <section className="min-h-screen flex flex-col w-full mt-16 bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center flex-grow text-center p-8">
                <h1 className="text-4xl font-bold text-green-600 mb-4">¡Pago satisfactorio!</h1>
                <p className="text-lg text-gray-700">
                    Muchas gracias por tu preferencia y apoyo. Tu transacción ha sido completada con éxito.
                </p>
                <p className="text-lg text-gray-700 mt-2">
                    Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos.
                </p>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Volver al Dashboard
                </button>
            </div>
        </section>
    );
}