import Head from 'next/head';
import MeseroMenuComponent from '@/Menucliente/meseroMenuComponent';

export default function MeseroMenu() {
    return (
        <>
            <Head>
                <title>Menú Mesero - WapiFood</title>
                <meta name="description" content="Sistema de gestión de pedidos para meseros" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className="min-h-screen flex flex-col w-full">
                <MeseroMenuComponent />
            </div>
        </>
    );
}
