# Especificación UX/UI de MAMBO JAMBO

El riel, el submenú y la superficie de trabajo están documentados en escritorio. El panel derecho se acredita para Citas, Clientes y Caja. Caja aporta evidencia de tarjetas verticales, hoja de acciones y teclado numérico. [Auditoría](../03_UX_UI/AUDITORIA_VISUAL_Y_PATRONES.md) · [Cita](../05_EVIDENCIAS/FOTOGRAMAS/CITAS/s46.jpg) · [Cliente](../05_EVIDENCIAS/FOTOGRAMAS/CLIENTES/t_006s.jpg) · [Caja móvil](../V04_CAJA/M10_menu_movimientos.jpg)

## Composición y comportamiento adaptable

**DECISION_PROPIA.** Usar superficies marfil y tinta, acento petróleo, tipografía de producto propia, iconografía original con nombres visibles y numerales tabulares. Diferenciar marca y tratamiento de controles, cabeceras y paneles mediante contraste, tipografía y acentos propios. Validar contraste WCAG 2.2 AA. Las cifras siguientes son objetivos de prueba del producto.

| Contexto | Orden de lectura y controles | Resultado verificable |
|---|---|---|
| Escritorio amplio, prueba a 1280 px | Riel global con icono y nombre, menú textual del módulo, cabecera de trabajo con título, sede y acción primaria. Filtros sobre datos, detalle acoplado a la derecha cuando cabe. | Riel y título siguen identificables al abrir una ficha. Cerrar restaura selección y desplazamiento. |
| Espacio intermedio, prueba a 768 px | Menú local plegable con botón identificado. Usar panel superpuesto cuando lista o cuadrícula ya no conservan un ancho útil. | El lector de pantalla anuncia el título y el foco vuelve al disparador al cerrar. |
| Estrecho, prueba a 360 px | Cabecera de sede y menú de módulos, menú local desplegable. Agenda abre Lista diaria, la ficha ocupa toda la vista, las tablas priorizan columnas de decisión por fila. Caja usa tarjetas y hoja de acciones. | Sin desplazamiento horizontal global. Acceso a detalle, filtros, acción primaria y regreso con toque y teclado. |
| Zoom al 200 % | Reflujo según espacio disponible. Las vistas densas ofrecen la misma operación con formato alternativo. | El teclado y el pie fijo permiten alcanzar cada campo y acción. Cambio de orientación conserva el borrador abierto. |

## Contratos de componentes

**DECISION_PROPIA.** El [mapa por pantalla](FRESHA_TO_MAMBO_SCREEN_MAPPING.md) indica dónde se usan. Las vistas compartidas reciben los datos filtrados y las acciones autorizadas para el contexto actual.

| Componente | Contenido y comportamiento | Aceptación |
|---|---|---|
| Estructura global | Riel con selección actual, menú local, selector de sede, enlace para saltar al contenido, cabecera con título y acción primaria. Navegación de regreso en detalle. | La página activa se anuncia. Cambiar sede confirma borradores y revalida destinos. |
| Tabla, búsqueda y filtros | Barra con buscador, filtros de dominio, limpiar y recuento. Encabezados semánticos, orden explícito, paginación por conjunto. En móvil, fila resumida con los datos completos en detalle. | Mantener filtros y fila al volver. Distinguir colección vacía de filtros sin coincidencias. Exportar, cuando esté operativo, aplica los mismos filtros y permisos. |
| Panel contextual | Cabecera con título, estado y cerrar. Pestañas, cuerpo desplazable y pie con acciones. Lectura acoplada puede ser no modal. Editor superpuesto gestiona foco, Escape y restauración. | URL directa válida. Cancelar confirma cambios pendientes. Con error de guardado, conservar el formulario y el blanco seleccionado. |
| Calendario | Controles Hoy/anterior/siguiente, fecha, vista y equipo. Encabezados de empleados o días, franjas con zona de la sede, selección provisional y bloque confirmado. Lista diaria comparte acciones. | Día separa columnas por empleado, Semana por día para el empleado seleccionado. Seleccionar por teclado, lista o toque. Marcar provisional y estado con texto accesible. Al guardar enfocar el bloque confirmado. |
| Formulario y selectores | Etiquetas persistentes, obligatoriedad e instrucciones de formato. Secciones agrupadas, elecciones buscables cuando crezca la lista. Guardar/Cancelar en pie. Error junto al campo más resumen navegable. | Bloquear envío duplicado mientras se guarda. Conservar datos ante validación, conflicto o red. Si selección archivada o inválida, explicar y permitir sustituirla. |
| Diálogo y hoja de acciones | Menú para acciones contextuales. Diálogo para pérdida de cambios y operaciones irreversibles con título, efecto, cancelar y confirmar. En móvil, hoja de acciones con escape y botón de cierre. | Confirmar con texto específico, enfocar opción de menor riesgo y devolver foco. Evitar editores modales simultáneos. |
| Aviso y estado | Confirmación breve anunciada de forma no intrusiva más cambio persistente en fila, bloque o recibo. Error crítico en la pantalla y referencia de operación cuando exista. Estado textual además del color. | El resultado permanece consultable cuando desaparece el aviso. Ante actualización tras guardado mostrar estado intermedio, sin confundirlo con colección vacía. |
| Checkout y Panel Caja, posteriores | Carrito junto a catálogo, resumen y total persistentes; en Caja, saldo y estado antes de Resumen/Actividad. Formato monetario según sede. Mostrar previsto, contado y diferencia con signo. | Recuperar folio o sesión tras reintento. Totales confirmados coinciden con el registro consultable. La hoja móvil no tapa el botón primario. [POS](../VIDEOS/REGISTRO_VENTA.mp4) 36–62 s · [Arqueo](../VIDEOS/CAJA_CIERRE.mp4) 43–57 s |
| Asistente y Biblioteca, posteriores | Asistente con pasos y resumen revisable; Biblioteca con categorías y filtros antes de abrir informe. Informar corte y contexto del conjunto. | Retroceder conserva datos válidos. La descarga refleja período, sede y definición elegida. [Comisión](../FOTOGRAMAS/EQUIPO/70s.jpg) · [Biblioteca](../V03_EXPLORACION/265s_informes_categorias.jpg) |

## Composición por pantalla prioritaria

| Pantalla | Cabecera y cuerpo | Estado inicial o salida |
|---|---|---|
| Acceso y ámbito | Marca MAMBO JAMBO, campos de acceso y estado. Selector con negocios y sedes autorizadas. | Error recuperable sin exponer si otra identidad pertenece a un negocio. Sesión válida abre destino. |
| Agenda y cita | Fecha y controles en cabecera, calendario bajo filtros; detalle con fecha/estado, cliente, servicio, empleado, duración y total estimado. | Si falta equipo o servicio, explicar el paso pendiente y enlazar catálogo o equipo con permiso. Salida vuelve a la misma fecha. |
| Clientes | Añadir en cabecera, buscador, lista con nombre, contacto permitido y estado. Panel con Resumen/Datos/Citas y edición. | Sin historial, mostrar mensaje en la pestaña. Guardado devuelve la ficha. |
| Servicios | Añadir servicio, búsqueda, categorías a la izquierda del listado, filas con duración/precio. Formulario de datos y asignación. | Seleccionar categoría actualiza el listado. Servicios archivados aparecen solo mediante filtro histórico. |
| Equipo y turnos | Directorio filtrable por sede/estado. Perfil con Datos y Asignaciones. Turnos con semana y selector de miembro, editor de vigencia y franjas. | Usuario sin cuenta puede aparecer como empleado. Guardar turno actualiza calendario de turnos y disponibilidad para citas nuevas. |
| Configuración | Menú local Negocio/Sucursales/Accesos. Formulario de sede y tabla de permisos con vínculo a detalle. | Si un permiso se revoca, retirar el acceso afectado después de confirmar y registrar el cambio. |

## Estados y comprobaciones

- **Carga:** mantener cabecera y filtros, anunciar región ocupada y evitar duplicar acciones. **Vacío inicial:** explicar qué falta y ofrecer alta si hay permiso. **Sin coincidencias:** mostrar filtros activos y restablecer.
- **Error de lectura:** reintentar en la misma vista. **Error de escritura:** conservar datos, distinguir validación por campo de conflicto de versión o disponibilidad. **Éxito:** indicar el resultado y mantener el registro, estado y retorno verificables.
- **Sesión caducada:** renovar por el flujo de acceso y recuperar destino autorizado. **Acceso revocado:** retirar los datos visibles. **Edición ajena:** ofrecer recargar el estado confirmado y reaplicar cambios conscientemente.
- Ejecutar las comprobaciones futuras con teclado, lector de pantalla y zoom, además de interacción táctil. El móvil de Agenda, Clientes, Catálogo, Inventario, Equipo e Informes es una adaptación propia aún sin validación comparativa. [Prueba T15](../CODEX_REVERSE_ENGINEERING_BLUEPRINT/05_TEST_STRATEGY.md)
