# MAMBO JAMBO V2

Demo estática de operación para salones y barberías. La navegación se organiza por riel, menú contextual, área de trabajo y panel lateral. El estilo, los datos, el código y el Inicio son propios de MAMBO JAMBO.

- [Abrir la demo en GitHub Pages](https://webpagepxm.github.io/reverseing/)
- [Blueprint de MAMBO JAMBO](../MAMBO_JAMBO_UX_BLUEPRINT/)
- [Blueprint de evidencia y pruebas](../CODEX_REVERSE_ENGINEERING_BLUEPRINT/)

## Abrir en local

Con Node.js 22 o posterior, desde `app/`:

```bash
npm ci
npm run dev
```

Entra a `http://localhost:3000/reverseing/`. El selector superior cambia la sucursal. Agenda abre el 18 de noviembre de 2026, fecha del conjunto ficticio. Roma Norte tiene citas y el producto **Bruma botánica** con 12 unidades a $123. Condesa tiene una venta pagada, una sesión cerrada, un pedido recibido parcialmente, un recuento aplicado y una liquidación de muestra.

Los cambios se guardan en este navegador. En **Configuración → Preferencias → Restablecer demostración** puedes recuperar ese conjunto inicial. Usa datos ficticios en todos los formularios.

## Qué se puede recorrer

| Grupo | Operaciones disponibles |
|---|---|
| Inicio | Citas del día, próximas reservas, ventas, estado de Caja y accesos directos derivados del mismo estado. |
| Agenda | Día, Semana y Lista. Selección de fecha, profesional y sucursal. Alta, edición, reprogramación, historial y transiciones. Enlaces a la ficha del cliente y al POS. |
| Ventas | Búsqueda y filtros, borradores y pendientes, carrito de servicios/productos, propina, cobro en efectivo, recibo y anulación con ajuste. Vistas de citas, pagos y artículos vendidos. |
| Caja | Un registro principal por sucursal. Apertura con sugerencia, entradas/salidas, actividad con origen, arqueo, cierre e historial. |
| Clientes | Alta, edición, coincidencias por correo/teléfono, archivo, citas y compras. Segmentos estándar y personalizados con conteo y lista de miembros. |
| Catálogo | Servicios agrupados por categoría, edición, archivo y asignación por sucursal. Productos, proveedores, movimientos, pedidos con recepción parcial y recuentos con revisión. |
| Equipo | Miembros, asignaciones, turnos semanales con vigencia, comisiones por familia, devengos, ajustes y liquidaciones con referencia ficticia. |
| Informes | Biblioteca y paneles. Cinco informes derivados de los registros con filtros, corte y detalle. La existencia actual se calcula con el saldo al momento de abrir el informe. |
| Configuración | Datos del negocio, preferencias, alta/edición de sucursal y vista de navegación según rol de demostración. |

Fichajes, fidelización, reputación, tarjetas regalo, bonos, membresías, recargos e integraciones están reservados en el blueprint. Los cambios de turno usan una franja por patrón semanal. La moneda operativa de la demo es MXN. Los movimientos de Caja se corrigen mediante el ajuste de una venta o un movimiento posterior con motivo.

### Caso para revisar los importes

En Roma Norte, abre Caja. Crea una cita de **Corte de prueba · 25 MXN** en un hueco de Inés o Luna. Desde la cita, selecciona **Cobrar cita**. Ingresa **6.25** de propina y **40** de efectivo recibido. El recibo muestra **31.25** de total y **8.75** de cambio. Consulta el folio en Ventas, el movimiento en Caja y el total en Informes → Ventas. La cita mantiene su estado.

### Decisiones propias de simulación

El efectivo necesita una sesión activa. Su confirmación añade al mismo estado local el pago, el asiento de Caja, las salidas de inventario rastreado y los devengos. Los importes de POS, Caja y remuneración se calculan en centavos. La comisión se aplica al importe de la familia elegible sin propina. La tasa y el resultado se vinculan a la versión de la regla correspondiente. Una anulación deja un ajuste enlazado y revierte las existencias rastreadas. Las liquidaciones registran una referencia ficticia. Los segmentos usan una condición y una ventana de días relativa a la fecha de corte.

La persistencia local es para revisión en un navegador y los roles son una simulación de navegación. La operación real requerirá PostgreSQL/Supabase, autenticación, aislamiento por negocio y sucursal, RLS, transacciones, auditoría e idempotencia de servidor. Las pruebas de concurrencia, recuperación, exportación CSV, pagos mixtos e integraciones de T01–T16 quedan para la etapa correspondiente.

## Verificación

```bash
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

El build estático genera `out/`. Playwright sirve esa carpeta bajo `/reverseing/`. Si Chromium ya está instalado puedes usar `MAMBO_CHROMIUM=/usr/bin/chromium npm test`. Usa `MAMBO_CAPTURE=1` para regenerar las capturas y `MAMBO_PORT` para cambiar el puerto de pruebas.

La suite local cubre los recorridos A–E, enlaces profundos y recarga, navegación y filtros, errores de turno/solape, cierre y ajuste de Caja, persistencia y restablecimiento. Incluye seis anchos de 360 a 1440 px y retorno de foco con teclado. El workflow comprueba en Chromium el SHA servido por Pages, las rutas y los recursos públicos después del despliegue.

## Capturas y evidencia

| Interfaz | Capturas V2 | Patrón y diferencias |
|---|---|---|
| Agenda | [Calendario](review/v2/agenda.png) · [Detalle](review/v2/detalle-cita.png) · [Editor](review/v2/editor-cita.png) | Cuadrícula visible junto a selección de franja y panel. Se añaden notas, historial y enlaces al cliente y al POS con la identidad propia. [Ref. de cita](../05_EVIDENCIAS/FOTOGRAMAS/CITAS/s46.jpg) |
| Clientes | [Lista](review/v2/clientes.png) | Búsqueda, estado y ficha contextual. Las pestañas reflejan citas y compras del conjunto local. [Ref. de ficha](../05_EVIDENCIAS/FOTOGRAMAS/CLIENTES/t_006s.jpg) |
| POS | [Carrito y cobro](review/v2/pos.png) | Catálogo y carrito persisten lado a lado en escritorio. Propina y efectivo aparecen en el mismo formulario de demostración, con cambio explícito. [Ref. de cobro](../VIDEOS/REGISTRO_VENTA.mp4) · 48 s |
| Caja | [Actividad](review/v2/caja-abierta.png) · [Arqueo](review/v2/arqueo.png) | Saldo, Resumen/Actividad y acciones de movimiento. El arqueo usa un panel contextual propio con la diferencia visible y reparto entre retenido y retirado. [Ref. de sesión](../CAJA_ROLLOVER/t_028s.jpg) · [Ref. de cierre](../VIDEOS/CAJA_CIERRE.mp4) · 44 s |
| Inventario | [Productos](review/v2/productos.png) · [Existencias y movimientos](review/v2/inventario.png) | Tabla de productos y estados de recuento. Las recepciones y el ajuste se reflejan en un libro local de stock. [Ref. de producto](../FOTOGRAMAS/INVENTARIO/175s.jpg) · [Ref. de recuento](../FOTOGRAMAS/INVENTARIO/185s.jpg) |
| Comisiones e informes | [Comisiones](review/v2/comisiones.png) · [Informe de ventas](review/v2/informes.png) | Reglas y vigencia juntas en Equipo. Biblioteca separada del informe, con filtros encima del resultado. [Ref. de regla](../FOTOGRAMAS/EQUIPO/98s.jpg) · [Ref. de informe](../INFORMES/seg_66.jpg) |
| Móvil | [Menú global](review/v2/navegacion-movil.png) · [Detalle](review/v2/cita-movil.png) | Lista en Agenda, navegación desplegable y panel a pantalla completa. Adaptación propia. La evidencia móvil disponible corresponde a Caja. [Ref. de acciones móviles](../V04_CAJA/M10_menu_movimientos.jpg) |

### Punto de partida

La rama de Pages en `f0ac7fb` ya exportaba V1 al mismo dominio y prerenderizaba sus rutas. Agenda tenía tres vistas y alta temporal. Clientes, Catálogo, Equipo y Configuración tenían vistas básicas de consulta. Los componentes reutilizables, el diseño y la estructura se conservaron. V2 incorpora el estado persistente, las operaciones y los módulos de Inicio, Ventas, Caja, Inventario, remuneración, segmentación e informes.
