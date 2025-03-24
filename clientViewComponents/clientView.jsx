import { useEffect, useState } from "react";

export default function ClientView() {
    const [products, setProducts] = useState([]); // Estado para almacenar los productos
    const [error, setError] = useState(''); // Estado para manejar errores

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token"); // Obtiene el token de autenticación
        const server = `ws://192.168.1.69:8000/ws?token=${token}`
        const socket = new WebSocket(server); // Conecta al servidor WebSocket

        socket.onopen = () => {
            console.log("Conexión WebSocket establecida");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Mensaje recibido:", data);
                setProducts(data); // Actualiza los productos con los datos recibidos
            } catch (err) {
                console.error("Error al procesar el mensaje:", err);
                setError("Error al procesar los datos del servidor.");
            }
        };

        socket.onerror = (err) => {
            console.error("Error en la conexión WebSocket:", err);
            setError("Error en la conexión con el servidor.");
        };

        socket.onclose = () => {
            console.log("Conexión WebSocket cerrada");
        };

        // Limpia la conexión al desmontar el componente
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 gap-4">
            {error ? (
                <div className="text-red-500">{error}</div> // Muestra el mensaje de error si ocurre
            ) : (
                products.length > 0 ? (
                    products.map((product) => (
                        <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-3/6" key={product.id}>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
                            <p className="text-gray-600 mb-4">
                                {product.description}.
                            </p>
                            <p className="text-gray-600 mb-4">
                                {product.price}
                            </p>
                            <button className="bg-[#3fe283] text-white px-4 py-2 rounded hover:bg-green-500">
                                {product.category}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-600">Cargando productos...</div> // Muestra un mensaje mientras se cargan los productos
                )
            )}
        </div>
    );
}