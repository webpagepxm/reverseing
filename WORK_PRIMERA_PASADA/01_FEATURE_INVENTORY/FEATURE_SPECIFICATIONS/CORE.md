# Fichas núcleo — E01, evidencia histórica
## F001–F002 Clientes
Propósito: identidad asociada a reserva/venta. Formulario: nombre, apellido, email, teléfono/prefijo; nacimiento día/mes/año; género; pronombres; origen; referido por; idioma de notificaciones; ocupación (255), país, contacto adicional, etiquetas. Subpantallas direcciones, emergencia y ajustes.
Prueba: abrir alta → guardar vacío → error obligatorio → nombre Mambo QA / apellido Prueba ficticia, sin contacto → guardar → toast cliente creado.
No concluir que cualquier combinación de campos es válida ni que correo/teléfono nunca sean necesarios.
## F003–F006 Agenda
Vista día, fecha, filtro equipo, visibilidad, espera, ajustes. Añadir cita, grupo, bloqueo, venta o pago rápido.
Alta: elegir cliente → servicio → empleado cualquiera o específico → hora → revisar → guardar. Prueba histórica: 16 nov 17:00–18:30, Corte de pelo90m25MXN, asignación automática al propietario; toast cita creada.
Cliente puede omitirse en selector (walk-in); no se probó guardar sin cliente. Línea permite editar/eliminar; añadir servicios; recurrencia visible.
Estados ofrecidos reservada, confirmada, en espera, iniciada, inasistencia, cancelación. Solo persistencia reservada probada.
Configuración cuenta: zona CDMX,24h, semana domingo; anticipación12meses, reserva inmediata, intervalos15m. No son invariantes globales.
## F007–F009 POS
Desde cita → Finalizar compra → carrito con mismo cliente/servicio/empleado/25MXN → propina → pago. Opciones propina ninguna10/18/25% o personalizada. Opciones efectivo, regalo, dividido y otros; guardar venta sin pagar.
Se descartó borrador con confirmación. No se cobró ni devolvió; no se deducen efectos de stock/comisión/contabilidad.
## F010–F011 Servicios
Nombre255, categoría, tratamiento marketplace, descripción1000, precio/tipo fijo observado, duración, tiempo adicional. Equipo multiselección, recursos, complementos, reserva online, imágenes, formularios, comisiones, ajustes.
Dos servicios de ejemplo90m25MXN: valores de catálogo, no precios universales.
## F012–F015 Personal
Perfil de ejemplo: ventas, citas, clientes, ocupación, retención. Ocupación descrita como tiempo reservado sobre disponible, excluye ausencias/bloqueos. Retención descrita respecto a primeras citas anteriores al periodo, excluye walk-ins; fórmula completa desconocida.
Turnos semanales separados del horario público. Roles básico/bajo/medio(predeterminado)/alto/propietario/sin acceso; matriz efectiva no recuperada.
Comisiones: deducir descuentos e impuestos activado; costes desactivado; comisión íntegra antes de descuentos bonos/membresías/fidelidad desactivada; exigir factura totalmente pagada desactivado; permitir comisión fija mayor al pago desactivado. Configurable por empleado; no probado.
## F016–F017 Productos
Nombre barcode marca unidad cantidad; unidades ml,l,fl oz,g,kg,gal,oz,lb,cm,ft,in,producto completo. Descripción100/1000, categoría, coste compra, venta habilitada, precio/margen/impuestos, comisión, SKU automático/múltiple, proveedor, seguimiento stock, existencias, umbral bajo, cantidad reposición, alerta y fotos.
Formulario inspeccionado; producto no guardado. Conteos/pedidos/proveedores solo descubiertos.
## F018–F020 Reportes
Catálogo64 reportes; grupos56 estándar8premium5paneles no disjuntos. Resumen mes/centro, citas, servicios, empleado solicitado%, valor total/medio, rebooking y24h, clientes nuevos/habituales/walk-in.
Conteos enlazan lista filtrada. Opciones exportar CSV/Excel/PDF y personalización premium visibles, no ejecutadas.
