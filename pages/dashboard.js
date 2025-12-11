import Head from "next/head";
import Dashboard2 from "@/dashboardComponents/dashboard"
export default function Dashboard() {
    
    return (
        <>
        <Head>
                <title>Dashboard - WapiFood</title>
                <meta name="description" content="Panel de control con estadísticas y análisis de ventas" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

        <Dashboard2 />
        </>
     
    )

}
