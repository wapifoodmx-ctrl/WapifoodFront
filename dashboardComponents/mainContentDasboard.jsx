import MainStats from "./mainStats"
import Populares from "./populares"
import Ventas from "./ventas"
export default function MainContentDasboard() {
    return (
        <section className="row-start-2 row-end-3 bg-white">

            <div className="mx-4 my-4">
                <div className="flex gap-4 my-4 flex-col md:justify-between md:flex-row">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold">
                            Estadísticas
                        </h2>
                        <p className="text-gray-500">Bienvenido de nuevo aquí está el resumen de tu negocio</p>
                    </div>
                    <div className="flex gap-4 ">
                        <button className="bg-blue-500 text-white px-4 py-2 md:h-2/3 rounded-lg cursor-pointer">Ver todo</button>
                        <button className="bg-blue-500 text-white px-4 py-2 md:h-2/3 rounded-lg cursor-pointer">Ver todo</button>
                    </div>
                </div>

                <div className="flex w-full flex-col md:flex-row gap-4 justify-between">

                    <Populares />

                    
                    <MainStats />
                    
                </div>

                <div className="mt-4 w-full h-auto">   
                    <Ventas />

                </div>
            </div>
        </section>
    )
}