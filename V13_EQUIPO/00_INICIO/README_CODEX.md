# Fresha — Equipo, comisiones, turnos y procesos de pago (V13)

## Alcance y procedencia
Este paquete documenta una grabación de pantalla de Fresha, facilitada por el usuario el 18-11-2026. Duración de la grabación original: **238.2 s**. Se observó únicamente el entorno al que tenía acceso la cuenta de prueba. No se capturó código fuente ni tráfico HTTP, ni se conoce la arquitectura interna del servicio.

## Lectura recomendada
1. `03_DOCUMENTACION/HALLAZGOS_VERIFICADOS.md` — observaciones, estados, secuencia y tiempos.
2. `03_DOCUMENTACION/ARQUITECTURA_FUNCIONAL_PROPUESTA.md` — inferencias y diseño independiente, NO arquitectura de Fresha.
3. `04_PRUEBAS/PENDIENTES_Y_QA.md` — pruebas necesarias antes de una implementación fiable.
4. `03_DOCUMENTACION/EVIDENCE_INDEX.csv` — busca fotogramas por segundo y prueba.
5. `01_EVIDENCIA/EQUIPO_RECORTADO_SIN_VERIFICACION.mp4` — video de revisión redactado.

## Clasificación de evidencia
- **OBSERVADO**: texto, opciones, estados y mensajes visibles en el video.
- **VERIFICADO**: acción y resultado posterior visibles (p. ej. comisión aplicada, turno guardado, pago marcado).
- **SOLO INTERFAZ**: opción visible, sin haber realizado su acción.
- **INFERIDO**: explicación plausible sin verificación.
- **PROPUESTO**: diseño de una implementación original.

## Seguridad
La grabación original contiene una pantalla de autenticación de dos factores. La copia incluida omite aproximadamente el intervalo **207–222 segundos del video original** para evitar distribuir códigos temporales y datos de verificación. El material **no demuestra una transferencia bancaria**: se observó el modo de **pago manual**, marcado como pagado fuera de Fresha, y su posterior actualización en la interfaz.

## Completitud
Es un módulo de evidencia V13, no un análisis exhaustivo de todos los roles o comisiones de Fresha. Para contexto anterior, revisar por separado el ZIP V12 (y los respaldos anteriores allí incorporados). No confundir el video de Equipo con el de Ventas/Caja.
