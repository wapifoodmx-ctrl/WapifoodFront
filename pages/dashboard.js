import Head from "next/head";
import Dashboard2 from "@/dashboardComponents/dashboard"
export default function Dashboard() {
    
    return (
        <>
        <Head>
                <title>Dashboard - WapiFood</title>
                <meta name="description" content="Vista de cocina para gestionar órdenes en tiempo real" />
            </Head>

        <Dashboard2 />
        </>
     
    )

}
