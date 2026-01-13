import Head from "next/head";
import PestañasInventario from "@/Inventarios/pestañasInventario";
import Inventario from "@/Inventarios/inventario";
import ChatBot from "@/components/ChatBot";

export default function Inventarios() {
  return (
    <>
      <Head>
                <title>Inventario - WapiFood</title>
                <meta name="description" content="Gestión de inventarios y control de stock" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
      <Inventario />  
      
      {/* ChatBot */}
      <ChatBot viewName="inventarios" />
    </>
  );
}