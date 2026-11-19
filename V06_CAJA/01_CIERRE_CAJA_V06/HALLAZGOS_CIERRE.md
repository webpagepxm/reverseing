# Caja registradora — configuración y preparación de cierre (grabación V06)

## Identificación
- Fuente primaria: `VIDEO_ORIGINAL.mp4` (64.77 s; captura vertical 512 × 1108 píxeles), con capturas en `KEYFRAMES/`.
- Módulo: Ventas → Cajas registradoras (interfaz móvil).
- Evidencia observada directamente en pantalla; la existencia o implementación de API/backend es desconocida.

## Navegación y configuración observables
- 00–06 s: caja `Caja de` identificada como abierta, saldo `2150 MXN`; menú `Acciones` con `Entrada de efectivo` y `Salida de efectivo`; filtro temporal incluye Hoy, Esta semana, Este mes, Último mes, Este año y Ver todo.
- 06 s: menú de más opciones con `Informe de las cajas registradoras` y `Ajustes de las cajas registradoras`.
- 08–14 s: pantalla de gestión de cajas con filtro `Activo`, búsqueda, botón `+ Añadir` y opción `Editar caja registradora`.
- 14 s: campo de nombre con contador `7/32`, opciones avanzadas visibles:
  1. `Exigir que la caja registradora esté abierta para empezar a realizar ventas` (marcada en la captura).
  2. `Fijar un importe mínimo de efectivo` (desmarcada).
  3. `Permitir la contabilización de efectivo a lo largo del día` (desmarcada).
  4. `Avisar si una caja registra sigue abierta` (se ve el comienzo, sin detalles suficientes para documentar valor o reglas).
- No se observa una modificación efectiva de estas opciones ni sus reglas activas.

## Detalle de caja y cierre
- 22–26 s: pantalla de caja abierta con saldo 2150 MXN; botón `Ver` y acciones de efectivo. En el detalle aparecen pestañas `Resumen` y `Actividad`, botón `Cerrar caja registradora` y menú de acciones.
- ~29–30 s: se abre el formulario `Cerrar caja registradora`. Se muestra identificación de caja y sede (Lola4ever).
- 30–46 s: el arqueo se organiza por métodos / agrupaciones, incluyendo `Datáfonos de Fresha` (Tap to Pay), `Canjes` (tarjetas regalo), `Depósitos`, `Crédito de Fresha`, `Online` (tarjeta), `Métodos personalizados` (otros), `Efectivo` y `Saldo total`.
- Cada grupo observado utiliza rótulos `Previsión`, `Contabilizado` y `Diferencia`; los grupos sin movimiento muestran cero. En efectivo y saldo total la `Previsión` es `2150 MXN`; `Contabilizado` aún no está completado y `Diferencia` aparece con guion, no con cero.
- 36–38 s: el bloque `Cierre de caja` tiene dos campos monetarios: `Importe de efectivo al cierre` y `Importe de efectivo que transferir al banco`. El primero explica que representa efectivo que quedará en la caja y se añadirá al importe inicial del próximo día en que se abra la caja; el segundo explica que es efectivo retirado hoy para depositarse en el banco. Se incluye `Añadir un comentario`.
- 52–64 s: se ingresa 55 MXN en `Importe de efectivo al cierre`, 85 MXN en `Importe de efectivo que transferir al banco`, y `Na` como comentario. El formulario sigue abierto al terminar la grabación.

## Verificado / no verificado

| Afirmación | Estado |
|---|---|
| Existe una pantalla de cierre con previsión por método de pago | OBSERVADO |
| Existen campos editables para importe que permanece y transferencia al banco | OBSERVADO |
| La UI describe el importe que queda como cantidad para apertura siguiente | TEXTO OBSERVADO; efecto real NO VERIFICADO |
| Es posible introducir 55 y 85 MXN sin validación inmediata visible | OBSERVADO SOLO DURANTE ESCRITURA |
| La caja se cierra al confirmar y se conserva en historial | NO VERIFICADO EN ESTE VIDEO |
| Se actualiza el saldo contable/bancario | NO VERIFICADO |
| Se calcula la diferencia exacta tras cerrar | NO VERIFICADO |
| Se puede realizar cierre con suma de importes distinta del saldo previsto | NO VERIFICADO |
| Se activa un cierre automático o se arrastra saldo automáticamente | NO VERIFICADO |

**No interpretar 55 + 85 = 140 MXN como conciliación con los 2150 MXN previstos**: los campos no necesariamente representan todo el dinero físico/contabilizado. No hay prueba de validación o de cierre con esas cantidades.

## Preguntas de prueba para próxima sesión
1. ¿Qué sucede al tocar el icono `+` junto a `Contabilizado` de efectivo? ¿Solicita conteo real, denominaciones u otro dato?
2. ¿Requiere Fresha contabilizar los 2150 MXN antes de confirmar?
3. ¿Muestra un modal de confirmación adicional o errores cuando se pulsa cerrar?
4. ¿En el detalle de una caja cerrada queda el historial completo y el saldo/diferencia?
5. ¿Qué importa y exporta `Informe de las cajas registradoras`?
6. ¿Cómo se transfieren fondos a la próxima apertura en caso de cierre confirmado?

## Recomendación para Codex (NO es una característica verificada de Fresha)

Diseñar por separado `register`, `register_session`, `cash_movement`, `closing_count`, `closing_allocation`, y `audit_event`. Requerir validación de saldos y autorizaciones, registrar cada transición en una transacción y crear pruebas de concurrencia e idempotencia. **Este diseño es una propuesta original y NO prueba cómo funciona la arquitectura interna de Fresha.**
