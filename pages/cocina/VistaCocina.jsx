import { BsClock } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
export default function VistaCocina() {
    return (
        <div className="w-full mt-16">
            <div className="w-full flex shadow-md p-4 overflow-x-auto whitespace-nowrap">
                <button className="px-2.5 cursor-pointer hover:text-green-600">Todas las Comandas (10)</button>
                <button className="px-2.5 cursor-pointer hover:text-green-600">Comandas en Proceso (5)</button>
                <button className="px-2.5 cursor-pointer hover:text-green-600">Comandas Completadas (5)</button>
                <button className="px-2.5 cursor-pointer hover:text-green-600">Comandas Canceladas (0)</button>
            </div>
            <div className=" py-5 px-5">
               <div className="max-w-96 max-h-80 border-1 bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between">
                <p className="font-bold text-xl">Mesa 1</p>
                <div>

                <div className="flex ">
                <LuCalendarDays className="text-gray-500 text-sm self-center" />
                <p className="text-sm text-gray-500 pl-1">10/05/2025</p>

                </div>
                <div className="flex ">
                <BsClock className="text-gray-500 text-sm self-center"/>
                <p className=" text-sm text-gray-500 pl-1">14:10</p>
                </div>
                </div>
                </div>
               </div>
            </div>
        </div>
    );
}