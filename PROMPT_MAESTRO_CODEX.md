# Instrucciones operativas para Codex — Fresha Research Handoff

Tu tarea es usar este expediente como **material de referencia para analizar un producto SaaS**, NO copiar su código ni clonarlo literalmente.

## Primera entrega requerida: auditoría de evidencia, SIN programar
1. Lee todos los README de `00_COMIENZA_AQUI/` y los archivos CSV de `01_MAPAS/`.
2. Abre los documentos de `02_FLUJOS/`, `03_UX_UI/` y `04_ARQUITECTURA_PROPUESTA/`.
3. Reproduce los fragmentos de video pertinentes e inspecciona los fotogramas. El archivo `01_MAPAS/INDICE_VIDEOS.csv` identifica cada fuente.
4. Construye una matriz por función con evidencia concreta (archivo + segundo/fotograma), estado VERIFICADO/OBSERVADO/INFERIDO/NO PROBADO y nivel de confianza.
5. Revisa la consistencia del ciclo de Caja, la vinculación Cita → Venta → Pago, el control de stock, roles y comisiones, respetando lo no probado.
6. Presenta: mapa de módulos, flujos prioritarios, reglas verificadas, preguntas y defectos de cobertura, y arquitectura original sugerida.

## Segunda entrega: diseño de implementación propia
- Definir entidades, estados, eventos de auditoría, esquema transaccional y contratos propios de API. No inventar endpoints originales de Fresha.
- Diseñar un sistema de componentes UX propio con inspiración en patrones observables: navegación lateral, paneles contextuales, vistas de calendario, formularios, tablas, estados de carga/error/éxito.
- Proteger la seguridad: autenticación, autorización por rol con prueba real, RLS si se elige Supabase, transacciones de caja/venta/inventario, idempotencia, concurrencia, logging y backups.
- Redactar pruebas de aceptación automatizadas: registro de Caja, diferencias de arqueo, conversión de Cita en Venta, ajustes de stock, comisiones y navegación responsive.
- Definir MVP por etapas. Antes de codificar módulos grandes, solicitar las decisiones de producto que no estén documentadas.

## Reglas
- No pretendas recuperar código privado, secretos, bases de datos ni contratos API no observados.
- No afirmes que una opción de menú equivale a flujo verificado.
- Usa referencias a evidencia y trata documentos previos como hipótesis que deben contrastarse con las grabaciones.
- Si se decide programar, producir una implementación ORIGINAL, no una copia literal de branding, estilos ni activos protegidos.
- Documenta cada decisión de diseño que complete huecos de evidencia como `DECISION_PROPIA`.
- Genera plan de pruebas con Playwright y CI; pruebas transaccionales de concurrencia, autorización, exportaciones y restauración antes de considerar la app apta para producción.
