export const updateTableStatus = async (tableId, status) => {
    try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        // console.log('=== ACTUALIZANDO ESTADO DE MESA ===');
        // console.log('Table ID:', tableId);
        // console.log('Status recibido:', status);

        const numeroMesa = parseInt(tableId);
        // Mapear el estado al formato correcto que acepta la API
        let estadoMesa;
        
        switch(status.toLowerCase()) {
            case 'libre':
                estadoMesa = 'Libre';
                break;
            case 'ocupado':
                estadoMesa = 'Ocupado';
                break;
            case 'no disponible':
            case 'nodisponible':
                estadoMesa = 'NoDisponible';
                break;
            default:
                estadoMesa = 'NoDisponible'; // Por defecto
        }

        // console.log('Estado mapeado:', estadoMesa);

        if (isNaN(numeroMesa)) {
            throw new Error('Número de mesa inválido');
        }

        // Usar URLSearchParams que ya sabemos que funciona
        const params = new URLSearchParams();
        params.append('number', numeroMesa);
        params.append('state', estadoMesa);
        
        // console.log('Parámetros a enviar:', params.toString());

        const response = await fetch('http://201.137.184.207:8000/tables/status', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        });

        // console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            // console.log('Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        // console.log('Mesa actualizada exitosamente:', data);
        // console.log('=== FIN ACTUALIZACIÓN ===');
        
        return data;

    } catch (error) {
        console.error('Error al actualizar estado de mesa:', error);
        throw error;
    }
};

