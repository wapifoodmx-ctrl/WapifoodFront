import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Configuraciones de tamaños de impresoras comunes
export const TICKET_SIZES = {
    SMALL_58: {
        name: '58mm (Pequeño)',
        width: 58,
        height: 220,
        leftMargin: 2,
        rightMargin: 2,
        fontSize: {
            header: 10,
            normal: 6,
            small: 5,
            total: 8
        },
        productNameWidth: 28,
        qtyPosition: 32,
        pricePosition: 38
    },
    STANDARD_80: {
        name: '80mm (Estándar)',
        width: 80,
        height: 280,
        leftMargin: 3,
        rightMargin: 3,
        fontSize: {
            header: 12,
            normal: 8,
            small: 6,
            total: 10
        },
        productNameWidth: 42,
        qtyPosition: 48,
        pricePosition: 57
    },
    LARGE_110: {
        name: '110mm (Grande)',
        width: 110,
        height: 320,
        leftMargin: 5,
        rightMargin: 5,
        fontSize: {
            header: 14,
            normal: 9,
            small: 7,
            total: 12
        },
        productNameWidth: 60,
        qtyPosition: 70,
        pricePosition: 83
    }
};

/**
 * Genera un PDF de ticket de venta
 * @param {Object} ticketData - Datos del ticket desde la API
 * @param {String} sizeKey - Clave del tamaño (SMALL_58, STANDARD_80, LARGE_110)
 * @returns {void}
 */
export const generateTicketPDF = (ticketData, sizeKey = 'STANDARD_80') => {
    try {
        // Obtener configuración del tamaño seleccionado
        const sizeConfig = TICKET_SIZES[sizeKey] || TICKET_SIZES.STANDARD_80;

        // Crear documento PDF formato ticket
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [sizeConfig.width, sizeConfig.height]
        });

        let yPos = 10;
        const leftMargin = sizeConfig.leftMargin;
        const rightMargin = sizeConfig.rightMargin;
        const pageWidth = sizeConfig.width;
        const contentWidth = pageWidth - leftMargin - rightMargin;

        // ==== HEADER ====
        pdf.setFontSize(sizeConfig.fontSize.header);
        pdf.setFont('helvetica', 'bold');
        pdf.text('WapiFood', pageWidth / 2, yPos, { align: 'center' });
        yPos += 5;

        pdf.setFontSize(sizeConfig.fontSize.small);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Sistema para restaurantes', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;

        // Línea separadora
        pdf.setLineWidth(0.3);
        pdf.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += 4;

        // ==== INFORMACIÓN DEL TICKET ====
        pdf.setFontSize(sizeConfig.fontSize.total);
        pdf.setFont('helvetica', 'bold');
        const ticketNum = ticketData.ticket_number || ticketData.id_pedidos || 'N/A';
        pdf.text(`TICKET #${ticketNum}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 5;

        pdf.setFontSize(sizeConfig.fontSize.normal);
        pdf.setFont('helvetica', 'normal');

        // Fecha y hora
        const fecha = ticketData.fecha || new Date().toLocaleDateString('es-MX');
        const hora = ticketData.hora || new Date().toLocaleTimeString('es-MX');
        pdf.text(`Fecha: ${fecha}`, leftMargin, yPos);
        yPos += 3;
        pdf.text(`Hora: ${hora}`, leftMargin, yPos);
        yPos += 3;

        // Número de mesa (si existe)
        if (ticketData.numero_mesa) {
            pdf.text(`Mesa: ${ticketData.numero_mesa}`, leftMargin, yPos);
            yPos += 3;
        }

        // Estado del pedido
        if (ticketData.estado) {
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Estado: ${ticketData.estado.toUpperCase()}`, leftMargin, yPos);
            pdf.setFont('helvetica', 'normal');
            yPos += 4;
        }

        // Línea separadora
        pdf.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += 4;

        // ==== PRODUCTOS ====
        pdf.setFontSize(sizeConfig.fontSize.normal);
        pdf.setFont('helvetica', 'bold');

        // Calcular posiciones relativas al ancho según el tamaño del ticket
        const colProducto = leftMargin;
        let colCantidad, colPrecio;

        if (pageWidth >= 110) {
            // Ticket grande (110mm) - más espacio entre columnas
            colCantidad = pageWidth - rightMargin - 35; // 35mm desde el borde derecho
            colPrecio = pageWidth - rightMargin - 15; // 15mm desde el borde derecho
        } else if (pageWidth >= 80) {
            // Ticket estándar (80mm)
            colCantidad = pageWidth - rightMargin - 24; // 24mm desde el borde derecho
            colPrecio = pageWidth - rightMargin - 12; // 12mm desde el borde derecho
        } else {
            // Ticket pequeño (58mm)
            colCantidad = pageWidth - rightMargin - 20; // 20mm desde el borde derecho
            colPrecio = pageWidth - rightMargin - 10; // 10mm desde el borde derecho
        }

        pdf.text('Producto', colProducto, yPos);
        pdf.text('Cant', colCantidad, yPos, { align: 'center' });
        pdf.text('Precio', colPrecio, yPos, { align: 'right' });
        yPos += 3;

        pdf.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += 3;

        pdf.setFont('helvetica', 'normal');

        // Parsear productos
        let productos = [];
        if (ticketData.productos) {
            try {
                // Si productos es string, parsearlo
                productos = typeof ticketData.productos === 'string'
                    ? JSON.parse(ticketData.productos)
                    : ticketData.productos;
            } catch (e) {
                console.error('Error parsing productos:', e);
                productos = [];
            }
        }

        // Listar productos
        if (Array.isArray(productos) && productos.length > 0) {
            productos.forEach((producto) => {
                const nombre = producto.nombre || producto.name || 'Producto';
                const cantidad = producto.cantidad || producto.quantity || 1;
                const precio = parseFloat(producto.precio || producto.price || 0);
                const subtotal = parseFloat(producto.subtotal || (cantidad * precio));
                const tieneDescuento = producto.tieneDescuento || false;

                // Nombre del producto (truncado según el ancho disponible)
                const maxProductWidth = pageWidth - leftMargin - rightMargin - 28;
                let nombreDisplay = nombre;

                // Truncar si es necesario
                const textWidth = pdf.getTextWidth(nombreDisplay);
                if (textWidth > maxProductWidth) {
                    while (pdf.getTextWidth(nombreDisplay + '...') > maxProductWidth && nombreDisplay.length > 0) {
                        nombreDisplay = nombreDisplay.slice(0, -1);
                    }
                    nombreDisplay += '...';
                }

                pdf.text(nombreDisplay, colProducto, yPos);
                pdf.text(cantidad.toString(), colCantidad, yPos, { align: 'center' });
                pdf.text(`$${subtotal.toFixed(2)}`, colPrecio, yPos, { align: 'right' });
                yPos += 3;

                // Si hay descuento en el producto, mostrarlo
                if (tieneDescuento && producto.descuento) {
                    pdf.setFontSize(sizeConfig.fontSize.small);
                    pdf.text(`Orig: $${producto.precioOriginal.toFixed(2)}`, colProducto + 2, yPos);
                    pdf.text(`-$${producto.descuento.toFixed(2)}`, colPrecio, yPos, { align: 'right' });
                    pdf.setFontSize(sizeConfig.fontSize.normal);
                    yPos += 3;
                }

                // Si hay notas, agregarlas
                if (producto.notas && producto.notas !== 'string') {
                    pdf.setFontSize(sizeConfig.fontSize.small);
                    const maxNotaWidth = maxProductWidth - 4;
                    let notaDisplay = producto.notas;
                    const notaWidth = pdf.getTextWidth(`Nota: ${notaDisplay}`);

                    if (notaWidth > maxNotaWidth) {
                        while (pdf.getTextWidth(`Nota: ${notaDisplay}...`) > maxNotaWidth && notaDisplay.length > 0) {
                            notaDisplay = notaDisplay.slice(0, -1);
                        }
                        notaDisplay += '...';
                    }

                    pdf.text(`Nota: ${notaDisplay}`, colProducto + 1, yPos);
                    pdf.setFontSize(sizeConfig.fontSize.normal);
                    yPos += 3;
                }
            });
        } else {
            pdf.text('No hay productos registrados', leftMargin, yPos);
            yPos += 4;
        }

        yPos += 2;
        pdf.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += 4;

        // ==== TOTALES ====
        pdf.setFont('helvetica', 'normal');
        const total = parseFloat(ticketData.total || 0);

        // Subtotal (si existe descuento total)
        if (ticketData.subtotal && ticketData.descuento_total) {
            pdf.text('Subtotal:', leftMargin, yPos);
            pdf.text(`$${parseFloat(ticketData.subtotal).toFixed(2)}`, sizeConfig.pricePosition, yPos);
            yPos += 3;
        }

        // Descuento total (si existe)
        if (ticketData.descuento_total && parseFloat(ticketData.descuento_total) > 0) {
            pdf.text('Descuento:', leftMargin, yPos);
            pdf.text(`-$${parseFloat(ticketData.descuento_total).toFixed(2)}`, sizeConfig.pricePosition, yPos);
            yPos += 3;
        }

        // Propina (si existe)
        if (ticketData.propina && parseFloat(ticketData.propina) > 0) {
            pdf.text('Propina:', leftMargin, yPos);
            pdf.text(`$${parseFloat(ticketData.propina).toFixed(2)}`, sizeConfig.pricePosition, yPos);
            yPos += 3;
        }

        // Total
        pdf.setFontSize(sizeConfig.fontSize.total);
        pdf.setFont('helvetica', 'bold');
        pdf.text('TOTAL:', leftMargin, yPos);
        pdf.text(`$${total.toFixed(2)}`, sizeConfig.pricePosition, yPos);
        yPos += 6;

        // ==== MÉTODO DE PAGO ====
        if (ticketData.metodo_pago) {
            pdf.setFontSize(sizeConfig.fontSize.normal);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Pago: ${ticketData.metodo_pago}`, pageWidth / 2, yPos, { align: 'center' });
            yPos += 5;
        }

        // ==== MESERO QUE ATENDIÓ ====
        if (ticketData.mesero) {
            pdf.setFontSize(sizeConfig.fontSize.normal);
            pdf.setFont('helvetica', 'italic');
            pdf.text(`Le atendio: ${ticketData.mesero}`, pageWidth / 2, yPos, { align: 'center' });
            yPos += 5;
        }

        // ==== FOOTER ====
        pdf.setLineWidth(0.3);
        pdf.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += 5;

        pdf.setFontSize(sizeConfig.fontSize.normal);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Gracias por su compra!', pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;

        pdf.setFontSize(sizeConfig.fontSize.small);
        pdf.setFont('helvetica', 'normal');
        pdf.text('wapifoodmx@gmail.com', pageWidth / 2, yPos, { align: 'center' });
        yPos += 4;
        pdf.text('www.wapifood.com', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8; // Más espacio al final para que no se corte
        pdf.text('-', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8; // Más espacio al final para que no se corte
        pdf.text('-', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8; // Más espacio al final para que no se corte

        // Guardar PDF
        const fileName = `ticket-${ticketData.id_pedidos || Date.now()}.pdf`;
        pdf.save(fileName);

        return { success: true, message: 'Ticket PDF generado correctamente' };
    } catch (error) {
        console.error('Error al generar ticket PDF:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Genera un PDF con reporte de múltiples tickets
 * @param {Array} ticketsData - Array de tickets desde la API
 * @param {String} period - Período del reporte (ej: "Hoy", "Semana", "Mes")
 * @param {Boolean} groupByDate - Si es true, agrupa los tickets por fecha
 * @returns {void}
 */
export const generateTicketsReportPDF = (ticketsData, period = 'Reporte de Tickets', groupByDate = false) => {
    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        let yPos = 20;
        const leftMargin = 15;
        const pageWidth = 210;
        const pageHeight = 297;

        // ==== HEADER ====
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(34, 197, 94); // Verde WapiFood
        pdf.text('WapiFood', pageWidth / 2, yPos, { align: 'center' });
        pdf.setTextColor(0, 0, 0); // Volver a negro
        yPos += 8;

        pdf.setFontSize(16);
        pdf.text(`Reporte de Tickets - ${period}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100); // Gris
        const fechaGeneracion = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        pdf.text(`Generado: ${fechaGeneracion}`, pageWidth / 2, yPos, { align: 'center' });
        pdf.setTextColor(0, 0, 0); // Volver a negro
        yPos += 10;

        // Línea decorativa
        pdf.setDrawColor(34, 197, 94); // Verde
        pdf.setLineWidth(0.5);
        pdf.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
        yPos += 10;

        // ==== RESUMEN ESTADÍSTICO ====
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Resumen General', leftMargin, yPos);
        yPos += 8;

        // Calcular estadísticas
        const totalTickets = ticketsData.length;
        const ticketsExitosos = ticketsData.filter(t =>
            t.statusOrden === 'Finalizado' || t.statusOrden === 'PuntoDeVenta'
        ).length;
        const ticketsCancelados = ticketsData.filter(t => t.statusOrden === 'Cancelado').length;
        const totalVentas = ticketsData.reduce((sum, t) => sum + (parseFloat(t.total) || 0), 0);
        const promedioTicket = totalTickets > 0 ? totalVentas / totalTickets : 0;

        // Crear tabla de estadísticas
        const statsData = [
            ['Total de Tickets', totalTickets.toString()],
            ['Tickets Exitosos', `${ticketsExitosos} (${((ticketsExitosos / totalTickets) * 100 || 0).toFixed(1)}%)`],
            ['Tickets Cancelados', `${ticketsCancelados} (${((ticketsCancelados / totalTickets) * 100 || 0).toFixed(1)}%)`],
            ['Total en Ventas', `$${totalVentas.toFixed(2)}`],
            ['Ticket Promedio', `$${promedioTicket.toFixed(2)}`]
        ];

        autoTable(pdf, {
            startY: yPos,
            head: [['Métrica', 'Valor']],
            body: statsData,
            theme: 'grid',
            headStyles: {
                fillColor: [34, 197, 94], // Verde
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 100, fontStyle: 'bold' },
                1: { cellWidth: 80, halign: 'right' }
            },
            margin: { left: leftMargin, right: leftMargin },
            styles: { fontSize: 10 }
        });

        yPos = pdf.lastAutoTable.finalY + 15;

        // ==== DETALLE DE TICKETS ====
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Detalle de Tickets', leftMargin, yPos);
        yPos += 8;

        // Función para agrupar tickets por fecha
        const groupTicketsByDate = (tickets) => {
            const groups = {};
            tickets.forEach(ticket => {
                const fecha = ticket.fecha;
                if (!groups[fecha]) {
                    groups[fecha] = [];
                }
                groups[fecha].push(ticket);
            });

            // Ordenar las fechas
            const sortedDates = Object.keys(groups).sort((a, b) => {
                const dateA = new Date(a.split('/').reverse().join('-'));
                const dateB = new Date(b.split('/').reverse().join('-'));
                return dateB - dateA;
            });

            const sortedGroups = {};
            sortedDates.forEach(date => {
                sortedGroups[date] = groups[date];
            });

            return sortedGroups;
        };

        if (groupByDate) {
            // ==== VISTA AGRUPADA POR FECHA ====
            const groupedTickets = groupTicketsByDate(ticketsData);

            Object.entries(groupedTickets).forEach(([fecha, tickets], index) => {
                // Verificar si hay espacio suficiente en la página
                if (yPos > pageHeight - 60) {
                    pdf.addPage();
                    yPos = 20;
                }

                // Header de la fecha
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'bold');
                pdf.setFillColor(220, 220, 220); // Gris claro
                pdf.rect(leftMargin, yPos - 5, pageWidth - (leftMargin * 2), 10, 'F');
                pdf.text(`${fecha}`, leftMargin + 3, yPos);

                // Total del día
                const totalDia = tickets.reduce((sum, t) => sum + (parseFloat(t.total) || 0), 0);
                pdf.text(`Total: $${totalDia.toFixed(2)}`, pageWidth - leftMargin - 3, yPos, { align: 'right' });

                // Cantidad de tickets
                pdf.setFontSize(9);
                pdf.text(`(${tickets.length} ticket${tickets.length !== 1 ? 's' : ''})`, leftMargin + 3, yPos + 4);

                yPos += 10;

                // Preparar datos para la tabla del día
                const tableDayData = tickets.map(ticket => [
                    ticket.ticket_number ? `#${ticket.ticket_number}` : 'N/A',
                    ticket.hora || '-',
                    ticket.mesa || '-',
                    `$${parseFloat(ticket.total || 0).toFixed(2)}`,
                    ticket.statusOrden || '-'
                ]);

                // Crear tabla para este día
                autoTable(pdf, {
                    startY: yPos,
                    head: [['Ticket', 'Hora', 'Mesa', 'Total', 'Estado']],
                    body: tableDayData,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [34, 197, 94],
                        textColor: 255,
                        fontStyle: 'bold',
                        halign: 'center',
                        fontSize: 9
                    },
                    columnStyles: {
                        0: { cellWidth: 35, halign: 'center' },
                        1: { cellWidth: 30 },
                        2: { cellWidth: 40, halign: 'center' },
                        3: { cellWidth: 35, halign: 'right' },
                        4: { cellWidth: 40, halign: 'center' }
                    },
                    margin: { left: leftMargin, right: leftMargin },
                    styles: { fontSize: 8 },
                    didParseCell: function (data) {
                        // Colorear columna de estado
                        if (data.column.index === 4 && data.section === 'body') {
                            const estado = data.cell.text[0];
                            if (estado === 'Finalizado' || estado === 'PuntoDeVenta') {
                                data.cell.styles.textColor = [34, 197, 94]; // Verde
                                data.cell.styles.fontStyle = 'bold';
                            } else if (estado === 'Cancelado') {
                                data.cell.styles.textColor = [239, 68, 68]; // Rojo
                                data.cell.styles.fontStyle = 'bold';
                            }
                        }
                    }
                });

                yPos = pdf.lastAutoTable.finalY + 10;
            });
        } else {
            // ==== VISTA NORMAL (HOY) - TABLA ÚNICA ====
            // Preparar datos para la tabla
            const tableData = ticketsData.map(ticket => [
                ticket.ticket_number ? `#${ticket.ticket_number}` : 'N/A',
                ticket.fecha || '-',
                ticket.hora || '-',
                ticket.mesa || '-',
                `$${parseFloat(ticket.total || 0).toFixed(2)}`,
                ticket.statusOrden || '-'
            ]);

            // Crear tabla de tickets
            autoTable(pdf, {
                startY: yPos,
                head: [['Ticket', 'Fecha', 'Hora', 'Mesa', 'Total', 'Estado']],
                body: tableData,
                theme: 'striped',
                headStyles: {
                    fillColor: [34, 197, 94],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { cellWidth: 25, halign: 'center' },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 30, halign: 'center' },
                    4: { cellWidth: 30, halign: 'right' },
                    5: { cellWidth: 30, halign: 'center' }
                },
                margin: { left: leftMargin, right: leftMargin },
                styles: { fontSize: 9 },
                didParseCell: function (data) {
                    // Colorear columna de estado
                    if (data.column.index === 5 && data.section === 'body') {
                        const estado = data.cell.text[0];
                        if (estado === 'Finalizado' || estado === 'PuntoDeVenta') {
                            data.cell.styles.textColor = [34, 197, 94]; // Verde
                            data.cell.styles.fontStyle = 'bold';
                        } else if (estado === 'Cancelado') {
                            data.cell.styles.textColor = [239, 68, 68]; // Rojo
                            data.cell.styles.fontStyle = 'bold';
                        }
                    }
                }
            });
        }

        // ==== FOOTER ====
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.text(
                `Página ${i} de ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
            pdf.text(
                'Este documento fue generado automáticamente por WapiFood',
                pageWidth / 2,
                pageHeight - 6,
                { align: 'center' }
            );
        }

        // Guardar PDF
        const fileName = `reporte-tickets-${period.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
        pdf.save(fileName);

        return { success: true, message: 'Reporte PDF generado correctamente' };
    } catch (error) {
        console.error('Error al generar reporte PDF:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Genera un PDF con reporte de kardex (movimientos) de un ingrediente
 * @param {String} ingredientName - Nombre del ingrediente
 * @param {Array} movementsData - Array de movimientos del ingrediente
 * @param {Number} currentStock - Stock actual del ingrediente
 * @param {String} currentUnit - Unidad del ingrediente
 * @returns {Object} - Objeto con success y message
 */
export const generateKardexReportPDF = (ingredientName, movementsData, currentStock = 0, currentUnit = '') => {
    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        let yPos = 20;
        const leftMargin = 15;
        const pageWidth = 210;
        const pageHeight = 297;

        // ==== HEADER ====
        pdf.setFontSize(22);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(34, 197, 94); // Verde WapiFood
        pdf.text('WapiFood', pageWidth / 2, yPos, { align: 'center' });
        pdf.setTextColor(0, 0, 0); // Volver a negro
        yPos += 8;

        pdf.setFontSize(16);
        pdf.text(`Reporte de Kardex`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;

        // Nombre del ingrediente
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(34, 197, 94); // Verde
        pdf.text(`Ingrediente: ${ingredientName}`, pageWidth / 2, yPos, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
        yPos += 6;

        // Stock actual
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Stock Actual: ${currentStock} ${currentUnit}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 4;

        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100); // Gris
        const fechaGeneracion = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        pdf.text(`Generado: ${fechaGeneracion}`, pageWidth / 2, yPos, { align: 'center' });
        pdf.setTextColor(0, 0, 0);
        yPos += 10;

        // Línea decorativa
        pdf.setDrawColor(34, 197, 94); // Verde
        pdf.setLineWidth(0.5);
        pdf.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
        yPos += 10;

        // ==== AGRUPAR MOVIMIENTOS POR TIPO ====
        const groupedMovements = {
            inventario_inicial: [],
            ajuste_entrada: [],
            ajuste_salida: [],
            ventas: [],
            otros: []
        };

        movementsData.forEach(movement => {
            const reason = movement.reason || '';
            const type = movement.movement_type || '';

            if (reason === 'INVENTARIO_INICIAL') {
                groupedMovements.inventario_inicial.push(movement);
            } else if (reason === 'AJUSTE_MANUAL' && type === 'ENTRADA') {
                groupedMovements.ajuste_entrada.push(movement);
            } else if (reason === 'AJUSTE_MANUAL' && type === 'SALIDA') {
                groupedMovements.ajuste_salida.push(movement);
            } else if (reason === 'VENTA_ORDEN') {
                groupedMovements.ventas.push(movement);
            } else {
                groupedMovements.otros.push(movement);
            }
        });

        // Función auxiliar para crear tabla de movimientos
        const createMovementsTable = (movements, title, color) => {
            if (movements.length === 0) return;

            // Verificar si hay espacio suficiente, sino agregar nueva página
            if (yPos > pageHeight - 60) {
                pdf.addPage();
                yPos = 20;
            }

            // Título de la sección
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(color[0], color[1], color[2]);
            pdf.text(title, leftMargin, yPos);
            pdf.setTextColor(0, 0, 0);
            yPos += 2;

            // Preparar datos para la tabla
            const tableData = movements.map(mov => {
                const fecha = new Date(mov.timestamp).toLocaleDateString('es-MX');
                const hora = new Date(mov.timestamp).toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const costoTotal = (Math.abs(mov.quantity) * mov.cost).toFixed(2);
                const ticketNum = mov.ticket_number ? `#${mov.ticket_number}` : '-';

                return [
                    `${fecha}\n${hora}`,
                    mov.description || '-',
                    mov.quantity.toString(),
                    mov.stock_after.toString(),
                    `$${mov.cost.toFixed(2)}`,
                    `$${costoTotal}`,
                    ticketNum
                ];
            });

            // Crear tabla
            autoTable(pdf, {
                startY: yPos,
                head: [['Fecha/Hora', 'Descripción', 'Cantidad', 'Stock Después', 'Costo Unit.', 'Costo Total', 'Ticket #']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: color,
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                    fontSize: 8
                },
                columnStyles: {
                    0: { cellWidth: 25, fontSize: 7 },
                    1: { cellWidth: 48, fontSize: 7 },
                    2: { cellWidth: 20, halign: 'center', fontSize: 7 },
                    3: { cellWidth: 22, halign: 'center', fontSize: 7 },
                    4: { cellWidth: 20, halign: 'right', fontSize: 7 },
                    5: { cellWidth: 20, halign: 'right', fontSize: 7 },
                    6: { cellWidth: 25, halign: 'center', fontSize: 7 }
                },
                margin: { left: leftMargin, right: leftMargin },
                styles: {
                    fontSize: 7,
                    cellPadding: 2
                },
                didDrawPage: function (data) {
                    // Actualizar yPos para la siguiente sección
                    yPos = data.cursor.y;
                }
            });

            yPos = pdf.lastAutoTable.finalY + 10;
        };

        // Crear tablas para cada grupo con colores distintivos (tonos verdes)
        createMovementsTable(
            groupedMovements.inventario_inicial,
            'Inventario Inicial',
            [21, 128, 61] // Verde oscuro
        );

        createMovementsTable(
            groupedMovements.ajuste_entrada,
            'Ajustes Manuales - Entradas',
            [34, 197, 94] // Verde medio
        );

        createMovementsTable(
            groupedMovements.ajuste_salida,
            'Ajustes Manuales - Salidas',
            [74, 222, 128] // Verde claro
        );

        createMovementsTable(
            groupedMovements.ventas,
            'Ventas',
            [5, 150, 105] // Verde esmeralda
        );

        createMovementsTable(
            groupedMovements.otros,
            'Otros Movimientos',
            [16, 185, 129] // Verde teal
        );

        // Si no hay movimientos
        if (movementsData.length === 0) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(107, 114, 128);
            pdf.text('No hay movimientos registrados para este ingrediente', pageWidth / 2, yPos, { align: 'center' });
        }

        // ==== FOOTER ====
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(100, 100, 100);
            pdf.text(
                `Página ${i} de ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
            pdf.text(
                'Este documento fue generado automáticamente por WapiFood',
                pageWidth / 2,
                pageHeight - 6,
                { align: 'center' }
            );
        }

        // Guardar PDF
        const timestamp = Date.now();
        const sanitizedName = ingredientName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const fileName = `kardex-${sanitizedName}-${timestamp}.pdf`;
        pdf.save(fileName);

        return { success: true, message: 'Reporte de Kardex generado correctamente' };
    } catch (error) {
        console.error('Error al generar reporte de Kardex:', error);
        return { success: false, message: error.message };
    }
};
