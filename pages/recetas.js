import Head from 'next/head.js';
import Recipes from '../Recetas/recipes.jsx';
import ChatBot from '@/components/ChatBot';

export default function Recetas() {
  return (
    <div>
        <Head>
            <title>Recetas - Wapifood </title>
            <meta name="description" content="Página de recetas" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
      <Recipes />
      
      {/* ChatBot */}
      <ChatBot viewName="recetas" />
    </div>
  );
}