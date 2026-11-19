# FRESHA / Citas — Transferencia técnica V09

## Alcance
Investigación realizada mediante grabación de pantalla proporcionada por el usuario, duración 57.33 s, 1440×772 a 60 fps, registrada el 18 de noviembre de 2026. Contiene un flujo completado de creación de una cita sin cliente desde el calendario, y exploración de controles de calendario. No es código fuente, HAR ni inspección de backend.

## Cómo empezar
1. Leer `03_ESPECIFICACION/CITAS_FLUJO_VERIFICADO.md` y `03_ESPECIFICACION/PENDIENTES_Y_HIPOTESIS.md`.
2. Ver evidencia original en `01_EVIDENCIA_VIDEO/CITAS_2026-11-18_14-07-43.mov`.
3. Usar `04_INDICES/FRAMES_INDEX.csv` para localizar fotogramas en `02_FOTOGRAMAS/`.
4. Las observaciones de este paquete se limitan al módulo Citas; el ZIP anidado en `05_RESPALDO_PREVIO/` contiene la investigación anterior (módulos Caja y otros). No presumir cobertura completa de Fresha.
5. Para construir una implementación propia: derivar requisitos, modelar citas, recursos, servicios y estados, diseñar API y pruebas; no copiar código o elementos de marca de Fresha.

## Calificación de evidencia
- CONFIRMADO: visible y probado en este video.
- VISIBLE: opción o configuración mostrada sin comportamiento completo verificado.
- PENDIENTE: no mostrado o no comprobado.

## Integridad
Revisar `04_INDICES/SOURCE_MANIFEST.json` para hashes SHA-256 de los archivos de entrada y fotogramas.
