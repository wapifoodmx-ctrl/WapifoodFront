import Head from 'next/head';
import TerminosCondiciones from '@/pages/Terminos y Condiciones/TerminosCondiciones.jsx';

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Términos y Condiciones - WapiFood</title>
        <meta name="description" content="Términos y condiciones de uso de la plataforma" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TerminosCondiciones />
    </>
  );
}