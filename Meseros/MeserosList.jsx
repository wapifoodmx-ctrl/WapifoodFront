import { FaUser } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";

export default function MeserosList({ meseros, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Mesero
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {meseros.map((mesero) => (
            <tr key={mesero.uuid} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <FaUser className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{mesero.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(mesero)}
                  className="text-green-600 hover:text-green-900 mr-4"
                >
                  <FiEdit className="inline w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(mesero)}
                  className="text-green-600 hover:text-green-900"
                >
                  <BsTrash3 className="inline w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
