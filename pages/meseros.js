import Head from "next/head";
import Navbar from "@/dashboardComponents/navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { checkPayment } from "@/useCases/checkPayment";
import { getMeseros } from "@/useCases/getMeseros";
import { postMeseros } from "@/useCases/postMeseros";
import { updateMeseros } from "@/useCases/updateMeseros";
import { deleteMeseros } from "@/useCases/deleteMeseros";
import { IoAddOutline, IoSwapHorizontalOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import MeseroCard from "@/Meseros/MeseroCard";
import MeserosList from "@/Meseros/MeserosList";
import AddMeseroModal from "@/Meseros/AddMeseroModal";
import EditMeseroModal from "@/Meseros/EditMeseroModal";
import DeleteMeseroModal from "@/Meseros/DeleteMeseroModal";
import { toast } from "@/components/Toast";

export default function Meseros() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [meseros, setMeseros] = useState([]);
  const [selectedMesero, setSelectedMesero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState('cards');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [meseroToDelete, setMeseroToDelete] = useState(null);
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
  }, [showSubscriptionModal, countdown, router]);

  // Cargar meseros desde API
  const cargarMeseros = async () => {
    try {
      setLoading(true);
      const data = await getMeseros();
      setMeseros(data);
    } catch (error) {
      console.error("Error al cargar meseros:", error);
      setMeseros([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMeseros();
  }, []);

  // Filtrar meseros
  const meserosFiltrados = meseros.filter(mesero =>
    mesero.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers de modales
  const handleOpenAddModal = () => {
    setFormData({ nombreCompleto: "", codigoSeguridad: "" });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (mesero) => {
    setSelectedMesero(mesero);
    setFormData({
      nombreCompleto: mesero.name,
      codigoSeguridad: ""
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (mesero) => {
    setMeseroToDelete(mesero);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedMesero(null);
    setMeseroToDelete(null);
    setFormData({ nombreCompleto: "", codigoSeguridad: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMesero = async () => {
    try {
      setLoading(true);
      await postMeseros({
        name: formData.nombreCompleto,
        access_code: formData.codigoSeguridad
      });
      await cargarMeseros();
      handleCloseModals();
      toast.success('Mesero agregado exitosamente');
    } catch (error) {
      console.error("Error al agregar mesero:", error);
      
      // Verificar si es un error de código duplicado
      if (error.message && error.message.includes('Ya tienes un mesero registrado con el código')) {
        toast.error('El código de seguridad ya está en uso. Por favor, elige otro código diferente.');
      } else if (error.message && error.message.includes('400')) {
        toast.error('El código de seguridad ya está registrado. Intenta con un código diferente.');
      } else {
        toast.error('Error al agregar el mesero. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditMesero = async () => {
    try {
      setLoading(true);
      const updateData = {
        name: formData.nombreCompleto
      };
      
      // Solo incluir el código si se proporcionó uno nuevo
      if (formData.codigoSeguridad) {
        updateData.access_code = formData.codigoSeguridad;
      }

      await updateMeseros(selectedMesero.uuid, updateData);
      await cargarMeseros();
      handleCloseModals();
      toast.success('Mesero actualizado exitosamente');
    } catch (error) {
      console.error("Error al editar mesero:", error);
      
      // Verificar si es un error de código duplicado
      if (error.message && error.message.includes('Ya tienes un mesero registrado con el código')) {
        toast.error('El código de seguridad ya está en uso. Por favor, elige otro código diferente.');
      } else if (error.message && error.message.includes('400')) {
        toast.error('El código de seguridad ya está registrado. Intenta con un código diferente.');
      } else {
        toast.error('Error al actualizar el mesero. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteMeseros(meseroToDelete.uuid);
      await cargarMeseros();
      handleCloseModals();
      toast.success('Mesero eliminado exitosamente');
    } catch (error) {
      console.error("Error al eliminar mesero:", error);
      toast.error('Error al eliminar el mesero. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
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
        <meta name="description" content="Gestión de meseros y personal de servicio" />
        <link rel="icon" href="/favicon.ico" />
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
                    <p className="mb-2">No se encontraron meseros con &quot;{searchTerm}&quot;</p>
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
                  <MeseroCard
                    key={mesero.uuid}
                    mesero={mesero}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </div>
            ) : (
              <MeserosList
                meseros={meserosFiltrados}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
            )}
          </div>
        </div>

        {/* Modales */}
        <AddMeseroModal
          isOpen={isAddModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleAddMesero}
          formData={formData}
          onInputChange={handleInputChange}
        />

        <EditMeseroModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleEditMesero}
          formData={formData}
          onInputChange={handleInputChange}
          mesero={selectedMesero}
        />

        <DeleteMeseroModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          mesero={meseroToDelete}
        />
      </section>
    </>
  );
}
