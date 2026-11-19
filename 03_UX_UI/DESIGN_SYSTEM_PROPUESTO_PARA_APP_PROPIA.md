# Diseño de componentes ORIGINAL sugerido para una app propia

La siguiente propuesta es **una interpretación nueva**; no representa tokens oficiales de Fresha.

- **AppShell**: icon rail + subnavegación plegable + contenido principal; en móvil usar navegación específica del contexto, sin asumir la misma barra lateral.
- **ContextDrawer**: cabecera, estado, tabs, cuerpo scrollable, footer sticky de acciones. Gestionar foco y cierre con teclado.
- **DataTable**: búsqueda, filtros, sort, sticky header opcional, export opcional, loading/empty/error states y paginación real.
- **BookingCalendar**: controles de período/equipo, slots y modal/drawer de cita; solapes deben verificarse en backend.
- **CheckoutFlow**: carrito → propina → pago → confirmación, con idempotencia y resumén persistente del total.
- **CashSessionPanel**: estado y saldo, historial filtrable, formularios de movimientos y arqueo con diferencias explicitadas.
- **ProductEditor**: secciones colapsables de general, precio, inventario y proveedores; validaciones junto al campo.
- **EmployeeEditor**: pestañas permisos, agenda, comisiones, nómina; las autorizaciones reales se controlan en backend.
- **ReportLibrary**: catálogo categorizado, panel de filtros y visualización tabular.
- **CustomerProfile**: detalle contextual con tabs y acciones; respetar permisos de datos personales.

**Regla de diseño:** se puede adoptar una interacción útil sin replicar su apariencia o material propietario. Decisiones propias deben documentarse y testearse en desktop/móvil.
