---
name: saas-reverse
description: "Ingeniería inversa funcional y UX/UI de aplicaciones SaaS a partir de videos, capturas, índices y documentos locales. Usar para mapear Fresha a MAMBO JAMBO: navegación, pantallas, estados, componentes y flujos con trazabilidad. No usar para descompilar, acceder a sistemas privados ni copiar identidad visual."
---

# SaaS Reverse — reconstrucción funcional y estructural basada en evidencia

## Alcance
Reconstruir la arquitectura de información, las pantallas, los flujos de usuario, los componentes y las reglas **observables** de un SaaS a partir de material autorizado. Esta skill es una **metodología de análisis**, no una herramienta mágica de extracción de código o una réplica gráfica automática.

## Entrada en este repositorio
- Leer primero `CODEX_REVERSE_ENGINEERING_BLUEPRINT/00_START_HERE.md`, `02_FUNCTIONAL_SPECIFICATIONS.md`, `03_UX_UI_AUDIT.md`, `04_ARCHITECTURE.md` y `07_OPEN_QUESTIONS.md`.
- Contrastar con `01_MAPAS/`, `02_FLUJOS/`, `03_UX_UI/`, `04_ARQUITECTURA_PROPUESTA/` y las evidencias en `05_EVIDENCIAS/`, `VIDEOS/` y `FOTOGRAMAS/`.
- Tener presente que los índices antiguos contienen rutas obsoletas, videos reubicados, duplicados y referencias a fotogramas ausentes. `01_EVIDENCE_INDEX.csv` ayuda a resolverlos. No confundir rutas históricas con archivos disponibles.
- Cuando exista `MAMBO_JAMBO_PRODUCT_DECISIONS.md` en el checkout, leerlo y señalar las decisiones que cambian el mapeo. Si no existe, declararlo expresamente y trabajar con lo disponible.

## Proceso obligatorio
1. **Inventario primero.** Identificar las pruebas existentes, su fuente real, el video/fotograma concreto y el nivel de confianza. No volver a procesar los videos completos si sus fotogramas y especificaciones son suficientes.
2. **Reconstruir jerarquía.** Elaborar mapa de módulos → rutas/secciones → submenús → vistas → drawers/modalidades → acciones. Tomar como referencia la composición observable: riel global de iconos, menú contextual, lienzo central y paneles laterales cuando estén acreditados.
3. **Reconstruir pantallas.** Para cada pantalla: propósito, entrada desde navegación, distribución, encabezado, controles, datos mostrados, filtros, tabla/calendario/formulario, acciones y feedback, estados vacío/cargando/error/éxito y comportamiento táctil observado.
4. **Reconstruir recorridos.** Diagramar inicio, pasos, validaciones, cambios de estado, confirmaciones, regreso a la pantalla anterior, errores y excepciones. Incluir Agenda, Clientes, Servicios, POS/Caja, Equipo, Inventario, Informes y Configuración según cobertura.
5. **Relacionar evidencia.** Toda afirmación relevante debe citar una ruta que exista; cuando sea video, especificar tiempo local de ese archivo. Si la conclusión proviene de un resumen sin verificación directa, señalarlo.
6. **Separar hallazgo y propuesta.** Clasificar como `VERIFICADO`, `PARCIAL`, `INFERIDO` o `DESCONOCIDO`. Marcar cualquier solución original como `DECISION_PROPIA`; nunca atribuirla a Fresha.
7. **Mapear referencia → producto propio.** Vincular cada pantalla observada con una pantalla de MAMBO JAMBO, su ubicación exacta en la navegación, componente compartido y estado de implementación (`MVP`, `POSTERIOR`, `SOLO_EN_MAPA`).
8. **Auditar consistencia.** Comprobar rutas, retorno de navegación, terminología, permisos y estados; evitar menús que prometan funciones inexistentes. Preparar un informe de divergencias: `EQUIVALENTE`, `ADAPTACION_JUSTIFICADA` o `SIN_EVIDENCIA`.

## Fidelidad estructural y límites
- Priorizar equivalencia de **arquitectura de información, jerarquía, organización de módulos y lógica de interacción** respecto a la evidencia de Fresha. No sustituir sin motivo por dashboards genéricos ni rediseños arbitrarios.
- Crear código, textos, marca, iconografía e identidad visual propios. No copiar código, APIs privadas, marcas, ilustraciones o activos protegidos; no afirmar equivalencia pixel a pixel ni inventar medidas CSS.
- Que una función aparezca en un menú no demuestra que funcione. Que un documento proponga arquitectura no significa que se haya observado en Fresha.
- No intentar acceder a rutas privadas ni superar autenticación. Playwright/DevTools solo cuando el acceso y la prueba estén autorizados.

## Eficiencia
- Consultar antes los ocho archivos de blueprint y el índice de evidencia. Procesar video por tramos bajo demanda con FFmpeg/ffprobe cuando estén disponibles.
- Detectar duplicados por SHA-256; no borrar la evidencia original. No repetir decenas de imágenes idénticas.
- Si faltan fotogramas, consultar los videos existentes; si la comprobación sigue siendo imposible, registrar el vacío.
- No exigir herramientas o skills externas: continuar usando las herramientas locales accesibles y declarar limitaciones.

## Entregables para MAMBO JAMBO (sin escribir aplicación)
Producir, en una carpeta nueva fuera de la evidencia original:
1. `FRESHA_TO_MAMBO_SCREEN_MAPPING.md` — tabla con ID, ruta real de evidencia, módulo/pantalla origen, pantalla destino, fidelidad, confianza y fase.
2. `MAMBO_JAMBO_INFORMATION_ARCHITECTURE.md` — árbol navegable y rutas, estados y permisos.
3. `MAMBO_JAMBO_UX_UI_SPEC.md` — especificación verificable de composición y componentes, con ejemplos de estados responsive solo donde haya evidencia.
4. `MAMBO_JAMBO_SCREEN_FLOWS.md` — secuencias y transiciones, Mermaid opcional.
5. `MAMBO_JAMBO_IMPLEMENTATION_SCOPE.md` — primer MVP versus fases posteriores y preguntas pendientes, sin fingir pantallas operativas.

## Control final
- Cada pantalla mapeada tiene evidencia, clasificación y ruta concreta.
- La distribución global es coherente entre módulos y fiel a los patrones observados.
- Las diferencias frente a Fresha están explícitas y justificadas.
- Los módulos posteriores aparecen documentados pero no se representan como funcionales.
- No se crea frontend, backend, base de datos o desplegable en esta ejecución.
- El informe final identifica ausencias de evidencia, decisiones por aprobar y cómo verificarlas.
