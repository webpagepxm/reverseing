# Hallazgos de pantalla — Equipo / Team

Fecha de grabación: 18-11-2026. Marca temporal de cada hallazgo expresada como segundo **del video original**, no del video recortado.

## A. Navegación y ficha de miembro (0–35 s)
- **OBSERVADO**: menú Equipo con `Miembros del equipo`, `Turnos programados`, `Fichajes digitales`, `Procesos de pago`.
- **OBSERVADO**: directorio de dos perfiles y ficha lateral de una empleada de demostración. El panel muestra Resumen, Datos personales, Workspace y Pagar.
- **OBSERVADO**: panel informa que dicha empleada tiene nivel de permiso **«Sin acceso»** y ofrece `Otorgar acceso`. Esto no verifica cómo se concede un rol o qué restringe.
- **OBSERVADO**: editor del miembro con Perfil, Direcciones, Contactos de emergencia, Servicios, Centros, Ajustes, Salarios y fichajes digitales, Comisiones y Procesos de pago.
- **OBSERVADO**: apartado Salarios y fichajes digitales aparece desactivado en el perfil revisado.

## B. Alta y aplicación de comisión (35–100 s)
- **OBSERVADO**: asistente `Elige un tipo de comisión`: `Comisión de tasa fija` o `Comisión por niveles`.
- **OBSERVADO**: tipo fijo admite porcentaje de la cantidad de la venta y otras variantes accesibles mediante selector. Se introduce **20 %** como tarifa predeterminada.
- **OBSERVADO**: selección de familias a las que aplica la comisión: Servicios, Artículos adicionales, Productos, Bonos, Membresías, Tarjetas regalo y otras opciones visibles al desplazarse.
- **OBSERVADO**: vigencia `Comienza: Hoy` o `Selecciona una fecha`; fin `Nunca` o fecha seleccionada. La interfaz indica que una fecha pasada puede recalcular informes.
- **VERIFICADO**: al volver a la ficha, consta **«20 % de tarifa fija»**, **«Todas las membresías incluidas»**, **«Se aplica todos los días»** y vigencia desde el **18 nov 2026**. Por tanto, esa regla quedó aplicada a la empleada de demostración.
- **NO VERIFICADO**: qué ventas concretas disparan esa comisión, su liquidación real, aplicación por niveles, precedencia con otras reglas, comisiones negativas, devoluciones o descuentos.

## C. Configuración de procesos de pago por miembro (76–100 s)
- **OBSERVADO**: interruptor `Procesos de pago` activo; método preferido `Pagar manualmente` (marcar como pagado fuera de Fresha).
- **OBSERVADO**: cálculo de proceso de pago `Cálculo automático`: usa actividad registrada, salario, comisiones y propinas configuradas.
- **OBSERVADO**: campo para deducciones / adelantos en efectivo y opciones de procesamiento de pagos (no fueron evaluadas exhaustivamente).
- **NO VERIFICADO**: efecto real de deducciones ni transferencia bancaria.

## D. Turnos programados (100–143 s)
- **OBSERVADO**: calendario de turnos por equipo y semana. Menú para añadir turno, descanso u otras acciones visibles.
- **OBSERVADO**: editor `Establecer los turnos recurrentes` con centro, tipo de turno `Semanal`, inicio, fin, días activos, rangos horarios por día, acción para añadir un tramo adicional y eliminar tramos.
- **OBSERVADO**: se visualizan **7 días** seleccionados, de **10:00 a 20:00** (70 horas en total) como dato de la prueba, no horario recomendado.
- **VERIFICADO**: tras guardar, se presenta el mensaje **«Horario laboral establecido»**. El sistema distingue disponibilidad del equipo para reservas del horario habitual del negocio.
- **NO VERIFICADO**: conflictos con citas, cambios aislados, solapamientos o reglas con múltiples centros.

## E. Fichajes digitales (143–168 s)
- **OBSERVADO**: pantalla de presentación de fichajes digitales y sección de gestión con estado vacío (`No hay miembros del equipo`) más guía interactiva.
- **SOLO INTERFAZ**: botón `Añadir` y filtros; NO se registró entrada/salida real, turno fichado ni cálculo salarial a partir de fichajes.

## F. Procesos de pago / remuneraciones (168–238 s)
- **OBSERVADO**: sección `Procesos de pago` con pestañas `Períodos de pago` y `Liquidaciones`; selector de período.
- **OBSERVADO**: período **16–22 nov 2026** con `Ingresos` 6,25 MXN, `Otros` 0, `Total` 6,25, `Pagado` 0, `A pagar` 6,25, antes de ejecutar el flujo.
- **OBSERVADO**: asistente para seleccionar miembros; aparece una fila elegida por **6,25 MXN** de propinas, 0 de salarios, 0 de comisiones y 0 de otros conceptos.
- **OBSERVADO**: pantalla `Revisar el proceso de pago` con centro, importe por pagar, período, fecha y método **Pago manual** (marcar fuera de Fresha).
- **VERIFICADO**: intentar completar con estado `Necesita revisión` provoca mensaje para marcar centros como listos u omitidos. El flujo pasa posteriormente a un estado aprobado y permite avanzar.
- **OBSERVADO**: paso de autenticación de dos factores (se omite del video redactado para proteger datos de verificación).
- **VERIFICADO**: pantalla de éxito **«Se ha completado el proceso de pago»** y mensaje de autenticación correcta; al regresar al resumen del período, se muestra `Pagado 6,25 MXN` y `A pagar 0 MXN`.
- **ALCANCE**: se verificó **registro de pago manual en Fresha**, no un pago bancario real, transferencia ni liquidación externa.

## Reglas funcionales sustentadas
1. Las reglas de comisión pueden asignarse a un miembro, una familia de artículos y un intervalo de vigencia.
2. Un horario recurrente puede configurarse por día de la semana, centro y fechas de vigencia; el guardado produce confirmación visible.
3. Los procesos de pago agregan salarios, comisiones, propinas y otros importes, según la interfaz; en el ejemplo el importe procede de propinas.
4. Hay una revisión explícita previa a completar el proceso de pago, y un paso de autenticación adicional.
5. Un pago marcado manualmente cambia el período de `Pagado 0 / A pagar 6,25` a `Pagado 6,25 / A pagar 0`.

## Límites
No hay evidencia de tablas internas, implementación de API, métodos de cálculo precisos, matrices completas de roles, saldo de banco, ejecución de transferencia ni auditoría detallada de cambios.
