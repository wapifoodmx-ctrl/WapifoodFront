import { TbWorldShare } from "react-icons/tb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoLocationOutline } from "react-icons/io5";
import { FaPhoneAlt, FaCheckCircle, FaEdit, FaUser, FaClock, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { BsWhatsapp } from "react-icons/bs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/useCases/getUserInfo";
import { patchUserInfo } from "@/useCases/patchUserInfo";
import { checkPayment } from "@/useCases/checkPayment";
import getPinInventario from "@/useCases/getPinInventario";
import actualizarPinInventario from "@/useCases/patchPinInventario";
import putDeliveryOnOff from "@/useCases/putDeliveryOnOff";
import getDeliveryOnOff from "@/useCases/getDeliveryOnOff";
import Profile from "@/pages/assets/images/Profile.jpg";
import { useRouter } from 'next/router';
import Navbar from "@/dashboardComponents/navbar";
import { menuStyles } from "@/styles/menuStyles";
import { getColorMenu } from "@/useCases/getColorMenu";
import { postColorMenu } from "@/useCases/postColorMenu";
import { patchColorMenu } from "@/useCases/patchColorMenu";

// Esquema base sin profileImage
const baseSchema = Yup.object().shape({
  telephone: Yup.string()
    .matches(/^\d{10}$/, 'El teléfono debe tener exactamente 10 números')
    .required("Teléfono es requerido"),
  restaurantName: Yup.string().required("Nombre del restaurante es requerido"),
  confirmationCode: Yup.string()
    .required("Código de confirmación es requerido")
    .matches(/^\d{4}$/, 'El código debe tener exactamente 4 números'),
  pinInventory: Yup.string()
    .required("PIN de inventario es requerido")
    .matches(/^\d{4}$/, 'El PIN debe tener exactamente 4 números'),
  postalCode: Yup.string()
    .matches(/^\d{1,10}$/, 'El código postal debe contener solo números (máximo 10 dígitos)'),
});

// Crear un esquema dinámico que incluya la validación condicional de imagen
const createValidationSchema = (hasExistingImage) => {
  return baseSchema.shape({
    profileImage: hasExistingImage 
      ? // Si ya tiene imagen, no es obligatoria
        Yup.mixed()
          .nullable() // Permite valores null/undefined
          .notRequired() // Explicitly not required
          .test('fileSize', 'La imagen es demasiado grande (máximo 25MB)', function(value) {
            if (!value) return true;
            return value.size <= 25 * 1024 * 1024; // 25MB
          })
          .test('fileType', 'Solo se permiten imágenes (JPG, PNG, WEBP)', function(value) {
            if (!value) return true;
            return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type);
          })
      : // Si no tiene imagen, es obligatoria
        Yup.mixed()
          .required('La imagen de perfil es obligatoria')
          .test('fileSize', 'La imagen es demasiado grande (máximo 25MB)', function(value) {
            if (!value) return true;
            return value.size <= 25 * 1024 * 1024; // 25MB
          })
          .test('fileType', 'Solo se permiten imágenes (JPG, PNG, WEBP)', function(value) {
            if (!value) return true;
            return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(value.type);
          })
  });
};

// Función para comprimir imagen
const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspecto
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convertir a blob comprimido
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Funciones helper
const getCleanValue = (value) => {
  if (!value || value === "string" || value === "undefined" || value === "null" || value === null || value === undefined) {
    return "";
  }
  return value;
};

const getCleanNumber = (value) => {
  if (!value || value === "string" || value === "undefined" || value === "null" || value === null || value === undefined || value === 0) {
    return "";
  }
  return value;
};

const getFullAddress = (userInfo) => {
  const direccion = getCleanValue(userInfo?.direccion);
  const ciudad = getCleanValue(userInfo?.ciudad);
  const codigoPostal = getCleanNumber(userInfo?.codigo_postal);
  const alcaldia = getCleanValue(userInfo?.alcaldia);
  
  const addressParts = [direccion, ciudad, codigoPostal, alcaldia].filter(part => part !== "");
  
  if (addressParts.length === 0) {
    return "Sin dirección";
  }
  
  return addressParts.join(", ");
};

const shouldShowDigitalMenu = (userInfo) => {
  const hasRestaurantName = getCleanValue(userInfo?.nombre_restaurante);
  const hasPhone = getCleanValue(userInfo?.telefono);
  return hasRestaurantName && hasPhone;
};

export default function UserPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('default');
  const [pinInventario, setPinInventario] = useState("");
  const [savingStyle, setSavingStyle] = useState(false);
  const [hasExistingStyle, setHasExistingStyle] = useState(false);
  const [showStyleSuccessModal, setShowStyleSuccessModal] = useState(false);
  const [showStyleErrorModal, setShowStyleErrorModal] = useState(false);
  const [styleModalMessage, setStyleModalMessage] = useState('');
  const [isDeliveryActive, setIsDeliveryActive] = useState(false);
  
  // NUEVOS ESTADOS PARA TOAST
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const router = useRouter();

  // FUNCIÓN PARA MOSTRAR TOAST
  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 2000);
  };

  // Función para obtener el estado del delivery
  const fetchDeliveryStatus = async (userUuid) => {
    try {
      const response = await getDeliveryOnOff(userUuid);
      setIsDeliveryActive(response.is_delivery_active || false);
    } catch (error) {
      console.error('Error al obtener el estado de delivery:', error);
      setIsDeliveryActive(false);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        const user = data.user_info;
        setUserInfo(user);
        
        // Obtener el estado del delivery después de obtener la info del usuario
        if (user?.user_uuid) {
          await fetchDeliveryStatus(user.user_uuid);
        }
      } catch (error) {
        console.error('Error al cargar información del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkSubscriptionStatus = async () => {
      try {
        const response = await checkPayment();
        setHasActiveSubscription(response.has_active_subscription || false);
      } catch (error) {
        console.error('Error al verificar suscripción:', error);
        setHasActiveSubscription(false);
      }
    };

    const fetchPinInventario = async () => {
      try {
        const response = await getPinInventario();
        if (response.pin_code) {
          setPinInventario(response.pin_code);
        }
      } catch (error) {
        console.error('Error al obtener PIN de inventario:', error);
      }
    };

    // FUNCIÓN MODIFICADA para detectar si ya existe un estilo guardado
    const fetchColorMenu = async () => {
      try {
        const response = await getColorMenu();
        if (response && response.color) {
          setSelectedStyle(response.color);
          setHasExistingStyle(true); // Marcar que ya existe un estilo
        }
      } catch (error) {
        console.error('Error al obtener el estilo del menú:', error);
        // Si hay error 404, significa que no existe aún
        if (error.message.includes('404')) {
          setHasExistingStyle(false);
        }
      }
    };

    fetchUserInfo();
    checkSubscriptionStatus();
    fetchPinInventario();
    fetchColorMenu();
  }, []);

  const handleImageChange = async (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    setProcessingImage(true);

    try {
      // Validar tamaño antes de procesar
      if (file.size > 10 * 1024 * 1024) { // 10MB
        showToast('La imagen es demasiado grande. Por favor selecciona una imagen menor a 10MB.', 'error');
        return;
      }

      // Comprimir imagen si es necesario
      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) { // Si es mayor a 2MB, comprimir
        processedFile = await compressImage(file);
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Establecer archivo en Formik
      setFieldValue("profileImage", processedFile);
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      showToast('Error al procesar la imagen. Inténtalo de nuevo.', 'error');
    } finally {
      setProcessingImage(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updateData = {
        telefono: values.telephone,
        direccion: values.street,
        codigo_postal: values.postalCode ? parseInt(values.postalCode) : null,
        ciudad: values.neighborhood,
        alcaldia: values.delegation,
        nombre_restaurante: values.restaurantName,
        whatsapp: values.whatsapp,
        horario: values.horario,
        codigo_confirmacion: values.confirmationCode ? parseInt(values.confirmationCode) : null,
      };

      // Solo agregar imagen si realmente hay una
      if (values.profileImage && values.profileImage instanceof File) {
        updateData.image = values.profileImage;
      }

      // Actualizar información del usuario
      const updatedUser = await patchUserInfo(updateData);
      setUserInfo(updatedUser);

      // Actualizar PIN de inventario si ha cambiado
      if (values.pinInventory && values.pinInventory !== pinInventario) {
        const pinResult = await actualizarPinInventario(values.pinInventory);
        
        if (!pinResult.success) {
          throw new Error(pinResult.error || 'Error al actualizar el PIN de inventario');
        }
        
        // Actualizar el estado local del PIN
        setPinInventario(values.pinInventory);
      }

      // Actualizar estado de delivery
      try {
        await putDeliveryOnOff(isDeliveryActive);
        
        // Obtener el estado actualizado del delivery después de guardar
        if (userInfo?.user_uuid) {
          await fetchDeliveryStatus(userInfo.user_uuid);
        }
      } catch (deliveryError) {
        console.error('Error al actualizar delivery:', deliveryError);
        showToast('Información guardada, pero hubo un error al actualizar el estado de delivery', 'error');
      }

      setShowSuccessModal(true);
      setEditMode(false);
      setImagePreview(null);
    } catch (error) {
      console.error('Error al actualizar:', error);
      
      // Mejorar manejo de errores
      if (error.message.includes('413') || error.message.includes('too large')) {
        showToast('La imagen es demasiado grande. Por favor, selecciona una imagen más pequeña.', 'error');
      } else if (error.message.includes('CORS')) {
        showToast('Error de conexión. Por favor, inténtalo de nuevo.', 'error');
      } else if (error.message.includes('PIN')) {
        showToast(`Error con el PIN: ${error.message}`, 'error');
      } else {
        showToast('Error al actualizar la información. Inténtalo de nuevo.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  if (loading) {
    return (
      <div className="h-screen min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-green-50">
        {/* Navbar */}
        <Navbar />
        
        {/* Loading content */}
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-xl shadow-lg p-8 flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="text-gray-600 font-medium">Cargando información del usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  // Verificar si el usuario ya tiene una imagen (versión más robusta)
  const hasExistingImage = Boolean(
    userInfo?.image_user?.url && 
    userInfo.image_user.url.trim() !== "" && 
    userInfo.image_user.url !== "null" && 
    userInfo.image_user.url !== "undefined"
  );

  // console.log('hasExistingImage:', hasExistingImage, 'Image URL:', userInfo?.image_user?.url); // Para debug

  // Función para manejar el click en "Ver menú"
  const handleViewMenuClick = () => {
    if (hasActiveSubscription) {
      // Generar URL con el estilo seleccionado
      const styleParam = selectedStyle !== 'default' ? `?style=${selectedStyle}` : '';
      window.open(`/webmenu/${userInfo?.user_uuid}${styleParam}`, '_blank');
    } else {
      // Si no tiene suscripción activa, mostrar popup
      setShowSubscriptionPopup(true);
      // Auto-cerrar el popup después de 4 segundos
      setTimeout(() => {
        setShowSubscriptionPopup(false);
      }, 4000);
    }
  };

  // FUNCIÓN MODIFICADA para usar POST o PATCH según corresponda
  const handleSaveStyle = async () => {
    setSavingStyle(true);
    try {
      let response;
      
      if (hasExistingStyle) {
        // Si ya existe un estilo, usar PATCH para actualizar
        response = await patchColorMenu(selectedStyle);
        setStyleModalMessage('Estilo actualizado correctamente');
      } else {
        // Si no existe, usar POST para crear
        response = await postColorMenu(selectedStyle);
        setHasExistingStyle(true); // Marcar que ahora ya existe
        setStyleModalMessage('Estilo guardado correctamente');
      }
      
      // Cerrar el modal de selección
      setShowColorModal(false);
      
      // Mostrar modal de éxito
      setShowStyleSuccessModal(true);
      
    } catch (error) {
      console.error('Error al guardar el estilo:', error);
      
      // Mejorar el manejo de errores
      if (error.message.includes('404') && hasExistingStyle) {
        // Si falló PATCH por 404, intentar con POST
        try {
          await postColorMenu(selectedStyle);
          setHasExistingStyle(true);
          setShowColorModal(false);
          setStyleModalMessage('Estilo guardado correctamente');
          setShowStyleSuccessModal(true);
        } catch (retryError) {
          setStyleModalMessage('Error al guardar el estilo. Por favor, inténtalo de nuevo.');
          setShowStyleErrorModal(true);
        }
      } else {
        setStyleModalMessage('Error al guardar el estilo. Por favor, inténtalo de nuevo.');
        setShowStyleErrorModal(true);
      }
    } finally {
      setSavingStyle(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Navbar */}
      <Navbar />
      
      {/* COMPONENTE TOAST */}
      {toast.show && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className={`pointer-events-auto px-6 py-4 rounded-xl shadow-2xl transform animate-scale-in ${
            toast.type === 'error' 
              ? 'bg-red-500 text-white' 
              : toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}>
            <div className="flex items-center gap-3">
              {toast.type === 'error' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.type === 'success' && (
                <FaCheckCircle className="text-2xl" />
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenido principal con padding-top para evitar solapamiento */}
      <div className="pt-16 p-4 pb-8">
        {/* Modal de éxito mejorado */}
        {showSuccessModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl transform animate-scale-in">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Perfecto!
                </h3>
                <p className="text-gray-600">
                  Tu información ha sido actualizada exitosamente
                </p>
              </div>
              <button
                onClick={closeSuccessModal}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* NUEVA MODAL DE ÉXITO PARA ESTILOS */}
        {showStyleSuccessModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl transform animate-scale-in">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Excelente!
                </h3>
                <p className="text-gray-600">
                  {styleModalMessage}
                </p>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    Tu menú digital ahora luce con el estilo <strong>{menuStyles[selectedStyle]?.name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStyleSuccessModal(false)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* NUEVA MODAL DE ERROR PARA ESTILOS */}
        {showStyleErrorModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl transform animate-scale-in">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Ups, algo salió mal
                </h3>
                <p className="text-gray-600">
                  {styleModalMessage}
                </p>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700">
                    💡 Verifica tu conexión a internet e inténtalo nuevamente
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStyleErrorModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setShowStyleErrorModal(false);
                    setShowColorModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup de suscripción requerida para menú digital */}
        {showSubscriptionPopup && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl transform animate-scale-in border-l-4 border-orange-500">
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TbWorldShare className="text-orange-500 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Suscripción Requerida
                </h3>
                <p className="text-gray-600">
                  Para ver tu Menú Digital favor de renovar o contratar uno de nuestros paquetes
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubscriptionPopup(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setShowSubscriptionPopup(false);
                    router.push('/payments');
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Ver Paquetes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Selección de Color - CON INDICADOR DE ESTADO */}
        {showColorModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-3xl w-full mx-auto shadow-2xl transform animate-scale-in max-h-[90vh] flex flex-col">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Selecciona el estilo de tu menú
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Elige el diseño que mejor represente tu restaurante
                    </p>
                  </div>
                  {/* INDICADOR DE ESTADO */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    hasExistingStyle 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {hasExistingStyle ? '🔄 Actualizar' : '✨ Nuevo'}
                  </div>
                </div>
              </div>

              {/* Área scrollable: solo aquí estará el grid de estilos */}
              <div className="overflow-y-auto flex-1 pr-2 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(menuStyles).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStyle(key)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedStyle === key
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-green-300'
                      }`}
                    >
                      {/* Indicador de selección */}
                      {selectedStyle === key && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-white text-sm" />
                        </div>
                      )}

                      {/* Preview del gradiente del header */}
                      <div className={`h-16 rounded-lg mb-3 bg-gradient-to-r ${style.colors.headerGradient}`}></div>

                      {/* Nombre del estilo */}
                      <h4 className="font-bold text-gray-800 mb-2">{style.name}</h4>

                      {/* Muestra de colores */}
                      <div className="flex gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${style.colors.buttonGradient}`}></div>
                        <div className={`w-8 h-8 rounded-full ${style.colors.badge}`}></div>
                        <div className={`w-8 h-8 rounded-full ${style.colors.decorativeCircles[0]}`}></div>
                      </div>

                      {/* Descripción rápida del tema */}
                      <p className="text-xs text-gray-500">
                        {key === 'default' && 'Estilo clásico y profesional'}
                        {key === 'tokyo' && 'Moderno estilo neón'}
                        {key === 'midnight' && 'Elegante y minimalista'}
                        {key === 'sunset' && 'Cálido y acogedor'}
                        {key === 'ocean' && 'Fresco y marino'}
                        {key === 'luxury' && 'Premium y sofisticado'}
                        {key === 'garden' && 'Natural y fresco'}
                        {key === 'berry' && 'Dulce y moderno'}
                        {key === 'espresso' && 'Tierra y café'}
                        {key === 'aurora' && 'Colores boreales'}
                        {key === 'latte' && 'Perfecto para cafés'}
                        {key === 'mocha' && 'Cafetería moderna'}
                        {key === 'cappuccino' && 'Elegancia cafetera'}
                        {key === 'fiesta' && 'Vibrante mexicano'}
                        {key === 'azteca' && 'Tradicional mexicano'}
                        {key === 'mariachi' && 'Festivo mexicano'}
                        {key === 'tequila' && 'Premium mexicano'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vista previa del estilo seleccionado (estática) */}
              {selectedStyle && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Vista previa:</strong> {menuStyles[selectedStyle].name}
                  </p>
                  <div className={`h-24 rounded-lg bg-gradient-to-r ${menuStyles[selectedStyle].colors.headerGradient} flex items-center justify-center`}>
                    <span className="text-white font-bold text-xl">
                      {userInfo?.nombre_restaurante || "Tu Restaurante"}
                    </span>
                  </div>
                </div>
              )}

              {/* Botones (estáticos) */}
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  onClick={() => {
                    setShowColorModal(false);
                  }}
                  disabled={savingStyle}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveStyle}
                  disabled={savingStyle}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {savingStyle ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {hasExistingStyle ? 'Actualizando...' : 'Guardando...'}
                    </div>
                  ) : (
                    hasExistingStyle ? '🔄 Actualizar Estilo' : '✨ Aplicar Estilo'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header del perfil */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Banner superior */}
            <div className="h-32 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Información del perfil */}
            <div className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="relative -mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                    <Image 
                      src={userInfo?.image_user?.url || Profile} 
                      alt="Imagen de perfil" 
                      width={128} 
                      height={128} 
                      className="object-cover w-full h-full" 
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Nombre y título */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {getCleanValue(userInfo?.nombre_restaurante) || "Tu Restaurante"}
                </h1>
                <p className="text-gray-600 font-medium">Propietario</p>
              </div>

              {/* Información de contacto en cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Email */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CiMail className="text-white text-xl" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {getCleanValue(userInfo?.email) || "email@ejemplo.com"}
                  </p>
                </div>

                {/* Teléfono */}
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FaPhoneAlt className="text-white text-lg" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Teléfono</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {getCleanValue(userInfo?.telefono) || "Sin teléfono"}
                  </p>
                </div>

                {/* Dirección */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Ubicación</p>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {getFullAddress(userInfo)}
                  </p>
                </div>

                {/* Menú Digital - MODIFICADO with icono de editar */}
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 text-center relative">
                  {/* Icono de editar en esquina superior derecha */}
                  <button
                    onClick={() => setShowColorModal(true)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
                  >
                    <FaEdit className="text-green-600 text-sm" />
                  </button>
                  
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TbWorldShare className="text-white text-xl" />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Menú Digital</p>
                  {shouldShowDigitalMenu(userInfo) ? (
                    <button 
                      onClick={handleViewMenuClick}
                      className={`text-sm font-semibold transition-colors ${
                        hasActiveSubscription 
                          ? 'text-green-600 hover:text-emerald-700' 
                          : 'text-orange-600 hover:text-red-700'
                      }`}
                    >
                      Ver menú
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">No disponible</p>
                  )}
                </div>
              </div>

              {/* Botón de editar */}
              <div className="text-center">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <FaEdit className="text-lg" />
                  Editar información
                </button>
              </div>
            </div>
          </div>

          {/* Formulario de edición */}
          {editMode && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaUser className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Editar Información</h2>
                  <p className="text-gray-600">Actualiza los datos de tu restaurante</p>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Nota:</strong> Los siguientes datos aparecerán en tu página web. 
                  Revisa cuidadosamente antes de guardar los cambios.
                </p>
              </div>

              <Formik
                initialValues={{
                  restaurantName: getCleanValue(userInfo?.nombre_restaurante),
                  street: getCleanValue(userInfo?.direccion),
                  neighborhood: getCleanValue(userInfo?.ciudad),
                  delegation: getCleanValue(userInfo?.alcaldia),
                  telephone: getCleanValue(userInfo?.telefono),
                  whatsapp: getCleanValue(userInfo?.whatsapp),
                  postalCode: getCleanNumber(userInfo?.codigo_postal),
                  horario: getCleanValue(userInfo?.horario),
                  confirmationCode: getCleanNumber(userInfo?.codigo_confirmacion),
                  pinInventory: pinInventario || "", // Usar el PIN obtenido de la API
                  profileImage: null,
                }}
                validationSchema={createValidationSchema(hasExistingImage)}
                onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                {({ setFieldValue, isSubmitting, values }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Nombre del restaurante */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="restaurantName">
                          Nombre del restaurante <span className="text-red-500">*</span>
                        </label>
                        <Field 
                          type="text" 
                          id="restaurantName" 
                          name="restaurantName" 
                          placeholder="Ej: Las Flautas de Pepe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                        />
                        <ErrorMessage name="restaurantName" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Calle */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="street">
                          Calle y número
                        </label>
                        <Field 
                          type="text" 
                          id="street" 
                          name="street" 
                          placeholder="Ej: Av. Reforma #123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                        />
                        <ErrorMessage name="street" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Colonia */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="neighborhood">
                          Colonia
                        </label>
                        <Field 
                          type="text" 
                          id="neighborhood" 
                          name="neighborhood" 
                          placeholder="Ej: Lomas de Hidalgo"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                        />
                        <ErrorMessage name="neighborhood" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Delegación */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="delegation">
                          Delegación
                        </label>
                        <Field 
                          type="text" 
                          id="delegation" 
                          name="delegation" 
                          placeholder="Ej: Cuauhtémoc"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                        />
                        <ErrorMessage name="delegation" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Código postal */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="postalCode">
                          Código Postal
                        </label>
                        <Field 
                          type="text" 
                          id="postalCode" 
                          name="postalCode" 
                          placeholder="Ej: 06100"
                          maxLength="10"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          }}
                        />
                        <ErrorMessage name="postalCode" component="div" className="text-red-500 text-sm mt-1" />
                        <p className="text-gray-500 text-xs mt-1">Solo números, máximo 10 dígitos</p>
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="telephone">
                          Teléfono <span className="text-red-500">*</span>
                        </label>
                        <Field 
                          type="tel" 
                          id="telephone" 
                          name="telephone" 
                          placeholder="Ej: 5512345678"
                          maxLength="10"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            if (e.target.value.length > 10) {
                              e.target.value = e.target.value.slice(0, 10);
                            }
                          }}
                        />
                        <ErrorMessage name="telephone" component="div" className="text-red-500 text-sm mt-1" />
                        <p className="text-gray-500 text-xs mt-1">Solo números, máximo 10 dígitos</p>
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="whatsapp">
                          WhatsApp
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <BsWhatsapp className="text-green-500 text-lg" />
                          </div>
                          <Field 
                            type="url" 
                            id="whatsapp" 
                            name="whatsapp" 
                            placeholder="https://api.whatsapp.com/message/..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                          />
                        </div>
                        <ErrorMessage name="whatsapp" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Horario */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="horario">
                          Horario
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaClock className="text-blue-500 text-lg" />
                          </div>
                          <Field 
                            type="text" 
                            id="horario" 
                            name="horario" 
                            placeholder="Ej: Lun-Vie 9:00-18:00"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                          />
                        </div>
                        <ErrorMessage name="horario" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Código de confirmación */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="confirmationCode">
                          Código de confirmación <span className="text-red-500">*</span>
                        </label>
                        
                        <Field 
                          type="password" 
                          id="confirmationCode" 
                          name="confirmationCode" 
                          placeholder="Ej: 1234"
                          maxLength="4"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            if (e.target.value.length > 4) {
                              e.target.value = e.target.value.slice(0, 4);
                            }
                          }}
                        />
                        <ErrorMessage name="confirmationCode" component="div" className="text-red-500 text-sm mt-1" />
                        <p className="text-gray-500 text-xs mt-1">4 números del 0 al 9 (requerido)</p>
                      </div>

                      {/* PIN (Inventario) */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="pinInventory">
                          PIN (Inventario) <span className="text-red-500">*</span>
                          {pinInventario && (
                            <span className="ml-2 text-xs text-green-600 font-normal">
                              • PIN actual configurado
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaLock className="text-purple-500 text-lg" />
                          </div>
                          <Field 
                            type="password" 
                            id="pinInventory" 
                            name="pinInventory" 
                            placeholder="Ej: 5678"
                            maxLength="4"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '');
                              if (e.target.value.length > 4) {
                                e.target.value = e.target.value.slice(0, 4);
                              }
                            }}
                          />
                        </div>
                        <ErrorMessage name="pinInventory" component="div" className="text-red-500 text-sm mt-1" />
                        <p className="text-gray-500 text-xs mt-1">
                          4 números del 0 al 9 (requerido)
                        </p>
                        {values.pinInventory && values.pinInventory !== pinInventario && (
                          <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                            <span>⚠️</span>
                            <span>Se actualizará el PIN de inventario</span>
                          </p>
                        )}
                      </div>

                      {/* Delivery Toggle */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Delivery (Este boton es para indicar si tienes Delivery o no)
                        </label>
                        <div className="relative h-[52px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-gray-300 flex items-center justify-between px-4">
                          <div className="flex items-center gap-2">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-5 w-5 ${isDeliveryActive ? 'text-green-500' : 'text-gray-400'} transition-colors duration-300`}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" 
                              />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                              {isDeliveryActive ? (
                                <span className="text-green-600">Activo</span>
                              ) : (
                                <span className="text-gray-500">Inactivo</span>
                              )}
                            </span>
                          </div>
                          
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => setIsDeliveryActive(!isDeliveryActive)}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                              isDeliveryActive ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                                isDeliveryActive ? 'translate-x-8' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {isDeliveryActive ? 'Servicio de delivery habilitado' : 'Servicio de delivery deshabilitado'}
                        </p>
                      </div>
                      
                      {/* Imagen de perfil */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="profileImage">
                          Imagen de perfil 
                          {!hasExistingImage && <span className="text-red-500">*</span>}
                        </label>
                        
                        {/* Mostrar imagen actual si existe */}
                        {hasExistingImage && !imagePreview && (
                          <div className="mb-4 text-center">
                            <img 
                              src={userInfo.image_user.url} 
                              alt="Imagen actual" 
                              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200"
                            />
                            <p className="text-sm text-gray-500 mt-2">Imagen actual</p>
                          </div>
                        )}
                        
                        {/* Preview de nueva imagen */}
                        {imagePreview && (
                          <div className="mb-4 text-center">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-green-200"
                            />
                            <p className="text-sm text-gray-500 mt-2">Vista previa de la nueva imagen</p>
                          </div>
                        )}
                        
                        <input
                          type="file"
                          id="profileImage"
                          name="profileImage"
                          accept="image/*"
                          disabled={processingImage}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                          onChange={(event) => handleImageChange(event, setFieldValue)}
                        />
                        
                        {processingImage && (
                          <div className="flex items-center gap-2 mt-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                            <span className="text-sm">Procesando imagen...</span>
                          </div>
                        )}
                        
                        <ErrorMessage name="profileImage" component="div" className="text-red-500 text-sm mt-1" />
                        <p className="text-gray-500 text-xs mt-1">
                          Formatos soportados: JPG, PNG, WEBP. Tamaño máximo: 5MB. 
                          {hasExistingImage 
                            ? "La imagen se optimizará automáticamente. (Opcional - ya tienes una imagen)"
                            : "La imagen se optimizará automáticamente. (Obligatorio)"
                          }
                        </p>
                      </div>
                    </div>
                    
                    {/* Botones */}
                    <div className="flex gap-4 pt-6">
                      <button 
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setImagePreview(null);
                        }}
                        className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting || processingImage}
                        className={`flex-1 py-3 px-6 rounded-xl font-medium text-white transition-all duration-200 ${
                          isSubmitting || processingImage
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Guardando...
                          </div>
                        ) : processingImage ? (
                          'Procesando imagen...'
                        ) : (
                          'Guardar Cambios'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
