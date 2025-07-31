import MainStats from "./mainStats"
import Populares from "./populares"
import Ventas from "./ventas"
import Pedidos from "./pedidos"
import IdPedidos from "./idpedidos"
export default function MainContentDasboard() {
    return (
        <section className="row-start-2 row-end-3 bg-white">

            <div className="mx-4 my-4 flex flex-col gap-4">

                <div className="flex w-full flex-col  gap-4 justify-between">

                    {/* <Pedidos /> */}
                    <Ventas />

                </div>


            </div>
        </section>
    )
}