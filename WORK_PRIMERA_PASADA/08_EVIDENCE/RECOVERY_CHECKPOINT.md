# MAMBO JAMBO — checkpoint de investigación

Fecha: 17 noviembre 2026. Investigación parcial; aplicación todavía no construida.

## Evidencia y alcance
Observaciones del 16 recuperadas del registro de herramientas del chat. Los archivos y capturas temporales de ese día se perdieron. No se presentan como archivos conservados. Observaciones del 17 verificadas en sesión autenticada: queda 1 día de prueba.

## Verificado mediante ejecución el 16
- Alta de cliente: guardar vacío produce campo obligatorio; nombre Mambo QA, apellido Prueba ficticia permitió guardar sin correo ni teléfono. Toast Cliente creado. Cliente [ID omitido].
- Agenda: servicio Corte de pelo, 90 minutos, 25 MXN; selección de cualquier empleado, horario 17:00–18:30 del 16 noviembre. Guardar produjo Cita creada; cita [ID omitido], reserva [ID omitido]. No repetir la creación al retomar.
- Estados ofrecidos: reservada, confirmada, en espera, iniciada, inasistencia, cancelar. Solo reservada se probó con persistencia.
- Finalizar compra transfirió cliente, servicio, empleado e importe al POS. Pasos carrito, propina y pago. Propinas: ninguna, 10%, 18%, 25%, personalizada. Métodos ofrecidos: efectivo, regalo, pago dividido, otros. No se ejecutó pago. Se descartó el borrador de venta.

## Formularios inspeccionados el 16
- Clientes: nombre, apellido, email, teléfono y prefijo; nacimiento; género; pronombres; origen; recomendado por; idioma de notificaciones; ocupación (255 caracteres), país, contacto adicional, etiquetas. Secciones direcciones, contactos de emergencia y ajustes.
- Servicio: nombre (255), categoría, tratamiento para marketplace, descripción (1000), precio y tipo, duración y tiempo adicional. Secciones equipo, recursos, adicionales, reserva online, imágenes, formularios, comisiones y ajustes. Asignación de varios empleados observada.
- Producto: nombre, código de barras, marca, medida/cantidad, descripción corta (100) y larga (1000), categoría, coste, precio, margen, impuestos, venta habilitada, comisión, SKU múltiple/generado, proveedor, stock actual, umbral de stock bajo, cantidad de reposición, notificaciones y fotos. No se guardó producto.
- Roles: básico, bajo, medio (predeterminado), alto, propietario y sin acceso. No se modificaron permisos.
- Comisiones: descontar descuentos/impuestos/costes; tratamiento de bonos, membresías y fidelización; exigir factura íntegramente pagada; permitir comisión superior al importe pagado. Configuración observada, cálculo no probado.
- Turnos del equipo independientes del horario público del negocio. Perfil demo muestra ventas, citas, clientes, ocupación y retención; remuneración incluye salario/fichaje, comisiones, pago manual y adelantos.
- Disponibilidad online: hasta 12 meses de anticipación, reserva inmediata, cancelación/reprogramación en cualquier momento en esta cuenta; intervalos de 15 minutos. Son valores configurables, no reglas universales.

## Verificado el 17: reportes
URL observada: https://partners.fresha.com/reports/table/appointment-summary
- Catálogo muestra 64 informes; etiquetas 56 estándar, 8 prémium y 5 paneles (no sumar estas categorías como conjuntos disjuntos).
- Resumen de citas: mes actual y centro; 1 cita, 1 servicio, 25 MXN de valor total y medio; 1 cliente nuevo, 100% nuevos. Sin nueva reserva, sin habituales ni clientes sin cita. Concuerda con la prueba anterior; no equivale a ingresos cobrados.
- Indicador de frescura: Datos de hace 19 minutos. No asumir tiempo real ni periodicidad fija.
- Columnas: citas, servicios, porcentaje de empleados solicitados, valor total/medio, nuevas reservas, nuevas reservas en 24h, clientes nuevos/habituales/sin cita y repetición.
- Enlace desde centro y conteos hacia lista de citas filtrada por centro y periodo.
- Menú Personalizar marca como Prémium: columnas, gráficos, filtros avanzados, guardar y duplicar vista. Disponibilidad real tras entrar aún pendiente.
- Menú Opciones: favoritos, informe personalizado y exportaciones CSV, Excel, PDF. Exportación aún no probada.
- Aviso visible: las funcionalidades de Resumen de clientes se fusionaron en Resumen de citas.

## Inferencias para diseño propio (no arquitectura interna de Fresha)
Separar negocio, sucursal, usuario, empleado, rol, cliente, servicio, asignación servicio-empleado, recurso, turno, bloqueo, cita, líneas de cita, venta, líneas de venta, pago, producto, movimiento de stock y comisión. Precio/duración históricos en líneas; importes monetarios exactos; tenant en relaciones; reglas de disponibilidad transaccionales. Distinguir valor reservado, vendido y cobrado. Reportes deben declarar su frescura y fórmulas.

## Pendientes prioritarios
Marketing y automatizaciones; segmentación y fidelidad; agenda recurrente y de grupo; reprogramación/cancelación; recursos y concurrencia; proveedores/pedidos/inventarios; devoluciones/comprobantes; dashboard; integraciones; onboarding y móvil; pruebas de permisos. Elaborar nueve entregables solicitados con estados verificadas/inferidas/pendientes y nuevas capturas sin datos personales.

## Desarrollo posterior autorizado
MAMBO JAMBO original, educativo y funcional: Next.js/React/TypeScript, Supabase/PostgreSQL, roles y RLS por negocio, persistencia, POS y marketing simulados, Playwright y GitHub. No afirmar implementación completa sin pruebas. No modificar CALLEJERO OPS ni Denbou. Primero conservar investigación durante prueba.
