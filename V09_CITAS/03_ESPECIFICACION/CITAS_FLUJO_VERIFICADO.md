# Citas: análisis funcional del video (18-nov-2026)

## Entorno observable
- Aplicación Fresha, negocio de prueba `Cuts4ever`, calendario web.
- Video de 57.33 s; se ven menús y acciones, no código del navegador ni tráfico HTTP.

## Inventario de controles observables
- Cabecera: botón Hoy; navegación anterior/siguiente de fechas; período actual (día/semana); filtro de miembros de equipo; control de ajustes/filtros de calendario; selector de vista; botón Añadir.
- Selector de recursos/personas: `Miembros del equipo con citas`, `Todo el equipo`, entradas individuales; checkboxes para personal mostrado (Jethro Morales, Wendy Smith Demo).
- Vista: Día, 3 días, Semana, Mes, Línea de tiempo, Agenda, Columna, Imprimir. **VISIBLE**, no se verificó comportamiento de cada vista ni impresión.
- Menú Añadir: Cita, Cita de grupo, Horario no disponible, Venta, Pago rápido. **VISIBLE**, solo creación de cita individual está verificada.

## Flujo completo CONFIRMADO: cita sin cliente
1. En calendario se selecciona a Wendy Smith (Demo) como miembro del equipo y se cambia de la vista de día a semana.
2. Se abre `Añadir > Cita`: aparece un modo de `Selecciona una hora para reservar`, con barra superior morada y `Cerrar`/`Ver horarios disponibles`.
3. Se elige fecha/hora en la cuadrícula semanal: lunes 16 de noviembre de 2026, 12:15. La selección se representa como una banda temporal provisional.
4. Se abre panel lateral derecho `Seleccionar un servicio`, con búsqueda y categoría `Cabello y peinado`. Se ven `Corte de pelo` y `Secado de cabello`, ambos $25 MXN y 1 h 30 min en pantalla.
5. Se selecciona `Corte de pelo`. La cita preliminar aparece en calendario de 12:15 a 13:45, asociada a Wendy Smith (Demo). Panel indica `lun, 16 nov`, `12:15`, `No se repite`; servicio con lápiz y papelera; `Añadir servicio`; total $25 MXN.
6. No se agrega cliente: la columna `Añadir cliente` indica `O dejar vacío para clientes sin cita previa` y el bloque temporal muestra `Sin cita`.
7. Al final del panel se ven `Finalizar compra` y `Guardar`. Se pulsa `Guardar`.
8. Fresha cierra panel y muestra notificación `Cita creada`; la cita azul queda colocada en el calendario.

## Datos observados en cita
- Fecha: 2026-11-16 (lunes).
- Inicio: 12:15; final: 13:45 (90 minutos desde duración del servicio).
- Servicio: Corte de pelo; $25 MXN, 1 h 30 min.
- Empleado: Wendy Smith (Demo).
- Cliente: no seleccionado; se presenta como `Sin cita`.
- Recurrencia: visualmente `No se repite`; no se probó la recurrencia.
- Total: 25 MXN.
- Confirmación de persistencia visible: `Cita creada`, bloque remanente en calendario.

## UX documentada
- Selector de miembros con opción todo el equipo e individuales.
- Vista semanal muestra columnas de días y horas, zonas rayadas fuera del horario visual.
- Creación guiada: seleccionar hueco temporal primero, después servicio, luego opcionalmente cliente.
- Edición visual durante creación por tarjeta temporal y panel lateral; acciones editar/eliminar servicio visibles, no probadas.
- Mensaje de éxito después de guardar.

## Lo que no se puede afirmar
No hay verificación de validaciones de doble reserva, permisos, asignación automática a clientes, backend, pagos, recurrencia efectiva, reprogramaciones, cancelaciones, tiempos de buffer, persistencia luego de recargar ni interfaz móvil.
