# MAMBO JAMBO V3

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
| Caja | Un registro principal por sucursal. Apertura con sugerencia, entradas/salidas, actividad con origen, arqueo guiado, cierre y reapertura sugerida. |
| Clientes | Alta, edición, coincidencias por correo/teléfono, archivo, citas y compras. Segmentos estándar y personalizados con conteo y lista de miembros. |
| Catálogo | Servicios agrupados por categoría, edición, archivo y asignación por sucursal. Productos, proveedores, movimientos, pedidos con recepción parcial y recuentos con revisión. |
| Equipo | Miembros, asignaciones, turnos semanales con vigencia, comisiones por familia, devengos, ajustes y liquidaciones con referencia ficticia. |
| Informes | Biblioteca y paneles. Cinco informes derivados de los registros con filtros, corte y detalle. La existencia actual se calcula con el saldo al momento de abrir el informe. |
| Configuración | Datos del negocio, preferencias, alta/edición de sucursal y vista de navegación según rol de demostración. |

Fichajes, fidelización, reputación, tarjetas regalo, bonos, membresías, recargos e integraciones están reservados en el blueprint. Los cambios de turno usan una franja por patrón semanal. La moneda operativa de la demo es MXN. Los movimientos de Caja se corrigen mediante el ajuste de una venta o un movimiento posterior con motivo.

### Caso para revisar los importes

En Roma Norte, abre Caja. Crea una cita de **Corte de prueba · 25 MXN** en un hueco de Inés o Luna. Desde la cita, selecciona **Cobrar cita**. Ingresa **6.25** de propina, elige **Continuar a efectivo** e ingresa **40** como efectivo recibido. Si la sesión está cerrada, elige **Guardar carrito y abrir caja** y luego **Retomar cobro**. El recibo muestra **31.25** de total y **8.75** de cambio. Consulta el folio en Ventas, el movimiento en Caja y el total en Informes → Ventas. La cita mantiene su estado.

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

La suite local cubre los recorridos A–E, enlaces profundos y recarga, navegación y filtros, errores de turno/solape, cierre y ajuste de Caja, persistencia y restablecimiento. Incluye seis anchos de 360 a 1440 px y retorno de foco con teclado. El workflow comprueba en Chromium el SHA servido por Pages, las rutas, los recursos públicos y la apertura de Caja móvil después del despliegue.

## Capturas y evidencia

- [Matriz de diferencias antes de V3](review/v3/VISUAL_GAP_ANALYSIS.md)
- [Comparación final y evaluación de Caja](review/v3/VISUAL_REVIEW_REPORT.md)
- [Capturas de V3](review/v3/despues/)
- [Capturas de V2](review/v2/)

V3 parte de `c23e804` y conserva el almacenamiento local de V2. El riel, la navegación contextual, las tablas y los paneles comparten una interfaz más compacta. Caja muestra el saldo esperado junto al registro y sus acciones. El arqueo separa conteo, distribución y confirmación. Agenda permite elegir franjas disponibles sin perder la fecha o el profesional al cerrar.
