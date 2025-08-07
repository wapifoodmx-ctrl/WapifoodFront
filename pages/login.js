import Head from "next/head";
import Header from "@/components/Header";
import LoginForm from "@/loginComponents/loginForm";


export default function Login() {
  
  return (
    <>
    <Head>
                <title>Login - WapiFood</title>
                <meta name="description" content="Vista de cocina para gestionar órdenes en tiempo real" />
            </Head>
      <Header />
      <LoginForm />
    </>
  );
}
