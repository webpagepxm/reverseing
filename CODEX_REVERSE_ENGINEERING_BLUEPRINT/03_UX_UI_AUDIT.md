# Auditoría UX/UI y diseño propio

## Interacción observada

| Patrón | Qué ayuda al operador | Fricción observada o riesgo por comprobar | Evidencia |
|---|---|---|---|
| Navegación e información | Riel global, menú textual del módulo y zona de trabajo. Catálogo reúne servicios y productos. | Algunos accesos dependen de iconos. En ficha de cliente se ven varios niveles de navegación simultáneos. | [Catálogo](../FOTOGRAMAS/INVENTARIO/085s.jpg) · [Ficha](../05_EVIDENCIAS/FOTOGRAMAS/CLIENTES/t_006s.jpg) |
| Jerarquía | Título, controles de contexto y área de datos. Caja destaca estado y saldo. | Filtros y acciones se distribuyen entre cabecera, pestañas y menú. Verificar que el alcance de cada acción sea reconocible. | [Caja](../CAJA_ROLLOVER/t_028s.jpg) · [Informe](../INFORMES/seg_66.jpg) |
| Calendario y selectores | Hoy, período, filtro por equipo y modos en una cabecera. La cuadrícula representa la reserva provisional antes de guardar. | Al abrir el editor se reduce el ancho visible. Hora y empleado requieren señales persistentes con cuadrícula densa. Acciones de cita comparten menú. | [Selector](../05_EVIDENCIAS/FOTOGRAMAS/CITAS/s02.jpg) · [Previsualización](../05_EVIDENCIAS/FOTOGRAMAS/CITAS/s46.jpg) · [Acciones](../05_EVIDENCIAS/FOTOGRAMAS/CITAS_MODIFICACION/t_03.5.jpg) |
| Formularios | Producto agrupa identidad, precio y existencias. Comisión y pago distribuyen decisiones por pasos. | El alta de producto muestra un aviso general que deja sin identificar el primer campo a corregir en ese fotograma. El cierre de caja muestra error junto al importe. | [Producto](../FOTOGRAMAS/INVENTARIO/140s.jpg) · [Cierre a 44 s](../VIDEOS/CAJA_CIERRE.mp4) · [Comisión](../FOTOGRAMAS/EQUIPO/70s.jpg) |
| Tablas, búsqueda y filtros | Filtros visibles sobre tablas y pestañas de Ventas/Borradores. Caja filtra actividad por tipo y empleado. | Tras confirmar la venta se ve brevemente «Aún no hay ventas». El operador podría interpretar el vacío como una operación fallida. | [Venta a 57–62 s](../VIDEOS/REGISTRO_VENTA.mp4) · [Actividad](../V05_CAJA/066s_actividad_historial.jpg) · [Salarios vacío](../INFORMES/seg_91.jpg) |
| Diálogos y paneles | Venta conserva el carrito y total mientras cambia de etapa. CRM y Caja mantienen visible el contexto de origen. | Paneles anidados y overlays compiten por espacio. El campo de efectivo abre un teclado propio. Queda por comprobar la secuencia de foco. | [Venta a 32–54 s](../VIDEOS/REGISTRO_VENTA.mp4) · [Caja](../CAJA_ROLLOVER/t_028s.jpg) · [CRM](../05_EVIDENCIAS/FOTOGRAMAS/CLIENTES/t_018s.jpg) |
| Feedback y vacíos | Cita y Caja muestran confirmación acompañada de nuevo estado. Reputación e informes distinguen métricas en cero y vistas promocionales. | Varias notificaciones pueden coexistir. En formularios largos, un mensaje fugaz puede requerir volver a buscar el error. | [Cita](../05_EVIDENCIAS/FOTOGRAMAS/CITAS/s54.jpg) · [Cierre a 55 s](../VIDEOS/CAJA_CIERRE.mp4) · [Avisos de segmento](../05_EVIDENCIAS/FOTOGRAMAS/CLIENTES/t_072s.jpg) · [Reputación](../05_EVIDENCIAS/FOTOGRAMAS/CLIENTES/t_089s.jpg) |
| Móvil | Caja vertical con tarjetas, hoja de acciones, teclado numérico y formularios a ancho completo en grabaciones 512×1108. | El teclado ocupa parte de la vista durante el arqueo. La evidencia móvil de los otros módulos, los tamaños táctiles y los puntos de cambio siguen abiertos. | [Acciones](../V04_CAJA/M10_menu_movimientos.jpg) · [Arqueo a 38–43 s](../VIDEOS/CAJA_CIERRE.mp4) |
| Accesibilidad | Los árboles AX de marketing muestran nombres de algunos controles y estados expandidos o contraídos. | Hay entradas sin nombre descriptivo en el árbol histórico. Foco, lectura de errores, contraste, teclado, zoom y semántica de agenda requieren pruebas completas. | [Árbol AX de recordatorios](../WORK_PRIMERA_PASADA/08_EVIDENCE/E04_reminder_details_ax.txt) |

Se observan superficies claras, separadores discretos, énfasis oscuro en acciones y colores en estados. Las medidas, fuentes y valores cromáticos de Fresha quedan indeterminados.

## DECISION_PROPIA · Sistema de diseño

**Navegación.** Menú lateral textual con Agenda, Contactos, Punto de venta, Inventario, Equipo y Análisis, con cambio de sucursal en cabecera y título con contexto. Agrupar servicios en Configuración dentro de Agenda y Caja en Punto de venta. En móvil usar barra para Agenda, Cobrar y Contactos, con Más para las demás secciones. Conservar los filtros por página en la URL cuando puedan compartirse sin datos sensibles.

| Uso | Propuesta propia |
|---|---|
| Tipografía | Inter para controles, tablas y números tabulares. Instrument Serif para títulos de secciones informativas. Cuerpo 16 px, texto auxiliar 14 px, títulos 24/32 px. |
| Color | Fondo marfil `#F8F6F0`, superficie `#FFFFFF`, texto `#182B2A`, texto secundario `#405653`, acción petróleo `#0B5954` con texto blanco, terracota `#A63F28` para atención y foco `#1957A6`. Validar combinaciones finales en T15. |
| Ritmo visual | Retícula base 4 px, márgenes de contenido 16/24/32 px, radios 8 px, divisiones visibles y elevación reservada a overlays. Objetivo táctil de 44×44 px en acciones principales. |
| Estados | Texto e icono además del color. Carga con región ocupada y encabezado estable. Vacío inicial con siguiente acción, filtros sin resultados con restablecer, error con reintento y éxito con enlace al registro. |
| Formularios | Etiqueta persistente, ayuda de formato, error junto al campo y resumen con foco al primer error. Mantener datos al recuperar errores de servidor. Confirmar cierre, anulación y cambios de permisos. |
| Agenda | Semana y día en escritorio, lista diaria como alternativa con las mismas acciones y fecha explícita. Selector de franjas por teclado y toque. En móvil, editor de pantalla completa y vuelta a la fecha seleccionada. |
| Panel contextual | Cabecera con nombre y estado, cuerpo y acciones al pie. Panel de lectura no modal en escritorio. En editor modal, foco inicial, Escape y retorno al disparador. Evitar overlays anidados en móvil. |
| Tablas | Columnas elegidas por tarea, encabezados con alcance semántico, orden anunciado, paginación y recuento. Mostrar contexto de centro/período al exportar. En pantallas estrechas, filas resumidas con acceso al detalle. |
| Checkout y arqueo | Total persistente, propina separada, cambio visible y confirmación con recibo. Tras confirmar, mostrar estado de la operación durante la actualización de lista. En arqueo mostrar previsto, contado y diferencia con signo y texto. |

Objetivo WCAG 2.2 AA para los flujos principales. Probar 360/768/1280 px, teclado, lector de pantalla y zoom al 200 %. Los criterios viven en [T15](05_TEST_STRATEGY.md).
