import Image from "next/image";
import kime from "@/pages/assets/img/kime.jpeg";
// import { FaRegEye } from "react-icons/fa";
// import { FaRegEyeSlash } from "react-icons/fa6";
// import { FaTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
export default function Cards() {
    const data = {
        "id_products": 75,
        "name": "Pizza peperoni",
        "description": "pizza de peperoni con queso",
        "price": "500.00",
        "category": "pizzas",
        "status": "activo"
    }
    return (

        <section className="rounded-t-2xl shadow flex justify-center items-center flex-col w-full md:w-5/12 lg:w-3/10 ">

            <div className="w-full h-48 ">

                <Image src={kime} className="rounded-t-2xl w-full h-full object-cover" />

            </div>

            <div className="flex w-full p-4 justify-between items-center">
                <h3 className="font-bold text-2xl">
                    {data.name}
                </h3>
                <p className="text-2xl text-green-500 font-bold"> 
                    ${data.price}
                </p>

            </div>

            <div className="w-full px-4">
                <p className="text-gray-500">
                    {data.description}
                </p>
            </div>
            <div className="w-full p-4 flex justify-between items-center">
                <p className="bg-green-300 rounded-2xl px-6 py-1 text-xl">
                    {data.category}
                </p>
                <div className="flex gap-4 ">
                    {/* <FaRegEye size={28} />
                    <FaRegEyeSlash size={28}/>
                    <FaTrashAlt size={28}/> */}
                    <FiEdit size={28} className="cursor-pointer"/>
                
                </div>
            </div>






        </section>
    );
}