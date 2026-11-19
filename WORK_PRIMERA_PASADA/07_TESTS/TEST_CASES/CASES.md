# Pruebas ejecutadas y pendientes
| ID | Precondición / acción | Observado | Fuente |
|---|---|---|---|
| T01 | Alta cliente vacía | Error obligatorio | E01 histórico |
| T02 | Nombre y apellido ficticios sin contacto | Cliente creado | E01 histórico |
| T03 | Servicio90m25MXN, empleado automático, hora17 | Cita creada reservada | E01 histórico |
| T04 | Abrir checkout cita y descartar | Contexto conservado; borrador descartado | E01 histórico |
| T05 | Abrir resumen mes/centro posterior |1cita1servicio25MXN1nuevo | E01 histórico |
| T06 | Recordatorio3d→rendimiento→detalles |0envíos;activo;sin canales | E03/E04 actual |
| T07 | Campaña→empezar→cerrar | Alta tarifas; retorno sin activar | E05/E06 actual |
| T08 | Oferta→código→límites→cerrar | Campos revelados; retorno introducción | E08/E10 actual |
No tests de código Fresha. No se ejecutaron pagos, envíos, cambios permisos ni activaciones de pago.
## Plan futuro (NO ejecutado)
Solapamiento, edición/cancelación con notificaciones controladas, precio histórico, devolución parcial, cupón concurrente, descuento+impuesto+comisión, recepción stock, autorización roles, reserva pública, móvil, exportaciones y reconciliación de indicadores.
