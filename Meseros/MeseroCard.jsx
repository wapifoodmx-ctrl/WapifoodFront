import { FaUser } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";

export default function MeseroCard({ mesero, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
          <FaUser className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 text-center mb-4">{mesero.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(mesero)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200"
          >
            <FiEdit />
            Editar
          </button>
          <button
            onClick={() => onDelete(mesero)}
            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white rounded-lg font-semibold transition-all duration-200"
          >
            <BsTrash3 />
          </button>
        </div>
      </div>
    </div>
  );
}
