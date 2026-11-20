# Alcance de implementación de MAMBO JAMBO

**DECISION_PROPIA.** El primer producto vertical es la operación de salones y barberías. La primera entrega propone autenticación, negocio y sucursales, clientes, servicios, equipo, turnos y Agenda. Reserva significa alta interna desde Agenda con cliente opcional. El canal público de reservas requiere alcance y verificación propios.

## Núcleo y extensión vertical

| Límite | Responsabilidad y contrato |
|---|---|
| Núcleo de plataforma | Identidad, negocio, sede, zona horaria, moneda, membresías, permisos por acción y ámbito, auditoría y navegación. Cada módulo declara rutas, permisos y disponibilidad por vertical y fase. La habilitación de navegación y la autorización del servidor consultan el mismo alcance. |
| Operaciones compartidas | Clientes y contactos, directorio de empleados, servicios, asignaciones, turnos y citas. Reserva referencia empleado, servicio y sede, guarda duración/precio históricos y admite cliente nulo. Las reglas de disponibilidad se aplican en la operación de dominio. |
| Vertical Salones y Barberías | Composición de Agenda, Clientes, Catálogo y Equipo, formatos de servicio y flujos descritos en este blueprint. Una nueva vertical puede configurar su navegación y módulos con contratos propios y reutilizar identidad, ámbito y componentes. |
| Capacidades posteriores | Ventas y Caja consumen citas y catálogos. Inventario y remuneración consumen líneas y movimientos confirmados. Informes y segmentos derivan datos con definición, corte y permisos. Habilitar cada capacidad solamente después de verificar sus invariantes. |

El monolito modular, PostgreSQL, Next.js, TypeScript y Supabase Auth siguen como punto de partida pendiente de D06. Separar dominios y autorización desde la primera migración permite incorporar módulos dentro de un despliegue inicial. [Arquitectura previa](../CODEX_REVERSE_ENGINEERING_BLUEPRINT/04_ARCHITECTURE.md)

## Secuencia de construcción y salida

| Etapa | Construir | Condición de salida |
|---|---|---|
| 1A · Fundaciones | Acceso y selección de ámbito, shell, configuración de sede y roles iniciales, auditoría y rutas protegidas. | Dos negocios, dos sedes y usuarios distintos confirman aislamiento tanto en UI como en operaciones directas. Revocación y enlace directo se comportan según la arquitectura. |
| 1B · Datos para reservar | Clientes activos/archivados, catálogo por categoría, empleados, elegibilidad por sede, turno semanal. | T03–T04 y configuración de turno completadas. Una ficha archivada conserva historial y queda fuera de nuevas reservas. Fixture ofrece al menos una sede, un empleado elegible y un servicio reservable. |
| 1C · Agenda operativa | Día/Semana/Lista, alta y detalle contextual, reprogramación, cancelación, finalización e inasistencia según reglas aprobadas. | T01–T02, T11 y T15 aplicables. Probar cita con y sin cliente, historial, dos guardados concurrentes, rol restringido, móvil y retorno preservado. |
| 2 · Dinero | Ventas y caja, venta directa o ligada a cita, propina, efectivo, folio operativo, sesión, movimientos y cierre, resumen básico. | T05–T08, T11, T13 de caja y T15. Probar conciliación por IDs y sesión, cierre concurrente, reintento seguro y recuperación antes de dinero real. |
| 3 · Catálogo físico e inventario | Productos, proveedores, existencias, pedidos, recepción, recuento y venta física. | T09–T10 y repetir T08/T11 con existencias. Recibo y ledger de stock conciliados para venta y devolución. |
| 4 · Remuneración y análisis | Comisiones, ajustes, liquidación manual, Segmentos e Informes. | T12–T13 con datos sintéticos, ajuste posterior y comparación de cifras con libros. |
| 5 · Solo alcance futuro | Pagos electrónicos/mixtos, reservas públicas, grupos y recurrencia, fichajes, fidelidad, conectores, Inicio y productos complementarios. | Definir módulo y operación piloto antes de publicar enlaces. T14 para nuevos medios y T16 antes de operación real. |

Los IDs corresponden a la [estrategia previa](../CODEX_REVERSE_ENGINEERING_BLUEPRINT/05_TEST_STRATEGY.md). Las pruebas quedan como criterios de futuras implementaciones.

## Cambios respecto al blueprint anterior

- Mantener Servicios bajo Catálogo, Caja bajo Ventas y Segmentos bajo Clientes. El riel con iconos y nombres visibles sustituye el menú global solo textual propuesto anteriormente. Mantener selección de sede y módulo al abrir un detalle. La diferencia conserva mejor los agrupamientos observados. [Auditoría anterior](../CODEX_REVERSE_ENGINEERING_BLUEPRINT/03_UX_UI_AUDIT.md) · [Catálogo](../FOTOGRAMAS/INVENTARIO/085s.jpg)
- Usar adaptación responsive propia con lista diaria y ficha de pantalla completa para Agenda. Caja es la referencia directa de móvil. Los módulos futuros se integran con rutas y permisos predefinidos en el mapa documental. [Caja móvil](../V04_CAJA/M10_menu_movimientos.jpg)
- El archivo `MAMBO_JAMBO_PRODUCT_DECISIONS.md` no aparece en el checkout de referencia ni en los archivos locales de la sesión. Las decisiones de una conversación anterior quedan pendientes de reconciliación cuando esté disponible ese documento.

## Decisiones pendientes de aprobación

| ID | Aprueba antes de | Propuesta y efecto |
|---|---|---|
| D01 · Mercado | Etapa 1A | Confirmar salones y barberías, país, moneda, zona por sede, región legal y retención. Afecta fechas operativas y formato. |
| D02 · Autoridad y navegación | Etapa 1A | Aprobar permisos por acción y sede, invitaciones y revocaciones, selección de destino inicial y tratamiento visual propio del riel. Afecta quién ve y ejecuta cada flujo. |
| D03 · Agenda | Etapas 1B–1C | Cliente opcional, un empleado y un servicio por cita, turno estricto, sin solapes. Confirmar cambios, inasistencia, excepciones y preservación del precio. |
| D04 · CRM | Etapa 1B | Nombre obligatorio, apellidos/contacto opcionales, coincidencias sin fusión automática, archivo e historial. Definir consentimiento y borrado. |
| D06 · Plataforma | Etapa 1A | Aprobar infraestructura, autenticación, región de datos, presupuesto, retención y recuperación. Define alta de negocio e invitación. |
| D05 · Efectivo | Etapa 2 | Confirmar caja activa obligatoria, propina, cambio, impuestos, folios, devoluciones y corrección de cierres. |
| D07 · Stock | Etapa 3 | Confirmar unidades, bloqueo de negativos, recepción, merma y reposición. |
| D08 · Remuneración | Etapa 4 | Aprobar base, vigencia, ajustes, redondeo y autoridad para pagar. |
| D09 · Métricas y segmentación | Etapa 4 | Definir corte, frescura, pertenencia, exportación y privacidad. |
| D10 · Ampliaciones | Etapa 5 | Elegir proveedor de pagos, canal público e integraciones según necesidad y coste. |

## Verificaciones de referencia pendientes

- Inicio y Configuración global, autenticación y roles efectivos. Capturar entradas y caminos completos con cuentas autorizadas y permisos distintos.
- Altas y cambios completos de clientes y servicios, guardado de segmentos personalizados y pertenencia. Usar fixtures conocidas y reabrir los registros.
- Reprogramación, cancelación, inasistencia, recurrencia, multiempleado y solapes. Registrar estado anterior, cambio y disponibilidad posterior.
- Cita a pago y trazabilidad a caja e informe, pagos mixtos, reapertura y exportación. Registrar folios e IDs de sesión en un caso autorizado.
- Recepción, publicación de recuento y efecto de venta/devolución en stock. Comisión desde venta real, ajuste y trazabilidad de pago. Capturar saldos antes y después.
- Móvil de Agenda, Clientes, Inventario y Equipo, además de teclado y foco. Capturar dimensiones y recorrido en caso de prueba.

La [lista previa de preguntas](../CODEX_REVERSE_ENGINEERING_BLUEPRINT/07_OPEN_QUESTIONS.md) conserva el detalle de evidencia pendiente y su prioridad.
