# Integración de Estilos de Menú

## Resumen
Se ha integrado la funcionalidad de personalización de estilos del menú web utilizando las APIs `getColorMenu` y `postColorMenu`.

## Flujo de Funcionamiento

### 1. Carga del Estilo Guardado (GET)
Cuando el usuario accede a su página de perfil (`userpage.jsx`):

```javascript
// Se ejecuta al cargar la página
const fetchColorMenu = async () => {
  try {
    const response = await getColorMenu();
    // La API devuelve un array
    if (response && response.length > 0 && response[0].value) {
      setSelectedStyle(response[0].value); // ej: "tokyo", "default", etc.
    }
  } catch (error) {
    console.error('Error al obtener el estilo del menú:', error);
  }
};
```

**Respuesta de la API:**
```json
[
  {
    "key": "menu_style",
    "value": "tokyo",
    "description": "Estilo Tokyo Nights para el menú web",
    "group": "menu_customization",
    "id": 1,
    "created_at": "2025-12-01T19:58:20.468Z",
    "updated_at": "2025-12-01T19:58:20.468Z"
  }
]
```

### 2. Guardar Estilo Seleccionado (POST)
Cuando el usuario selecciona un estilo y hace clic en "Aplicar Estilo":

```javascript
const handleSaveStyle = async () => {
  const styleInfo = menuStyles[selectedStyle];
  
  const colorData = {
    key: "menu_style",
    value: selectedStyle, // "tokyo", "default", "midnight", etc.
    description: `Estilo ${styleInfo?.name || selectedStyle} para el menú web`,
    group: "menu_customization"
  };

  await postColorMenu(colorData);
};
```

**Datos enviados a la API:**
```json
{
  "key": "menu_style",
  "value": "tokyo",
  "description": "Estilo Tokyo Nights para el menú web",
  "group": "menu_customization"
}
```

### 3. Construcción del Link del Menú
El link del menú se construye dinámicamente con el estilo guardado:

```javascript
const handleViewMenuClick = () => {
  if (hasActiveSubscription) {
    // Si el estilo es 'default', no se agrega parámetro
    const styleParam = selectedStyle !== 'default' ? `?style=${selectedStyle}` : '';
    window.open(`/webmenu/${userInfo?.user_uuid}${styleParam}`, '_blank');
  }
};
```

**Ejemplos de URLs generadas:**
- Estilo default: `/webmenu/abc123def456`
- Estilo Tokyo: `/webmenu/abc123def456?style=tokyo`
- Estilo Sunset: `/webmenu/abc123def456?style=sunset`

## Estilos Disponibles

Los estilos están definidos en `/styles/menuStyles.js`:

| Key | Nombre | Descripción |
|-----|--------|-------------|
| `default` | Clásico | Estilo clásico y profesional |
| `tokyo` | Tokyo Nights | Moderno estilo neón |
| `midnight` | Midnight | Elegante y minimalista |
| `sunset` | Sunset Grill | Cálido y acogedor |
| `ocean` | Ocean Deep | Fresco y marino |
| `luxury` | Golden Luxury | Premium y sofisticado |
| `garden` | Fresh Garden | Natural y fresco |
| `berry` | Berry Sweet | Dulce y moderno |
| `espresso` | Espresso | Tierra y café |
| `aurora` | Aurora | Colores boreales |
| `latte` | Café Latte | Perfecto para cafés |
| `mocha` | Mocha | Cafetería moderna |
| `cappuccino` | Cappuccino | Elegancia cafetera |
| `fiesta` | Fiesta Mexicana | Vibrante mexicano |
| `azteca` | Azteca | Tradicional mexicano |
| `mariachi` | Mariachi | Festivo mexicano |
| `tequila` | Tequila Sunrise | Premium mexicano |

## Componentes Modificados

### `/user/userpage.jsx`
- **Nuevos imports:**
  - `getColorMenu` desde `@/useCases/getColorMenu`
  - `postColorMenu` desde `@/useCases/postColorMenu`

- **Nuevo estado:**
  - `savingStyle`: Para mostrar loading al guardar

- **Nuevas funciones:**
  - `fetchColorMenu()`: Carga el estilo guardado al iniciar
  - `handleSaveStyle()`: Guarda el estilo seleccionado

- **Modal de estilos mejorado:**
  - Ahora guarda el estilo en la base de datos
  - Muestra loading mientras guarda
  - Mantiene el estilo seleccionado al cerrar el modal (no resetea a default)

### `/useCases/getColorMenu.js`
- Agregada documentación JSDoc con ejemplos de uso

### `/useCases/postColorMenu.js`
- Agregada documentación JSDoc con todos los estilos disponibles
- Incluye ejemplos de uso

## Flujo de Usuario

1. **Usuario accede a su perfil** → Se carga el estilo guardado previamente
2. **Usuario hace clic en el ícono de editar** (junto a "Menú Digital") → Se abre el modal de estilos
3. **Usuario selecciona un estilo** → Se actualiza la vista previa
4. **Usuario hace clic en "Aplicar Estilo"** → Se guarda en la base de datos
5. **Usuario hace clic en "Ver menú"** → Se abre el menú con el estilo aplicado

## Testing

### Probar la integración:

1. **Cargar estilo guardado:**
   - Acceder a la página de usuario
   - Verificar en la consola si se carga el estilo correcto
   - Comprobar que el estado `selectedStyle` tenga el valor correcto

2. **Guardar nuevo estilo:**
   - Abrir el modal de estilos
   - Seleccionar un estilo diferente
   - Hacer clic en "Aplicar Estilo"
   - Verificar que se muestre el mensaje de éxito
   - Verificar en la red (Network) que se haga la petición POST correcta

3. **Ver menú con estilo:**
   - Hacer clic en "Ver menú"
   - Verificar que la URL tenga el parámetro `?style=` correcto
   - Verificar que el menú se vea con el estilo aplicado

## Notas Técnicas

- **Manejo de errores:** Si `getColorMenu` falla, se mantiene el estilo `default`
- **Estado por defecto:** Si el usuario no ha guardado ningún estilo, se usa `default`
- **Validación:** No se resetea el estilo al cerrar el modal, se mantiene el último guardado
- **Loading:** Se muestra un spinner mientras se guarda el estilo
- **Feedback:** Se muestra un alert al guardar exitosamente (puede mejorarse con un toast notification)

## Mejoras Futuras

1. Reemplazar `alert()` con un sistema de notificaciones toast
2. Agregar validación adicional antes de guardar
3. Implementar un preview en tiempo real del menú antes de guardar
4. Agregar opción de "Vista previa" que abra el menú en una nueva pestaña sin guardarlo
5. Implementar caché local para reducir llamadas a la API
