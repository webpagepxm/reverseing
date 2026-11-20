# Mambo Jambo · Frontend Foundation V1

Aplicación visual de demostración basada en el blueprint UX de `115468d0d552cdf3e712bb3de565fa8a23c60814`.

## Abrir

Desde la raíz del repositorio, con Node.js 22 o posterior:

```bash
cd app
npm ci
npm run dev
```

Abrir `http://localhost:3000`. La raíz lleva a Agenda en la sucursal ficticia Roma Norte. La Agenda abre el **18 de noviembre de 2026** para mostrar el conjunto de citas de prueba. **Hoy** utiliza la fecha actual en Ciudad de México.

## Recorrido de revisión

| Interacción operativa en el frontend | Base de demostración |
|---|---|
| Rutas para Agenda, Clientes, Catálogo, Equipo y Configuración. Menús contextuales para Turnos, Negocio, Sucursales y Accesos. | Contexto fijo Estudio Mambo / Roma Norte y perfiles ilustrativos. |
| Día, Semana y Lista. Fecha y profesional seleccionables. Detalle por cita y alta a partir de una franja o de **Nueva cita**. | Citas, clientes, horarios, servicios y precios ficticios. La carga breve, la comprobación de solape y la confirmación del alta ocurren en el cliente. La cita nueva se pierde al recargar o salir de Agenda. |
| Búsqueda en listas, categorías de servicio y fichas contextuales. | Listas de lectura con datos estáticos. El historial de Clientes usa las citas iniciales de muestra. |
| Apertura, cierre y retorno en los paneles. | Los enlaces de paneles usan `?cita=` o `?ficha=` en la URL de origen. Una cita añadida temporalmente solo se abre mientras exista en memoria. |

El alcance termina en la capa visual. Autenticación, permisos efectivos, edición de directorios y reprogramación de citas quedan para la siguiente etapa.

## Compilación y pruebas

```bash
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

La compilación y el chequeo TypeScript pasaron. Las seis pruebas en Chromium cubren navegación, filtros, retorno del foco, alta por franja, validación de solapes y los tres anchos.

En un entorno con Chromium instalado, ejecutar `MAMBO_CHROMIUM=/usr/bin/chromium npm test`. Playwright inicia el build en el puerto 3100 durante las pruebas. Si está ocupado, usar `MAMBO_PORT` para elegir otro. Para regenerar las capturas, agregar `MAMBO_CAPTURE=1`.

## Capturas y comparación visual

| Tamaño | Capturas |
|---|---|
| 1280 px | [Agenda](review/agenda-1280.png) · [Detalle de cita](review/cita-1280.png) · [Editor](review/editor-1280.png) |
| 768 px | [Agenda](review/agenda-768.png) |
| 360 px | [Agenda](review/agenda-360.png) · [Detalle de cita](review/cita-360.png) |

| Referencia del blueprint | Resultado y diferencia |
|---|---|
| **S02 · Calendario.** La fecha, el equipo y la vista se ajustan sobre una cuadrícula horaria. [Selector documentado](../05_EVIDENCIAS/FOTOGRAMAS/CITAS/s02.jpg) | La barra agrupa período a la izquierda y profesional/vista a la derecha. Día usa columnas por profesional. Semana usa una columna por día y un profesional. Fundación usa un filtro individual, con opción Todo el equipo en Día y Lista. |
| **S03 · Panel.** El editor lateral mantiene la cuadrícula de origen y presenta servicio, cliente y total. [Editor documentado](../05_EVIDENCIAS/FOTOGRAMAS/CITAS/s46.jpg) | A 1280 px se reserva espacio para el panel. El calendario se estrecha y permanece legible. El diálogo gestiona foco y Escape. El detalle distingue profesional, duración y total con un resumen propio. A 768 px el panel se superpone. |
| **S05, S06 y S12 · Riel, navegación contextual y directorios.** [Clientes](../V03_EXPLORACION/115s_menu_clientes.jpg) · [Servicios](../FOTOGRAMAS/INVENTARIO/085s.jpg) · [Equipo](../V03_EXPLORACION/195s_equipo_lista.jpg) | Riel con iconos y nombres visibles, menú local textual y espacio de trabajo. Catálogo conserva categorías junto al listado. Mambo Jambo usa riel verde petróleo, iconos Lucide, superficies marfil, tipografía Fraunces/Manrope y bloques suaves por profesional. |
| **Móvil · Patrón vertical disponible en Caja.** [Hoja de acciones](../V04_CAJA/M10_menu_movimientos.jpg) | La Agenda de 360 px abre Lista con hora, servicio y profesional, menú global desplegable y detalle a pantalla completa. Es una decisión propia basada en el blueprint. La evidencia existente de Caja solo respalda el uso de un patrón vertical en pantalla estrecha. |

Los cinco documentos utilizados están en [MAMBO_JAMBO_UX_BLUEPRINT](../MAMBO_JAMBO_UX_BLUEPRINT/). Las comparaciones se hicieron con las capturas originales ya citadas por el blueprint.
