# Handoff a Codex: función de cierre de caja

## Fuente primaria

`01_CIERRE_COMPLETADO_V07/VIDEO_ORIGINAL.mp4`; fotogramas identificados en `KEYFRAMES/`. Inspeccionar en primer lugar los segundos 38–65. V06 y V05 están incluidos como respaldo anidado para los flujos precedentes.

## Historias de usuario comprobables

- Un operador puede consultar caja abierta y el saldo previsto; acceder a formulario de cierre.
- Puede contar efectivo mediante un campo de entrada separado del esperado.
- El sistema presenta diferencia: `contado - previsto`. Caso observado: `1000 - 2150 = -1150`.
- El sistema bloquea un campo de reserva para próxima apertura cuando su importe excede el contado (mensaje exacto documentado en V07).
- Tras corregirlo, se puede cerrar, la UI cambia a `Cerrada`, y presenta historial, actividad y acciones permitidas.

## Modelo de datos original sugerido (hipótesis de diseño, no esquema extraído de Fresha)

- `cash_register`: id, nombre, ubicacion, config.
- `cash_session`: id, register_id, estado(open/closed), opened_at, closed_at, opened_by, closed_by, opening_cash, expected_cash, counted_cash, discrepancy, carry_forward, bank_transfer, notes.
- `cash_movement`: id, session_id, tipo(opening/deposit/withdrawal/payment/refund/closing/reopening), amount, reason, user_id, timestamp.
- `cash_count`: id, session_id, payment_method, expected, counted, difference.
- `audit_event`: actor, action, entity, timestamp, before/after (sin secretos).

## Pruebas propuestas (NO verificadas salvo caso indicado)

- TC-01: 2000 + 200 - 50 = 2150 (observado V05).
- TC-02: contado 1000 vs previsto 2150 -> diferencia -1150 (observado V07).
- TC-03: reserva 2000 > contado 1000 -> error exacto (observado V07).
- TC-04: corregir reserva y cerrar -> cambia a Cerrada (observado V07).
- TC-05: intentar movimiento en sesión cerrada -> pendiente.
- TC-06: reabrir y auditar transición -> pendiente.
- TC-07: exportar PDF, XLS, CSV -> pendientes.
- TC-08: cerrar con importe reservado + monto al banco por encima del contado -> pendiente de estudio; no asumir regla desde este video.
- TC-09: dos cierres simultáneos / doble click / concurrencia -> pendiente.
- TC-10: permisos de cierre y reapertura -> pendiente.
- TC-11: siguiente apertura con remanente -> pendiente.

## Reglas de procedencia

Todo el material capturado es interfaz de una sesión autorizada. No contiene código fuente de Fresha ni tráfico API. Construir arquitectura propia; no confundir inferencias con información interna real.
