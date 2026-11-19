# Fresha — Expediente acumulativo V05 para Codex

**Nueva prueba documental:** grabación vertical de pantalla de 81.33 s, capturada en Fresha, aportada el 17 de noviembre de 2026 según su nombre de archivo.

Esta entrega conserva como respaldo `02_BACKUPS/FRESHA_CODEX_EVIDENCIA_V04.zip` (investigación anterior) y añade el video original y 15 fotogramas de movimientos de Caja.

## Qué quedó COMPROBADO
- Caja inicialmente abierta con 2,000 MXN.
- Entrada manual de +200 MXN con motivo «Transferencia desde el banco o la caja fuerte»: el saldo sube a 2,200 MXN y aparece el mensaje «Efectivo añadido».
- Salida manual de -50 MXN con motivo «Efectivo para gastos menores para efectuar compras»: el saldo baja a 2,150 MXN y aparece «Efectivo retirado».
- La actividad muestra cuatro eventos distintos: apertura (0 MXN), efectivo inicial (+2,000 MXN), entrada (+200 MXN), salida (-50 MXN).
- Ambos formularios solicitan cantidad y muestran comentario con contador 0/100. La entrada muestra también «Añadir archivo adjunto». Los movimientos observados se confirmaron con comentario vacío y sin adjuntar archivo.
- La vista de detalle contiene pestañas «Resumen» y «Actividad»; la actividad muestra filtros por tipo y miembro del equipo.

## Qué NO prueba este material
- Cierre final, arqueo físico, discrepancias, reabrir caja, permisos, concurrencia, fondos insuficientes, saldos negativos, devoluciones y su efecto, impuestos, pagos de venta reales, APIs, código original ni lógica del servidor.
- Que la ecuación de saldo observada abarque todos los casos de cobro/reembolso. Solo se validó esta secuencia.

## Archivos para leer
1. `01_CAJA_OPERACIONES_V05/HALLAZGOS_CAJA.md`: pruebas y campos observados.
2. `01_CAJA_OPERACIONES_V05/SECUENCIA_VERIFICADA.csv`: cronología con tiempos del video.
3. `01_CAJA_OPERACIONES_V05/KEYFRAMES/`: evidencia visual.
4. `03_CODEX_HANDOFF/START_HERE_CODEX.md`: instrucciones de interpretación e implementación independiente.
5. `02_BACKUPS/FRESHA_CODEX_EVIDENCIA_V04.zip`: respaldo acumulado previo; extraer aparte para explorar el resto.

**Privacidad:** el video y algunos fotogramas contienen el nombre de la cuenta y metadatos operativos. Revisar/redactar antes de compartir fuera de un entorno privado. No hay capturas de red ni código propietario.
