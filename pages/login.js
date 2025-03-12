import Header from "@/components/Header";
import LoginForm from "@/loginComponents/loginForm";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    location.reload();
  }, []);

  return (
    <>
      <Header />
      <LoginForm />
    </>
  );
}
