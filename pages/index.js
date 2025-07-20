import Características from "@/components/Características";
import Creditos from "@/components/Creditos";
import FormContainer from "@/components/FormContainer";
import Funcionamiento from "@/components/Funcionamiento";
import Header from "@/components/Header";
import Main from "@/components/Main";
import AppTickets from "@/components/appTickets";
import PaginaWeb from "@/components/paginaWeb";

export default function Home() {
  return (
    <div className=" min-h-screen flex flex-col w-full">
      <Header />
      <Main />
      <Características />
      <AppTickets />
      <Funcionamiento />
      <PaginaWeb />
      <FormContainer />
      <Creditos />
    </div>
  );
}
