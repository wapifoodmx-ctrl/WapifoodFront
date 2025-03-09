import Características from "@/components/Características";
import FormContainer from "@/components/FormContainer";
import Funcionamiento from "@/components/Funcionamiento";
import Header from "@/components/Header";
import Main from "@/components/Main";

export default function Home() {
  return (
    <div className=" min-h-screen flex flex-col w-full">
      <Header />
      <Main />
      <Características />
      <Funcionamiento />
      <FormContainer />
    </div>
  );
}
