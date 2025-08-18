import Head from 'next/head';
import { useRouter } from 'next/router';
import { HiOutlineScale, HiOutlineShieldCheck, HiOutlineDocumentText, HiOutlineUserGroup, HiOutlineCreditCard, HiOutlineGlobe, HiArrowLeft } from 'react-icons/hi';
import { MdOutlinePrivacyTip, MdOutlineGavel, MdOutlineEmail, MdOutlinePhone } from 'react-icons/md';

export default function TermsAndConditions() {
    const router = useRouter();

    const sections = [
        {
            id: 'acceptance',
            title: '1. Aceptación de los Términos',
            icon: <HiOutlineScale className="text-2xl text-green-600" />,
            content: 'Al descargar, instalar o utilizar la Aplicación, usted acepta cumplir con estos Términos y Condiciones. Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor tan pronto como se publiquen en esta página. Es su responsabilidad revisar periódicamente estos términos.'
        },
        {
            id: 'description',
            title: '2. Descripción de la Aplicación',
            icon: <HiOutlineDocumentText className="text-2xl text-green-600" />,
            content: 'Wapifood es una aplicación diseñada para gestionar pedidos, procesar pagos y administrar menú digital y/o sitio web.',
            features: [
                'Gestionar pedidos casi en tiempo real gracias a nuestra infraestructura',
                'Punto de venta para gestionar sus pagos y productos en base a una categoría y disponibilidad',
                'Dashboard interactivo, resúmenes de ventas por tiempo, año, mes, y semana',
                'Menú digital. Wapifood no se hace responsable por el mal uso de los datos mostrados en tu menú digital, así como en tu menú web'
            ]
        },
        {
            id: 'eligibility',
            title: '3. Elegibilidad',
            icon: <HiOutlineUserGroup className="text-2xl text-green-600" />,
            content: 'Debe tener al menos 18 años o la edad legal en su jurisdicción para utilizar la Aplicación. Al usar la Aplicación, declara que tiene la capacidad legal para celebrar contratos vinculantes.',
            warnings: [
                'Wapifood se reserva de revisar estos datos por lo que las consecuencias del uso indebido del software recaerá en la persona a cargo de la cuenta registrada',
                'En caso de que sus datos dentro de la aplicación, interfieran con alguna ley aplicable a su ciudad, estado o país, wapifood se deslinda de cualquier responsabilidad legal',
                'Queda estrictamente prohibido la publicación de drogas, armas, contenido inapropiado, y cualquier otro que pueda poner en riesgo la vida/salud de una persona',
                'Wapifood cooperará en todo momento con las autoridades correspondientes en caso de que sea necesario una investigación aplicable a la ley de tu ciudad, estado o país'
            ]
        },
        {
            id: 'account',
            title: '4. Cuenta de Usuario',
            icon: <HiOutlineShieldCheck className="text-2xl text-green-600" />,
            content: 'Para utilizar ciertas funciones de la Aplicación, debe registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad de sus credenciales y de toda la actividad que ocurra bajo su cuenta.',
            points: [
                'Nos reservamos el derecho de suspender o terminar su cuenta si detectamos un uso indebido, fraude o violación de estos términos',
                'Debe proporcionar información precisa y actualizada al registrarse',
                'Su información y datos personales en todo momento serán su responsabilidad, por lo que al hacer uso de la aplicación, está aceptando la publicación de los mismos dentro de la plataforma (Wapifood)'
            ]
        },
        {
            id: 'acceptable-use',
            title: '5. Uso Aceptable',
            icon: <HiOutlineGlobe className="text-2xl text-green-600" />,
            content: 'Usted acepta utilizar la Aplicación solo para fines legales y de acuerdo con estos términos.',
            restrictions: [
                'No realizar ingeniería inversa, descompilar o intentar extraer el código fuente de la Aplicación',
                'No utilizar la Aplicación para transmitir contenido malicioso, ilegal o que infrinja derechos de terceros',
                'No interferir con el funcionamiento de la Aplicación o los servidores que la alojan'
            ]
        },
        {
            id: 'payments',
            title: '6. Pagos y Vigencias',
            icon: <HiOutlineCreditCard className="text-2xl text-green-600" />,
            content: 'La Aplicación puede ofrecer servicios de pago, y transacciones a través de mercado pago. Los precios y detalles de los planes están disponibles en la Aplicación o en nuestro sitio web.',
            paymentInfo: [
                'Todos los pagos se procesan a través de terceros MercadoPago. Nosotros no almacenamos ni tenemos acceso directo a sus datos de pago, salvo lo necesario para la gestión de su cuenta (correo electrónico)',
                'Los pagos no se renuevan automáticamente según el plan seleccionado',
                'Puede solicitar reembolso de su pago únicamente en cinco días posteriores a su pago realizado'
            ]
        },
        {
            id: 'intellectual-property',
            title: '7. Propiedad Intelectual',
            icon: <MdOutlineGavel className="text-2xl text-green-600" />,
            content: 'Todos los derechos de propiedad intelectual de la Aplicación, incluidos el diseño, logotipos, código y contenido, son propiedad de Wapifood o sus licenciantes.',
            license: 'Usted recibe una licencia limitada, no exclusiva y no transferible para usar la Aplicación conforme a estos términos, pero no adquiere ningún derecho de propiedad sobre ella. Al obtener su licencia limitada usted podrá hacer uso del sistema conforme a las limitaciones de su paquete.'
        },
        {
            id: 'privacy',
            title: '8. Privacidad',
            icon: <MdOutlinePrivacyTip className="text-2xl text-green-600" />,
            content: 'Podemos compartir datos con terceros (procesadores de pago) únicamente para procesar la vigencia de su servicio, cualquier otro uso deberá validarlo en las políticas de privacidad de la pasarela de pago (Mercadopago).',
            privacy: 'Wapifood en ningún momento tendrá acceso a los datos de su tarjeta, cuenta bancaria o demás información relacionado con los pagos, dado que todo lo gestiona mercado pago.'
        }
    ];

    return (
        <>
            <Head>
                <title>Términos y Condiciones - WapiFood</title>
                <meta name="description" content="Términos y condiciones de uso de WapiFood" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-green-100 rounded-full opacity-30 blur-xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-100 rounded-full opacity-25 blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-teal-100 rounded-full opacity-20 blur-lg animate-pulse delay-500"></div>
                </div>

                {/* Header con botón de regreso */}
                <div className="relative z-10 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-white hover:text-green-100 transition-colors duration-200 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <HiArrowLeft className="text-xl" />
                                <span className="hidden sm:inline">Regresar</span>
                            </button>
                            
                            <div className="text-center flex-1">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                                    Términos y Condiciones
                                </h1>
                                <p className="text-green-100 mt-2 text-sm sm:text-base">
                                    WapiFood - Gestión de restaurantes
                                </p>
                            </div>
                            
                            <div className="w-20 sm:w-32"></div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    {/* Introducción */}
                    <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 sm:p-8 mb-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-3 shadow-lg">
                                <HiOutlineDocumentText className="text-2xl text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                                    Bienvenido/a a Wapifood
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                    Al acceder o utilizar esta Aplicación, usted acepta estar sujeto/a a los siguientes 
                                    Términos y Condiciones. Lea cuidadosamente este documento antes de usar la Aplicación. 
                                    Si no está de acuerdo con estos términos, por favor, no utilice la Aplicación.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Secciones de términos - Ahora sin dropdowns */}
                    <div className="space-y-6 sm:space-y-8">
                        {sections.map((section, index) => (
                            <div key={section.id} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 sm:p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full p-3">
                                        {section.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                                            {section.title}
                                        </h3>
                                        
                                        <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                                            {section.content}
                                        </p>

                                        {section.features && (
                                            <div className="mb-4">
                                                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                                                    Servicios que ofrecemos:
                                                </h4>
                                                <ul className="space-y-2">
                                                    {section.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-gray-600 text-sm sm:text-base">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {section.warnings && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                                <h4 className="font-semibold text-yellow-800 mb-3 text-sm sm:text-base">
                                                    ⚠️ Importante:
                                                </h4>
                                                <ul className="space-y-2">
                                                    {section.warnings.map((warning, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-yellow-700 text-sm">{warning}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {section.points && (
                                            <ul className="space-y-2">
                                                {section.points.map((point, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-gray-600 text-sm sm:text-base">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {section.restrictions && (
                                            <div className="mb-4">
                                                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                                                    Restricciones:
                                                </h4>
                                                <ul className="space-y-2">
                                                    {section.restrictions.map((restriction, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-gray-600 text-sm sm:text-base">{restriction}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {section.paymentInfo && (
                                            <ul className="space-y-2">
                                                {section.paymentInfo.map((info, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-gray-600 text-sm sm:text-base">{info}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {section.license && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <p className="text-blue-700 text-sm sm:text-base">{section.license}</p>
                                            </div>
                                        )}

                                        {section.privacy && (
                                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                <p className="text-purple-700 text-sm sm:text-base">{section.privacy}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Sección 9: Limitación de Responsabilidad */}
                        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 sm:p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-full p-3">
                                    <HiOutlineShieldCheck className="text-2xl text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                                        9. Limitación de Responsabilidad
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                                        La Aplicación se proporciona "tal cual" y "según disponibilidad". 
                                        No garantizamos que sea ininterrumpida, segura o libre de errores.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                        No seremos responsables por daños indirectos, incidentales, especiales o 
                                        consecuentes que resulten del uso o la incapacidad de usar la Aplicación, 
                                        incluidos los relacionados con transacciones fallidas o pérdida de datos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sección 10: Terminación */}
                        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 sm:p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full p-3">
                                    <MdOutlineGavel className="text-2xl text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                                        10. Terminación
                                    </h3>
                                    <div className="space-y-3">
                                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                            Podemos terminar o suspender su acceso a la Aplicación en cualquier momento, 
                                            con o sin notificación, si violamos estos términos o por motivos operativos.
                                        </p>
                                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                            Usted puede dejar de usar la Aplicación en cualquier momento, 
                                            pero los pagos registrados seguirán vigentes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 sm:p-8 mt-8 text-white">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center">
                            11. Contacto
                        </h3>
                        <p className="text-green-100 mb-6 text-center text-sm sm:text-base">
                            Si tiene preguntas sobre estos Términos y Condiciones, contáctenos en:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors duration-200">
                                <div className="flex items-center justify-center mb-2">
                                    <MdOutlineEmail className="text-2xl" />
                                </div>
                                <p className="font-semibold mb-1">Correo electrónico</p>
                                <p className="text-sm sm:text-base">wapitech.dev@gmail.com</p>
                            </div>
                            
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-colors duration-200">
                                <div className="flex items-center justify-center mb-2">
                                    <MdOutlinePhone className="text-2xl" />
                                </div>
                                <p className="font-semibold mb-1">Teléfono</p>
                                <p className="text-sm sm:text-base">55-2053-5967</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}