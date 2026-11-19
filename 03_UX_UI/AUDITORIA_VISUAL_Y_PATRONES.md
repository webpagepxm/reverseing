# Auditoría UX/UI basada en videos y fotogramas (sin CSS extraído)

## Patrón de producto
Interfaz desktop con **riel vertical de iconos** persistente a la izquierda, **submenú textual contextual** por sección y una **zona central de trabajo**. Detalles complejos utilizan paneles o drawers laterales. Este patrón se observa en Caja, Clientes y Citas; no se puede afirmar que todas las vistas se comporten idénticamente.

## Inventario de componentes observables
| Componente | Dónde aparece | Interacción evidenciada | Limitación |
|---|---|---|---|
| Riel global de iconos | dashboard, Ventas, Equipo, Clientes | cambiar módulo | atajos teclado no probados |
| Menú contextual | Ventas, Clientes, Equipo | seleccionar subárea | permisos no evaluados |
| Drawer lateral de detalle | ficha cliente, caja abierta, editor de cita | contexto sin abandonar tabla/calendario | no se midieron anchos ni animación |
| Tabs y subnavegación | Ventas/Borradores, Resumen/Actividad, segmentos | cambiar vista | persistencia de pestaña no probada |
| Calendario temporal | agenda | seleccionar empleado, franja y vista | solapes y drag/drop no probados |
| Formulario de pasos | venta y cobro | Carrito/Propina/Pago | validaciones parciales |
| Filtros y ordenamientos | listas de citas, informes, actividad | menú de filtros | resultados completos no probados |
| Toasts de confirmación | cita, producto, proveedor, comisión, caja, segmento | feedback tras guardar | tiempo y aria-live no medidos |
| Tablas con estado vacío | Ventas, Informes, proveedores | representar ausencia | paginación/export no probada |
| Diálogos / paneles de confirmación | Caja cierre, producto, equipo | introducir datos y confirmar | escape/foco no probados |
| Chips de estado | citas, caja, reservas | indicar Reservada/Abierta/Cerrada | semántica exacta de cada status desconocida |
| Módulos de pago adicional | IA, fidelidad, reportes premium | CTA de activación | no significa función habilitada |

## Layout visual observado
- Uso predominante de superficies claras, fondo gris muy pálido, tarjetas blancas, divisores finos, redondeos, acentos morados/verdes en algunos estados y botones oscuros para acciones principales. **Son descripciones observadas, no códigos hex extraídos.**
- Tablas con encabezados discretos; datos densos organizados en columnas, buscador/filtros encima. Paneles laterales blancos de anchura significativa.
- Jerarquía: título de módulo > contexto/filtros > área de contenido > acciones locales. Cabeceras de Caja muestran saldo grande y estado.
- Mensajes de error y éxito breves; la grabación de alta de producto muestra mensaje general de errores de formulario sin localizar exactamente qué campo lo provoca.

## Flujos UX destacables
1. **Caja:** una tarjeta abre un drawer lateral con Resumen/Actividad; botones para entrada/salida reducen navegación, el cierre tiene formulario con *Previsión / Contabilizado / Diferencia*. Los eventos aparecen en historial con usuario y hora.
2. **Venta:** catálogo a un lado, carrito y monto visible al otro; paso de propina y luego método de pago; CTA primario en la parte inferior.
3. **Citas:** selección espacio-temporal directamente en calendario, previsualización provisional y editor lateral que conserva el contexto de la agenda.
4. **Productos:** formulario largo agrupado por identidad, clasificación, precios y existencias; alta contextual de marca/categoría sin abandonar el flujo. Riesgo UX: gran longitud y validaciones generales.
5. **Equipo:** perfil de empleado con subsecciones, asistente de comisión por pasos, calendario/turnos y aprobación de proceso de pago.
6. **Informes:** biblioteca → categoría → reporte tabular → panel/dashboard; filtros por período/dimensión y estados vacíos/premium.
7. **Clientes:** detalle contextual dentro del listado, navegación de ficha, segmentos en listas estándar/personalizados y editor de reglas.

## Diseño móvil / táctil — solo lo observado
Existe evidencia vertical de **Caja** (aprox. 512×1108 px). Se ven listas compactas, menú de acciones y formularios de caja adaptados al ancho. **No existe evaluación responsive equivalente** para Calendario, Clientes, Inventario ni Equipo. No deducir breakpoints o medidas de touch targets.

## Accesibilidad — pendientes
Comprobar en app propia: orden de tabulación, foco retenido/devolución al cerrar drawers, ESC, etiquetas form, validación por campo, mensajes mediante live regions, contraste, scroll bloqueado en modal, adaptación zoom 200%, títulos/roles semánticos, teclado en calendario y selección de hora con touch.

## Lo que NO tenemos
No hay inspección del CSS computado, diseño tokenizado original, medidas precisas, tipografía identificada por fuente ni accesibilidad validada mediante pruebas WCAG. Codex debe crear **tokens originales** y calibrar con capturas, no afirmar que reconstruye los de Fresha.
