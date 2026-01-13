// Diccionario de preguntas sugeridas por sección
export const chatbotQuestions = {
    dashboard: [
        "¿Cómo interpretar las gráficas de ventas?",
        "¿Qué significan las estadísticas del dashboard?",
        "¿Cómo puedo ver las ventas de un día específico?",
        "¿Qué son los productos populares?",
        "¿Cómo se calculan los totales de ventas?"
    ],
    productos: [
        "¿Cómo agregar un nuevo producto?",
        "¿Cómo editar el precio de un producto?",
        "¿Puedo agregar imágenes a mis productos?",
        "¿Cómo organizar productos por categorías?",
        "¿Qué pasa si elimino un producto?"
    ],
    tickets: [
        "¿Cómo generar un ticket digital?",
        "¿Los clientes pueden ver su ticket por QR?",
        "¿Cómo reimprimir un ticket?",
        "¿Puedo personalizar el diseño del ticket?",
        "¿Dónde se guardan los tickets generados?"
    ],
    cocina: [
        "¿Cómo funcionan las notificaciones de pedidos?",
        "¿Cómo marcar un producto como preparado?",
        "¿Los pedidos llegan en tiempo real?",
        "¿Puedo ver pedidos anteriores?",
        "¿Cómo organizar la cola de pedidos?"
    ],
    recetas: [
        "¿Cómo crear una receta nueva?",
        "¿Cómo vincular ingredientes a una receta?",
        "¿Cómo calcular el costo de una receta?",
        "¿Puedo editar los ingredientes de una receta?",
        "¿Las recetas afectan el inventario?"
    ],
    inventarios: [
        "¿Cómo agregar ingredientes al inventario?",
        "¿Cómo controlar el stock de ingredientes?",
        "¿Puedo descargar reportes de inventario?",
        "¿Cómo se actualizan las cantidades?",
        "¿Qué pasa cuando un ingrediente se agota?"
    ],
    meseros: [
        "¿Cómo agregar un nuevo mesero?",
        "¿Cómo asignar mesas a meseros?",
        "¿Los meseros pueden tomar pedidos desde su celular?",
        "¿Cómo ver el rendimiento de cada mesero?",
        "¿Puedo eliminar o editar meseros?"
    ],
    puntodeventa: [
        "¿Cómo realizar un cobro?",
        "¿Qué métodos de pago acepta el sistema?",
        "¿Cómo aplicar descuentos?",
        "¿Puedo dividir una cuenta?",
        "¿Cómo funciona la generación automática de tickets?"
    ],
    user: [
        "¿Cómo cambiar mi contraseña?",
        "¿Puedo actualizar los datos de mi restaurante?",
        "¿Cómo personalizar mi logo?",
        "¿Qué información aparece en mi perfil?",
        "¿Cómo cerrar sesión de forma segura?"
    ],
    payments: [
        "¿Qué planes de suscripción hay disponibles?",
        "¿Cómo renovar mi suscripción?",
        "¿Qué incluye cada plan?",
        "¿Puedo cambiar de plan?",
        "¿Cómo ver mi historial de pagos?",
        "¿Qué pasa si mi suscripción vence?"
    ],
    general: [
        "¿Qué es WapiFood?",
        "¿Cómo funciona el sistema?",
        "¿Necesito internet para usar WapiFood?",
        "¿Puedo usar WapiFood en mi celular?",
        "¿Hay soporte técnico disponible?",
        "¿Cómo contacto con soporte?"
    ]
};

// Función auxiliar para obtener preguntas según la vista actual
export function getQuestionsByView(viewName) {
    return chatbotQuestions[viewName] || chatbotQuestions.general;
}
