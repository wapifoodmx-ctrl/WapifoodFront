import Head from "next/head";
import PestañasInventario from "@/Inventarios/pestañasInventario";
import Inventario from "@/Inventarios/inventario";

export default function Inventarios() {
  return (
    <>
      <Head>
                <title>Inventario - WapiFood</title>
                <meta name="description" content="Vista de inventarios para organizar tu restaurante" />
            </Head>
      <Inventario />  
      <PestañasInventario />
    </>
  );
}