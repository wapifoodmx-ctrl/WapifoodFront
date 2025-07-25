import Head from 'next/head';
import Menucliente from '@/Menucliente/menucliente';

export default function ClientMenu() {
    return (
        <>
            <Head>
                <title>Menú del Cliente - WapiFood</title>
                <meta name="description" content="Explora nuestro menú digital" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className=" min-h-screen flex flex-col w-full">
                <Menucliente />
            </div>
        </>
    );
}