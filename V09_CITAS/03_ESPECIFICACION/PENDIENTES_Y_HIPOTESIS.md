# Citas — pruebas pendientes y preguntas para Codex

## P0 flujos que requieren nuevas grabaciones
1. Abrir cita guardada; menú de acciones y editar fecha, hora, empleado, precio y servicio; observar el resultado.
2. Arrastrar cita a nueva franja horaria; confirmar si hay diálogo y estado nuevo.
3. Intentar superponer dos citas del mismo empleado; medir bloqueo, advertencia y/o sobreventa.
4. Cancelar y recuperar cita; comprobar si permanece en historial y cómo cambia su estado.
5. Crear cita con cliente existente y cliente nuevo; comprobar vinculación con CRM e historial.
6. Convertir cita en `Finalizar compra` y verificar venta/pago/caja con movimientos ficticios.

## P1
- Cita de grupo y múltiples servicios; reglas de duración.
- Repetición, cambio de una sola ocurrencia y edición de serie.
- `Horario no disponible`, asignación de recursos, horarios de trabajo y preferencias.
- Cambiar vistas Día/3 días/Mes/Línea de tiempo/Agenda/Columna y su conducta funcional.
- `Ver horarios disponibles` del paso inicial; prueba de disponibilidad.
- Búsqueda de servicio y cambio de empleado para servicio.
- Validaciones de campos obligatorios y horarios pasados/futuros.

## Propuestas de diseño para posterior análisis (NO son hechos de Fresha)
- Entidades propias: Business, Location, Employee, AvailabilityRule, Service, Customer, Appointment, AppointmentService, AppointmentEvent.
- Máquina de estados candidata: draft -> booked -> confirmed -> completed / cancelled / no-show (pendiente de verificar correspondencia con la app).
- Acciones: create, reschedule, reassign, cancel, checkout, audit history. Proteger concurrencia con transacciones y restricciones.
