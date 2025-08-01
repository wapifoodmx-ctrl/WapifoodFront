export default function Funcionamiento() {
    const data = [
        {
            title: "Regístrate",
            description: "Crea tu cuenta en minutos y configura tu perfil de negocio.",
            icon: "1",
        },
        {
            title: "Configura tu menú ",
            description: "Añade tus productos, categorías y precios de forma sencilla.",
            icon: "2",
        },
        {
            title: "¡Comienza a recibir pedidos!",
            description: "Gestiona tus pedidos en tiempo real y haz crecer tu negocio.",
            icon: "3",
        },
        {
            title: "¡Amigable con tus clientes!",
            description: "Tus clientes amarán pedir tus productos a través de nuestra plataforma.",
            icon: "4",
        },
    ]

    return (
        <section className="bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 py-16 flex flex-col justify-center items-center px-4 md:px-10" id="funcionamiento">
            <h2 className="text-4xl text-center font-extrabold mb-10 bg-gradient-to-r from-green-400 via-emerald-300 to-teal-200 bg-clip-text drop-shadow-lg">
                ¿Cómo funciona?
            </h2>
            <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-8 w-full max-w-5xl">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-center items-center bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100 rounded-3xl shadow-2xl p-8 w-full md:w-[45%] lg:w-[22%] min-h-[220px] border-2 border-green-200 hover:scale-105 transition-all duration-300"
                    >
                        <div className="flex justify-center items-center h-14 w-14 bg-gradient-to-br from-green-400 via-emerald-300 to-teal-200 rounded-full text-white font-bold text-2xl shadow-lg">
                            {item.icon}
                        </div>
                        <h3 className="font-bold text-green-800 text-xl mt-6 text-center">{item.title}</h3>
                        <p className="pt-4 text-green-700 text-center text-base">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}