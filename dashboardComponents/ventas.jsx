export default function Ventas() {
    return (
        <div className="flex items-center justify-center w-full mt-4">
            <div className="flex w-8/12 h-11/12 bg-white shadow-sm rounded-lg p-4">

                <div class="flex space-x-2 p-4 justify-between w-full">
                    <h2 className="font-bold">Ventas</h2>
                   <div>
                   <button class="px-4 py-2 hover:border-b-2  text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t-md">
                        Día
                    </button>
                    <button class="px-4 py-2 hover:border-b-2  text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 roun">
                        Semana
                    </button>
                    <button class="px-4 py-2 hover:border-b-2  text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Mes
                    </button>
                   </div>
                </div>
            </div>

        </div>
    )
}
