import { useState } from "react";

export default function UpdateProduct({ product, onUpdate, onClose }) {
    const [name, setName] = useState(product.name || "");
    const [description, setDescription] = useState(product.description || "");
    const [price, setPrice] = useState(product.price || "");
    const [category, setCategory] = useState(product.category || "");
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Llama a la función onUpdate con los datos actualizados
        onUpdate({
            name,
            description,
            price,
            category,
            image,
        });

        // Cierra la modal
        onClose();
    };

    return (
        <section className="p-4">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre del producto */}
                <div>
                    <label htmlFor="name" className="block font-bold text-gray-600 mb-2">
                        Nombre del producto
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                        placeholder="Nombre del producto"
                        required
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block font-bold text-gray-600 mb-2">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                        placeholder="Escribe una descripción..."
                        rows="4"
                        required
                    ></textarea>
                </div>

                {/* Precio */}
                <div>
                    <label htmlFor="price" className="block font-bold text-gray-600 mb-2">
                        Precio
                    </label>
                    <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                        placeholder="Precio"
                        required
                    />
                </div>

                {/* Categoría */}
                <div>
                    <label htmlFor="category" className="block font-bold text-gray-600 mb-2">
                        Categoría
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none"
                        required
                    >
                        <option value="" disabled>
                            Seleccionar Categoría
                        </option>
                        <option value="entradas">Entradas</option>
                        <option value="platos-principales">Platos principales</option>
                        <option value="postres">Postres</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="combos">Combos</option>
                    </select>
                </div>

                {/* Imagen */}
                <div>
                    <label htmlFor="image" className="block font-bold text-gray-600 mb-2">
                        Imagen del Producto
                    </label>
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => document.getElementById("image").click()} // Activa el input file al hacer clic
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-image h-4 w-4 mr-2"
                            >
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <circle cx="9" cy="9" r="2"></circle>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                            Seleccionar imagen
                        </button>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden" // Oculta el input real
                        />
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </section>
    );
}