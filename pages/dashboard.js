import Ventas from "@/dashboardComponents/ventas"
import Populares from "@/dashboardComponents/populares" 
import MicroComponent from "@/dashboardComponents/microcomponents"
import Dashboard1 from "@/dashboardComponents/daschoard"
export default function Dashboard() {
    
    return (
        <>
        <Dashboard1 />
        <MicroComponent/>
        <Ventas/>
        <Populares/>
        </> 
    )

}
