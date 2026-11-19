# Modelo original propuesto — INFERIDO
No describe tablas reales de Fresha.
| Entidad | Campos propuestos | Relaciones |
|---|---|---|
| Business / Location | id,tenant_id,moneda,zona,estado | negocio contiene sucursales |
| User / Staff / Role | id,tenant_id,activo,role_id | usuario puede asociarse a empleado; permisos separados |
| Client | id,tenant_id,nombre,contacto opcional,idioma | citas, ventas, segmentos, consentimiento |
| Service | id,tenant_id,nombre,duration,price_minor | categorías; staff/resources mediante puentes |
| Shift / Block | staff/location,start,end,timezone | capacidad disponible |
| Appointment | id,tenant_id,client_id opcional,location_id,status | líneas de servicio |
| AppointmentLine | service_id,staff_id,start,end,price_snapshot | servicio y asignación histórica |
| Sale / SaleLine | client_id,appointment_id opcional,status,total_minor | artículos servicio/producto/bono; descuentos/impuestos |
| Payment / Refund | sale_id,amount_minor,status,simulation,idempotency_key | varios pagos y devoluciones por venta |
| Product / StockMovement | sku,location_id,qty_delta,reason,reference | proveedor, pedido y recepción |
| CommissionPolicy / Accrual | employee,basis,rate,amount,status | línea venta, pago, reversión |
| Offer / Redemption | type,code,scope,limits,validity | cliente, venta, artículos y canal |
| Automation / Delivery | trigger,offset,channels,recipient,status | cita/cliente; eventos y entregas separados |
| ReportSnapshot | scope,period,computed_at | definiciones métricas |
Recomendaciones: moneda exacta, historial de precios y políticas, claves compuestas tenant, fechas UTC+zona negocio, auditoría de cambios. Contactos/consentimientos separados de permisos internos.
