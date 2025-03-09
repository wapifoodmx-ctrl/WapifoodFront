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
            title: "¿Amigable con tus clientes!",
            description: "Tus clientes amarán pedir tus productos a través de nuestra plataforma.",
            icon: "4",
        },
    ]


    return (

        <section className="flex flex-col justify-center items-center bg-gray-100 py-16">
           
           <h2 className="text-4xl text-black font-bold">¿Cómo funciona?</h2>

           {
            data.map((item, index) => (
                <div key={index} className="flex flex-col justify-center items-center mt-8 ">
                    <div className="flex flex-col justify-center items-center h-[40px] w-[40px] bg-black rounded-full text-white font-bold">
                        {item.icon}
                    </div>
                    <h3 className="font-bold text-black mt-4">{item.title}</h3>
                    <p className="pt-4 w-[80%] text-center">
                        {item.description}
                    </p>
                </div>
            ))
           }
           
        </section>
    )



}