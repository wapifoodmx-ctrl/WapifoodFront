import { IoClose } from "react-icons/io5";
import { BsTrash3 } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export default function DeleteMeseroModal({ isOpen, onClose, onConfirm, mesero }) {
  if (!isOpen || !mesero) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-lime-500 to-green-600 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <BsTrash3 className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-bold text-white">Eliminar Mesero</h2>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-lime-100 to-green-100 rounded-full">
            <FaUser className="w-10 h-10 text-green-700" />
          </div>
          
          <p className="text-center text-gray-700 mb-2">
            ¿Estás seguro de que deseas eliminar al mesero?
          </p>
          <p className="text-center text-lg font-bold text-gray-900 mb-6">
            {mesero.name}
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <p className="text-green-700 text-sm text-center">
              <span className="font-semibold">⚠️ Advertencia</span>
              <br />Esta acción no se puede deshacer
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-200"
            >
              Eliminar
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
