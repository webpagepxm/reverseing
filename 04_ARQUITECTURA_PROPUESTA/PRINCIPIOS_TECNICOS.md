# Principios técnicos para una implementación independiente

- Stack posible: TypeScript, Next.js y PostgreSQL/Supabase, por decisión de proyecto y no porque se haya detectado en Fresha.
- Arquitectura multi-tenant explícita en cada dato; autorización con test de filtrado cruzado.
- `cash_sessions`, `cash_movements`, `payments`, `sales` y `stock_movements` como registros transaccionales con trazabilidad. Diferenciar efectivo físico en caja de otras modalidades de pago.
- Pagos y devoluciones con claves de idempotencia, conciliación y estados verificables. Nunca asumir éxito de una transacción a partir de clic o frontend.
- Reserva de horarios con restricción de concurrencia, buffers y zonas horarias definidas.
- Roles y permisos evaluados del lado servidor, con auditoría de operaciones sensibles.
- Comisiones derivadas de líneas de ventas elegibles y vigencia explícita; cambios retrospectivos bajo política definida.
- QA antes de operar con dinero real: pruebas unitarias, integración, Playwright, concurrencia/carga, restauración de backups, CI, monitoreo y revisión humana.
