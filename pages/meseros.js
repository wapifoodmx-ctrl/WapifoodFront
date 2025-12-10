import Head from "next/head";
import Navbar from "@/dashboardComponents/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { checkPayment } from "@/useCases/checkPayment";
import { IoAddOutline, IoClose, IoEyeOutline, IoSwapHorizontalOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

export default function Meseros() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [meseros, setMeseros] = useState([]);
  const [selectedMesero, setSelectedMesero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState('cards');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    codigoSeguridad: ""
  });

  // Verificar suscripción
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const data = await checkPayment();
        if (!data || !data.has_active_subscription) {
          setShowSubscriptionModal(true);
          setLoading(false);
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error checking subscription:", error);
        setShowSubscriptionModal(true);
        setLoading(false);
        return false;
      }
    };

    checkSubscription();
    setLoading(false);
  }, []);

  // Contador para redirección
  useEffect(() => {
    let interval = null;
    
    if (showSubscriptionModal && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (showSubscriptionModal && countdown === 0) {
      router.push('/payments');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showSubscriptionModal, countdown]);

  // Cargar meseros (aquí integrarás tu API cuando esté lista)
  useEffect(() => {
    // TODO: Implementar carga desde API
    // Por ahora datos de ejemplo
    const meserosMock = [
      { id: 1, nombreCompleto: "Juan Pérez García", codigoSeguridad: "1234" },
      { id: 2, nombreCompleto: "María López Rodríguez", codigoSeguridad: "5678" },
      { id: 3, nombreCompleto: "Carlos Sánchez Martínez", codigoSeguridad: "9012" }
    ];
    setMeseros(meserosMock);
  }, []);

  // Filtrar meseros
  const meserosFiltrados = meseros.filter(mesero =>
    mesero.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers de modales
  const handleOpenAddModal = () => {
    setFormData({ nombreCompleto: "", codigoSeguridad: "" });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (mesero) => {
    setSelectedMesero(mesero);
    setFormData({
      nombreCompleto: mesero.nombreCompleto,
      codigoSeguridad: "" // No mostramos el código real
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedMesero(null);
    setFormData({ nombreCompleto: "", codigoSeguridad: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMesero = (e) => {
    e.preventDefault();
    // TODO: Implementar POST a API
    console.log("Agregar mesero:", formData);
    const newMesero = {
      id: meseros.length + 1,
      ...formData
    };
    setMeseros([...meseros, newMesero]);
    handleCloseModals();
  };

  const handleEditMesero = (e) => {
    e.preventDefault();
    // TODO: Implementar PUT a API
    console.log("Editar mesero:", formData);
    setMeseros(meseros.map(m => 
      m.id === selectedMesero.id 
        ? { ...m, nombreCompleto: formData.nombreCompleto, codigoSeguridad: formData.codigoSeguridad || m.codigoSeguridad }
        : m
    ));
    handleCloseModals();
  };

  const handleDeleteMesero = (id) => {
    // TODO: Implementar DELETE a API
    if (confirm("¿Estás seguro de eliminar este mesero?")) {
      setMeseros(meseros.filter(m => m.id !== id));
    }
  };

  const handleGoToPayments = () => {
    setShowSubscriptionModal(false);
    setCountdown(10);
    router.push('/payments');
  };

  if (showSubscriptionModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <Navbar />
        <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r="28" fill="none" stroke="#059669" strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={`${(countdown / 10) * 175.93} 175.93`}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">{countdown}</span>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-4 text-green-600 text-center">Suscripción Requerida</h2>
            <p className="text-gray-700 mb-4 text-center">
              Tu suscripción ha expirado o no tienes permisos para acceder a esta funcionalidad.
              Por favor, renueva tu suscripción para continuar.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <p className="text-green-700 text-sm text-center">
                <span className="font-semibold">Redirección automática en {countdown} segundo{countdown !== 1 ? 's' : ''}</span>
                <br />Serás redirigido a la página de pagos automáticamente
              </p>
            </div>
            <button onClick={handleGoToPayments} className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold">
              Ir a Pagos Ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Meseros - WapiFood</title>
        <meta name="description" content="Gestión de meseros" />
      </Head>

      <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <Navbar />
        <div className="pt-16">
          {/* Header de Meseros */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                  <FaUser className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Meseros</h1>
                  <p className="text-gray-600 mt-1">Gestiona tu equipo de meseros</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda y botones */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
              {/* Barra de búsqueda */}
              <div className="relative w-full lg:w-1/2">
                <input
                  type="text"
                  placeholder="Buscar mesero..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 pl-10"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-1/2 lg:justify-center lg:items-center">
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <IoAddOutline className="text-lg" />
                  <span>Agregar Mesero</span>
                </button>

                <button
                  onClick={() => vistaActiva === 'cards' ? setVistaActiva('lista') : setVistaActiva('cards')}
                  className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <IoSwapHorizontalOutline className="text-lg" />
                  <span>{vistaActiva === 'cards' ? 'Vista Lista' : 'Vista Cards'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contenido - Cards o Lista */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <span className="ml-4 text-lg text-gray-600">Cargando meseros...</span>
              </div>
            ) : meserosFiltrados.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-500 text-lg">
                  {searchTerm ? (
                    <p className="mb-2">No se encontraron meseros con "{searchTerm}"</p>
                  ) : (
                    <>
                      <p className="mb-4">No hay meseros registrados</p>
                      <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        <IoAddOutline className="text-lg" />
                        Agregar tu primer mesero
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : vistaActiva === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {meserosFiltrados.map((mesero) => (
                  <div
                    key={mesero.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full">
                        <FaUser className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 text-center mb-4">{mesero.nombreCompleto}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(mesero)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                        >
                          <FiEdit />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteMesero(mesero.id)}
                          className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                        >
                          <BsTrash3 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mesero</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {meserosFiltrados.map((mesero) => (
                      <tr key={mesero.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <FaUser className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{mesero.nombreCompleto}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenEditModal(mesero)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <FiEdit className="inline w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMesero(mesero.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <BsTrash3 className="inline w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal Agregar Mesero */}
        {isAddModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModals}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <IoAddOutline className="text-white text-lg" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Agregar Mesero</h2>
                  </div>
                  <button onClick={handleCloseModals} className="text-white/70 hover:text-white transition-colors">
                    <IoClose className="text-2xl" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddMesero} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Pérez García"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Código de Seguridad</label>
                  <input
                    type="password"
                    name="codigoSeguridad"
                    value={formData.codigoSeguridad}
                    onChange={handleInputChange}
                    placeholder="Ingresa un código de 4 dígitos"
                    maxLength="4"
                    pattern="[0-9]{4}"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">El código debe tener 4 dígitos numéricos</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all duration-200"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModals}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar Mesero */}
        {isEditModalOpen && selectedMesero && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseModals}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <FiEdit className="text-white text-lg" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Editar Mesero</h2>
                  </div>
                  <button onClick={handleCloseModals} className="text-white/70 hover:text-white transition-colors">
                    <IoClose className="text-2xl" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleEditMesero} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Código de Seguridad Actual</label>
                  <input
                    type="text"
                    value="****"
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Por seguridad, el código no se muestra</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nuevo Código de Seguridad (opcional)</label>
                  <input
                    type="password"
                    name="codigoSeguridad"
                    value={formData.codigoSeguridad}
                    onChange={handleInputChange}
                    placeholder="Dejar vacío para mantener el actual"
                    maxLength="4"
                    pattern="[0-9]{4}"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Solo completa si deseas cambiar el código</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
                  >
                    Actualizar
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModals}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
