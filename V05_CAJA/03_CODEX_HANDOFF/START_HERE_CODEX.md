# Entrega a Codex: Caja y movimientos de efectivo (V05)

**Primero leer** `../01_CAJA_OPERACIONES_V05/HALLAZGOS_CAJA.md` y el CSV; luego consultar las capturas y el video original. El ZIP V04 contiene las investigaciones históricas.

## Alcance
Construir, si el usuario lo solicita, una **implementación propia** de flujo de Caja basada en el comportamiento observado, no una copia del código ni de la identidad visual de Fresha.

## Reglas funcionales demostradas por esta muestra
- Existe una caja en estado «Abierta» con saldo mostrado.
- Una entrada de efectivo por 200 MXN sobre 2000 MXN produce 2200 MXN y se registra en Actividad.
- Una salida de efectivo por 50 MXN sobre 2200 MXN produce 2150 MXN y se registra en Actividad.
- El evento de apertura, el importe inicial y los dos movimientos aparecen como registros diferenciados.
- Se puede ejecutar cada uno de estos movimientos con comentario vacío en la versión probada.

## Arquitectura PROPUESTA (no confirmada en Fresha)
- `cash_registers`: id, business_id, name, settings.
- `cash_sessions`: id, register_id, opened_by, opened_at, closed_by?, closed_at?, starting_cash, status.
- `cash_movements`: id, session_id, movement_type (opening/initial_cash/in/out/payment/refund/adjustment), reason_code, amount_signed, currency, comment?, created_by, created_at, attachment_refs?, idempotency_key.
- Lectura de saldo mediante suma de movimientos de efectivo, evitando mezclar operaciones no monetarias con efectivo físico.
- Registrar movimientos mediante transacciones atómicas; validar moneda, importe, permisos y estado de sesión; evitar duplicados por idempotencia; mantener auditoría inmutable o anulaciones compensatorias.
- No suponer comportamiento de impuestos, reembolsos, diferencias de arqueo ni varias monedas sin nuevas pruebas.

## Pruebas mínimas para nuestra implementación
1. Crear/abrir caja de prueba con 2000. Saldo esperado: 2000.
2. Entrada +200 con razón de transferencia. Saldo: 2200. Evento visible.
3. Salida -50 con razón de gastos menores. Saldo: 2150. Evento visible.
4. Comprobar cronología: apertura, inicial, entrada, salida; importes y usuarios; totales coherentes.
5. Validar que el saldo sea igual entre listado, resumen e historial.
6. Añadir pruebas de permisos, concurrencia y reintento seguro; estos casos son requisitos de calidad propios, no reglas observadas de Fresha.

## Nunca presentar como verificado
- Algoritmos internos de saldo, base de datos real, APIs, source, control de permisos, límites monetarios, cierres/arqueos, validación de saldo negativo, conciliación y otros flujos sin evidencia.

## Privacidad
El video original contiene datos operativos y nombre de cuenta. No distribuir públicamente sin anonimizar.
