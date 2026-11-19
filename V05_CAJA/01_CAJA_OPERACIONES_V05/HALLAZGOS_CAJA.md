# CAJA — Operaciones de efectivo observadas en Fresha móvil

Fuente: `VIDEO_ORIGINAL.mp4`; duración 81.333 s; tamaño 512×1108; evidencia recopilada mediante una sesión de usuario autorizado.

## UI y navegación
- Ventas > Cajas registradoras: tarjeta de una caja **Abierta** con saldo de 2,000 MXN al inicio, botones «Ver» y «Acciones».
- «Acciones» abre un menú inferior con «Entrada de efectivo» y «Salida de efectivo» (38 s).
- Flujo de entrada en dos etapas: selección de motivo > formulario > Confirmar. Barra superior de progreso de dos tramos; botón de volver y cerrar.
- Flujo de salida también de dos etapas: selección de motivo > formulario > Confirmar.

## Motivos de entrada (10–28 s)
1. «Devolución de compras efectuadas con efectivo para gastos menores».
2. «Transferencia desde el banco o la caja fuerte» (motivo seleccionado y probado).
3. «Otros ajustes».

## Motivos de salida (40–49 s)
1. «Efectivo para gastos menores para efectuar compras» (motivo seleccionado y probado).
2. «Pagar propinas al miembro del equipo».
3. «Depósito en banco o caja fuerte».
4. «Otros ajustes».

La mera visibilidad de los otros motivos **no demuestra** su lógica particular.

## Formulario de entrada (28–33 s)
- Título dinámico: «Transferencia desde el banco o la caja fuerte».
- Ayuda: «Introduce el importe que vas a añadir y un comentario que te sirva de referencia más adelante».
- «Cantidad» con moneda MXN y teclado numérico.
- «Comentario», contador `0/100`, caja de texto.
- Botón «Añadir archivo adjunto».
- Se identifica el usuario/fecha al pie.
- Botón negro «Confirmar».
- El usuario escribió inicialmente 2000 y lo modificó a **200** antes de confirmar; el saldo final lo corrobora.
- Se confirmó con comentario vacío y sin archivo adjunto. La app mostró toast **«Efectivo añadido»**.

## Formulario de salida (50–53 s)
- Título dinámico: «Retirada de efectivo para gastos menores».
- «Cantidad» con moneda MXN y teclado numérico.
- «Comentario» con contador `0/100`.
- Botón «Confirmar».
- Se introdujeron **50 MXN**, se dejó comentario vacío y se confirmó.
- La app mostró toast **«Efectivo retirado»**.
- No se observó opción de adjuntar archivo en el fragmento visible del formulario de salida; esto NO demuestra que no exista.

## Saldo y registro: la parte mejor verificada
**Estado antes**: 2000 MXN (04 s).

**Entrada +200**: 2000 + 200 = 2200 MXN (34–36 s).

**Salida −50**: 2200 − 50 = 2150 MXN (54–56 s).

**Actividad (66 s), orden visible descendente:**
- «Salida de efectivo», **−50 MXN**, usuario y motivo «Efectivo para gastos menores para efectuar compras».
- «Entrada de efectivo», **+200 MXN**, usuario y motivo «Transferencia desde el banco o la caja fuerte».
- «Importe de efectivo inicial», **+2000 MXN**.
- «Caja registradora abierta», **0 MXN**.

**Resumen (68 s):** pagos mediante datáfonos, online, canjes, métodos personalizados a 0 MXN; efectivo 2150 MXN; importe inicial 2000 MXN; pagos en efectivo 0 MXN; entrada 200 MXN; salida -50 MXN (visible en desglose inferior).

**Inferencia razonable (NO hecho interno verificado):** modelo de ledger inmutable por movimiento y saldo calculado a partir del importe inicial y de los cambios netos.

## Otros controles visibles
- Filtro de periodo en listado: Hoy, Esta semana, Este mes, Últimos mes, Este año, Ver todo (58 s, redacción según vista).
- En detalle: «Resumen», «Actividad», «Cerrar caja registradora», menú adicional, «Entrada de efectivo» y «Salida de efectivo» (62–70 s).
- Atajo desde menú (72 s): «Nueva venta», «Entrada de efectivo», «Salida de efectivo».
- NO se pulsó «Cerrar caja registradora» en esta grabación.

## Pruebas todavía necesarias
- Confirmar cierre y arqueo; diferencia de efectivo esperado/contado y permisos.
- Validar valores 0, negativos, decimales y cantidades superiores al disponible; observar errores y restricciones.
- Movimiento con comentario y adjunto; actividad detallada al abrir cada movimiento; editar/anular movimientos.
- Pagos reales de venta, reembolsos, propinas y su efecto en efectivo y total previsto.
- Caja cerrada, filtros históricos, exportación, varias cajas y varias ubicaciones.

## Precisión metodológica
- No se inspeccionó el backend, código fuente ni tráfico de APIs.
- La interfaz y saldos evidencian el comportamiento observado, no sus algoritmos internos exactos.
- Ninguna funcionalidad listada pero no ejecutada debe considerarse «probada».
