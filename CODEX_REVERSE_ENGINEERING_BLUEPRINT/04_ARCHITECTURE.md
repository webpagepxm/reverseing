# Arquitectura del SaaS

**DECISION_PROPIA.** Monolito modular con **Next.js App Router**, **TypeScript estricto**, **PostgreSQL** y **Supabase Auth** como punto de partida. Next.js reúne UI y API propia en un despliegue. TypeScript mantiene contratos de dominio y UI con esquemas que también se validan en ejecución. PostgreSQL aporta transacciones, restricciones y consistencia de libros. Supabase administrado facilita identidad, PostgreSQL y backups según plan. Costo, ubicación de datos, retención y PITR se deciden antes de producción.

~~~mermaid
flowchart LR
    UI[Next.js] --> API[API propia y servicios de dominio]
    Auth[Supabase Auth] --> API
    API --> PG[(PostgreSQL)]
    PG --> Outbox[Outbox transaccional]
    Outbox --> Jobs[Worker de exportaciones y conectores]
    PG --> R[Agregados de informes]
~~~

## Modelo y límites de módulos

| Dominio | Entidades y relaciones |
|---|---|
| Identidad y centros | `tenant`, `location(time_zone,currency)`, `membership(auth_user_id,tenant_id,status)`, `role_grant(action,location_id)`. `employee` puede existir sin cuenta. |
| CRM y segmentos | `customer`, `customer_contact`, `consent_event`, `segment_rule(version,definition)`. Contactos y consentimiento con acceso explícito. |
| Servicios y equipo | `service`, `service_category`, `employee_service`, `shift_rule(weekday,local_start,local_end,effective_range)`, `shift_exception`. Asignación de servicio por sede. |
| Agenda | `appointment(customer_id nullable,status,version)`, `appointment_line(employee_id,service_id,start_at,end_at,price_snapshot,duration_snapshot)` y `employee_reservation(occupied_range)`. |
| POS y pagos | `sale(appointment_id nullable,customer_id nullable,status,version,totals)`, `sale_line(type,reference,snapshots,employee_id,tax,net)`, `payment(method,status,amount,external_ref)`, `refund(payment_id,amount)`, `refund_line`. Propinas y cambio separados. |
| Caja | `register(location_id)`, `cash_session(status,opened_at,closed_at,opening_amount,expected,counted,variance,retained,bank_transfer)`, `cash_movement(type,signed_amount,source_id,actor_id)`. La sesión cerrada guarda el arqueo. |
| Inventario | `product(sku,tracked)`, `supplier`, `product_supplier`, `stock_balance(location_id,product_id,quantity,version)`, `stock_movement(source,quantity_delta)`, `purchase_order` y líneas, `receipt`, `stock_count` y líneas. |
| Remuneración | `commission_rule(version,effective_range,employee_id,family,rate_bps)`, `earning_entry(source_line_id,rule_version,amount,kind)`, `payout` y `payout_item`. Propina y comisión por separado. |
| Trazabilidad | `audit_event(actor,action,entity,version,request_id,occurred_at,delta)`, `command_receipt(scope,key,payload_hash,resource_id)`, `outbox_event(event_id,event_type,payload)`, `report_job`. |

Cada tabla de negocio incluye `tenant_id` y las referencias entre filas usan llaves compuestas por negocio e ID. Validar pertenencia a centro cuando aplique. Usar IDs opacos y unicidad por alcance, importes en unidades monetarias menores enteras, moneda explícita, porcentajes en puntos base y cantidades de stock con escala definida. Serializar importes como cadenas decimales enteras en el contrato. Guardar instantes en UTC y zona IANA del centro para franjas, turnos, cierres y períodos.

~~~mermaid
flowchart LR
    C[Cliente opcional] --> A[Cita y líneas de servicio]
    E[Empleado y turno] --> A
    A --> V[Venta y líneas históricas]
    V --> P[Pago y reembolso]
    P --> CJ[Movimiento de caja]
    V --> CM[Devengo y liquidación]
    PR[Proveedor y producto] --> IN[Recepción y existencias]
    V --> IN
    P --> R[Informes]
    CJ --> R
    IN --> R
    CM --> R
~~~

## API de dominio

Rutas propias bajo `/api/v1`. Derivar actor y ámbito de sesión y membresía. Los listados usan cursor estable y filtros explícitos. Comandos económicos y creaciones sensibles usan `Idempotency-Key`. Cambios sobre un agregado editable exigen su `version`. Responder ID, estado, versión y efectos confirmados cuando aplique.

| Comando | Entrada y resultado |
|---|---|
| `POST /appointments`, `POST /appointments/{id}/reschedule`, `POST /appointments/{id}/transitions` | Centro, cliente opcional, líneas de servicio/empleado, hora y versión si existe. Devuelve reserva con duración y precio calculados. |
| `POST /customers`, `PATCH /customers/{id}`, `POST /services`, `PATCH /services/{id}` | Ficha o servicio con datos requeridos, límites, estado e historial. |
| `PUT /employees/{id}/schedule`, `PUT /memberships/{id}/grants` | Vigencia y sede, o permisos por acción y sede. Devuelve versión o conflictos de turno. |
| `POST /registers/{id}/sessions`, `POST /cash-sessions/{id}/movements`, `POST /cash-sessions/{id}/close` | Apertura, importe y motivo, o conteo/desglose/versión. Devuelve saldo y referencias a movimientos o cierre. |
| `POST /sales`, `POST /sales/{id}/checkout`, `POST /sales/{id}/refunds` | Crear borrador directo o desde cita, cobrar con medio y monto recibido, o reembolsar líneas e importes validados. Devuelve saldo, folio y referencias. |
| `POST /products`, `POST /suppliers`, `POST /purchase-orders`, `POST /purchase-orders/{id}/receipts`, `POST /stock-counts/{id}/post` | Crear catálogos y pedidos, recibir por línea y centro, o registrar recuento validado. |
| `POST /commission-rules`, `POST /payouts/{id}/approve`, `POST /payouts/{id}/record-payment` | Regla con vigencia. Aprobar ítems y registrar pago externo con referencia y permiso reforzado. |
| `GET /reports/{type}`, `POST /report-exports`, `PUT /segments/{id}`, `POST /segments/{id}/preview` | Filtros por centro/período, versión de fórmula y fecha de corte. Devuelve consulta paginada, exportación, regla o recuento de destinatarios. |

Usar códigos estables `FIELD_INVALID` (422), `SLOT_CONFLICT`, `VERSION_CONFLICT`, `SESSION_CLOSED`, `STOCK_INSUFFICIENT` e `IDEMPOTENCY_MISMATCH` (409). Autenticación faltante 401, acción fuera del rol 403 y recurso fuera del ámbito 404. Los errores validables devuelven campos afectados, ID de solicitud y permiten conservar formulario.

## Consistencia y transacciones

- **Agenda.** Usar exclusión PostgreSQL GiST por negocio, empleado e intervalo activo semicerrado `[inicio,fin)`, con `btree_gist` para claves escalares. La restricción se aplica incluso entre centros. Validar turno y asignación. Reprogramar en una transacción y liberar reservas al cancelar. Comandos de cita y de turno toman el mismo bloqueo de empleado y revalidan disponibilidad. Para varios empleados, bloquear en orden de ID. Extender a recursos físicos cuando se defina capacidad.
- **Cobro efectivo.** Bloquear cita si existe, venta, sesión de caja y balances de producto ordenados por ID. Validar versión y totales calculados en servidor. Guardar pago, movimiento por efectivo aplicado, venta pagada, movimientos de existencias, devengos elegibles, auditoría y outbox en una transacción conforme a los módulos habilitados. Unicidad de venta vigente por cita. La acción de Agenda controla si la cita se completó. El efectivo recibido y el cambio quedan en el pago. Cada pago produce como máximo un movimiento original de caja.
- **Caja.** Apertura y cierre se serializan por registro, con índice único parcial de sesión abierta. Toda mutación del libro bloquea la sesión antes de verificarla. Saldo esperado = inicial + movimientos firmados hasta el corte; variación = contado − esperado. Validar retenido + retiro = contado. Un cierre compitiendo con el cobro incluye el cobro comprometido o lo rechaza sin efectos parciales. La sesión siguiente sugiere el efectivo retenido.
- **Stock.** Libro inmutable y saldo proyectado en la misma transacción. Validar disponibilidad y unidad. Deduplicar por fuente y línea. Recepciones parciales respetan remanente. El recuento compara versión de balance y devuelve conflicto si hubo movimientos concurrentes. Reembolso repone solo líneas físicas con devolución confirmada.
- **Comisiones.** Base propuesta de neto descontado antes de impuestos, sin propina, con regla efectiva al cobro. Una regla efectiva por ámbito y un devengo original por línea elegible. Reembolsos generan contrapartidas y conservan la versión original; limitar importe y cantidad acumulados a la venta. Liquidar entradas disponibles con unicidad por devengo. Registrar manualmente la referencia del pago externo.
- **Idempotencia.** Unicidad por negocio, actor y comando. Guardar huella de payload y resultado con la transacción. Repetir solicitud idéntica devuelve el recurso. Reutilizar clave con otra huella devuelve 409. Reintento acotado para conflictos transitorios. Pagos electrónicos posteriores usan estado pendiente, eventos firmados, deduplicación y conciliación con proveedor. Outbox y consumidores admiten entrega repetida y deduplican por ID.

## Autorización, auditoría y operación

Permisos mínimos por acción como `appointment.write`, `cash.close`, `refund.approve`, `payout.record` y `report.export`. Recepción usa Agenda y contactos operativos. Caja accede a ventas y sesión asignada. Supervisión aprueba ajustes y cierres. Administración concede accesos. El servidor verifica membresía vigente, sede y permiso. RLS para lecturas y escrituras expuestas con `USING` y `WITH CHECK`. Para escrituras coordinadas usar un ejecutor transaccional con privilegios mínimos y autorización verificada en la transacción. Reservar la credencial de servicio para procesos internos. Proteger formularios de sesión frente a solicitudes cruzadas y requerir factor reforzado para grants y liquidaciones.

Auditar cambios de dinero, stock, acceso, citas y reglas. Libro y auditoría de solo inserción para roles de aplicación. Excluir fotos, datos de tarjeta, tokens y campos de contacto completos de logs. Exportaciones privadas con expiración y autorización reevaluada al descargar. Informes derivados de libros y snapshots con período de sede, filtros, instante de corte y definiciones que separan valor reservado, venta neta, pago y saldo físico. Backups, restauración y CI en [Estrategia de pruebas](05_TEST_STRATEGY.md). Los contratos corresponden al SaaS propuesto.
