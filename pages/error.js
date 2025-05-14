import Navbar from "@/dashboardComponents/navbar";

export default function Error() {
  return (
    <section className="min-h-screen flex flex-col w-full mt-16 bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow text-center p-8">
        <h1 className="text-4xl font-bold text-red-400 mb-4">
          Pago incorrecto...
        </h1>
        <p className="text-lg text-gray-700">
          Lamentamos decirte que hubo un error con tu pago
        </p>
        <p className="text-lg text-gray-700 mt-2">
          Pero no te preocupes puedes intentarlo nuevamente con otra tarjeta o revisar el tema con tu banco 
        </p>
        <button
          onClick={() => (window.location.href = "/payments")}
          className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-green-700 transition font-bold"
        >
          Volver a los métodos de pagos
        </button>
      </div>
    </section>
  );
}
