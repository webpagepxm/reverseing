# Propuesta de arquitectura independiente para Codex — NO es la arquitectura interna de Fresha

Las siguientes entidades y reglas son **PROPUESTAS** construidas a partir del comportamiento visible. No son nombres de tablas, columnas ni endpoints extraídos de Fresha.

## Entidades sugeridas
- `staff_members`: identidad pública, estado, centro(s), puesto.
- `staff_access_grants`: usuario, rol, ámbito (centro/organización), fecha de concesión/revocación.
- `commission_rules`: empleado, modalidad (`fixed`, `tiered`), porcentaje/importe, fecha de inicio y fin, estado.
- `commission_rule_targets`: regla, familia de artículo, IDs opcionales específicos.
- `staff_pay_settings`: método preferido, cálculo automático/manual, deducciones y anticipos configurados.
- `recurring_shift_rules`: empleado, centro, día de semana, hora de inicio/fin y vigencia.
- `shift_instances` y `time_entries`: turnos concretos y fichajes, con zona horaria y auditoría.
- `payroll_periods`: intervalo y estado.
- `payroll_line_items`: componente salarial, comisión, propina, otros, deducción.
- `payroll_runs`: agregado por período, estado (`draft`, `review_required`, `approved`, `completed`) y responsable.
- `payroll_reviews`: centro, revisor, fecha, dictamen y comentario.
- `payroll_settlements`: método, importe, fecha, usuario que marcó el pago, referencia y evidencia.
- `audit_events`: acción, actor, entidad, cambios, fecha; sin incluir secretos de autenticación.

## Invariantes y validaciones propuestas
- Comprobar permisos en servidor y RLS cuando se utilice Supabase; nunca confiar solo en controles ocultos.
- Las reglas de comisión deben versionarse y capturar las condiciones vigentes al devengarse, con tratamiento explícito de devoluciones, descuentos y propinas.
- Prevenir doble pago con claves idempotentes y transacciones.
- Los pagos manuales marcan registros contables internos; **no** deben presentarse como transferencias realizadas.
- Los cambios de estado de nómina deben registrar actor y momento, exigir revisión y autenticación reforzada para operaciones sensibles.
- Las recurrencias de turnos deben manejar excepciones, horas locales, zona horaria, descansos y no solapamiento según reglas de negocio a determinar.
- Evitar asumir que una comisión configurada se aplicará sin más a ventas realizadas previamente.

## Flujos candidatos
`Staff → Commission Rule → Eligible Sales → Commission Accrual → Payroll Period → Review → Manual Settlement`

`Staff → Recurring Shift Rule → Shift Instances → Time Entries → Payroll Inputs`

## Contratos técnicos por diseñar
Codex debe definir APIs propias después de auditar este paquete: crear/editar comisión, listar reglas vigentes, persistir turnos, consultar período salarial, iniciar revisión, aprobar y registrar pago manual. Los contratos no se observaron en la grabación y requieren diseño independiente.
