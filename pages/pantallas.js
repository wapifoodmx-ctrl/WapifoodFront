import Head from "next/head";
import Navbar from "@/dashboardComponents/navbar";
import PantallasComponente from "@/Pantallas/pantallasComponente";

export default function Pantallas() {
    return (
        <>
            <Head>
                <title>Pantallas - WapiFood</title>
                <meta name="description" content="Gestión de pantallas" />
            </Head>

            <Navbar />
            <PantallasComponente />

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }
            `}</style>
        </>
    );
}
