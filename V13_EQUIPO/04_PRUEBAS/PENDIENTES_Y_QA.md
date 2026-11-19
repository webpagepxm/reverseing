# Pendientes prioritarios para nuevas grabaciones y pruebas

## Prioridad alta
1. **Roles/permisos**: abrir `Otorgar acceso`, ver roles y matrices, probar con una cuenta de prueba (no conceder acceso a terceros reales).
2. **Comisión por niveles**: abrir asistente, documentar escalones, umbrales, vigencia y categorías. Verificar una venta ficticia y el informe correspondiente.
3. **Comisión fija aplicada**: generar operación ficticia de una membresía y observar el devengo, el cálculo y el registro asociado. No asumir que el 20 % queda devengado por el solo hecho de guardar la regla.
4. **Nómina, liquidaciones**: verificar el historial de `Liquidaciones`, modificaciones/correcciones, filtros y exportaciones. No ejecutar transferencias reales.
5. **Turnos**: cambiar día/horario de manera aislada, añadir descanso y probar conflicto con reserva.

## Prioridad media
6. Fichajes digitales: activar para un empleado ficticio, simular entrada y salida y observar duración y reglas.
7. Proceso de pago: diferencias entre método manual y bancario, pero sin ejecutar cargos reales.
8. Recalcular comisión tras cambio retroactivo o devolución: no verificado.
9. Confirmar auditoría y revertibilidad de aprobación y liquidación.
10. Exportación detallada de nómina y comisiones.

## Casos de prueba recomendados para implementación propia
- Comisión 20 % sobre 100 MXN elegible ⇒ 20 MXN, **como prueba de nuestra regla propuesta**, no como comportamiento validado del backend Fresha.
- Dos reglas superpuestas: definir prioridad y prueba.
- Nómina ya completada: intentar ejecutar otra vez sin duplicar salida.
- Usuario `Sin acceso`: garantizar denegación por backend.
- Turno semanal con pausa y excepción por cierre del negocio.
- Pago manual: actualizar `pagado` y `pendiente`, registrar quién marcó el pago, mostrarlo inequívocamente como manual.
