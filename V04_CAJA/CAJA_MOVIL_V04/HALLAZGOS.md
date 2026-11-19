# Fresha — Caja registradora móvil (evidencia V04)

**Fuente primaria:** `GRABACION_ORIGINAL.mp4`, pantalla vertical 512×1108, 36.87 segundos, aportada el 17 de noviembre de 2026. La grabación muestra una cuenta de prueba; las pantallas están en español. Las capturas de `CAPTURAS/` son fotogramas extraídos del video.

## Hechos observados directamente

1. La navegación móvil `Ventas` contiene `Resumen de ventas diario`, `Cajas registradoras`, `Citas`, `Ventas` y `Pagos`; también figuran `Tarjetas regalo vendidas`, `Bonos vendidos` y `Membresías vendidas` (M01).
2. La primera visita a `Cajas registradoras` muestra una pantalla explicativa de la herramienta, con `Más información` y `Empezar ahora` (M02). Sus promesas comerciales no deben confundirse con funcionalidad ensayada.
3. `Configuración de las preferencias de la caja registradora` muestra nombre (contador `0/32`, placeholder `Recepción`) y dos casillas de opciones avanzadas (M03):
   - `Exigir que la caja registradora esté abierta para empezar a realizar ventas` (marcada en esta sesión). Su texto dice que es obligatoria la apertura para ventas presenciales en ese centro.
   - `Fijar un importe mínimo de efectivo` (sin marcar). Su texto dice que pedirá al equipo añadir un importe mínimo de efectivo antes de abrir o cerrar.
   No se verificó el comportamiento de ninguna de estas restricciones con una venta real.
4. Se introduce el nombre `Caja de` y se pulsa `Continuar` (M04). Luego aparece una confirmación emergente `Caja registradora creada` y una tarjeta en estado `Cerrada` con `0 MXN` y botón `Abrir una caja registradora` (M05).
5. El formulario `Abrir una caja registradora` tiene encabezado con nombre de caja y ubicación, campo monetario `Importe de efectivo inicial`, campo `Comentario` con contador `0/100`, y botón `Abrir una caja registradora` (M06).
6. El usuario introduce `2000` MXN en el importe inicial y deja el comentario vacío (M07). Luego la aplicación muestra confirmación `Caja registradora abierta` (M08/M09).
7. La tarjeta de caja pasa a estado `Abierta` con saldo `2000 MXN`, indicación de usuario y hora de apertura y botones `Ver` y `Acciones` (M09).
8. El menú inferior `Acciones` lista `+ Entrada de efectivo` y `− Salida de efectivo` (M10). Se observa apertura del menú, **no** los formularios de esas operaciones ni cambios de saldo por movimientos.
9. El bloque `Cajas registradoras cerradas` está vacío y muestra un estado vacío. **No se observa realizar ni completar un cierre de caja** en este video.

## Secuencia de estados comprobada

`Primera visita → Pantalla introductoria → Configurar preferencias → Caja creada, Cerrada (0 MXN) → Formulario de apertura → Caja Abierta (2000 MXN) → Menú Acciones`.

## Distinción entre hechos e inferencias

- **Verificado visualmente:** pantallas, campos, etiquetas, estados, importes mostrados, dos mensajes de confirmación de creación y apertura, menú de acciones.
- **No verificado:** validación de campos vacíos, error de importe negativo, permisos efectivos, cantidad de cajas por ubicación, políticas de apertura, efecto real de las opciones avanzadas, conciliación, arqueo, cálculo bajo movimientos y cierre.
- **No observado:** código fuente, HTTP/API, base de datos interna o procesamiento backend.

## Recomendación para Codex

Implementar una **especificación independiente** de este flujo, con estados explícitos `no_configurada`, `cerrada`, `abierta`; apertura por usuario y monto inicial; eventos inmutables de apertura y movimientos; restricciones y validaciones propias documentadas como decisiones de diseño (no atribuidas a Fresha). Consultar `PREGUNTAS_PENDIENTES.md` antes de afirmar equivalencia funcional.

## Nota de seguridad y privacidad

La grabación original contiene nombres de cuenta/usuario visibles en pantalla. Es para análisis interno del propietario del archivo. Revisar/redactar antes de compartir externamente.
