import Head from "next/head";
import Header from "@/components/Header";
import LoginForm from "@/loginComponents/loginForm";


export default function Login() {
  
  return (
    <>
    <Head>
                <title>Login - WapiFood</title>
                <meta name="description" content="Inicia sesión para acceder a tu restaurante" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
      <Header />
      <LoginForm />
    </>
  );
}
