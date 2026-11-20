# Blueprint para un SaaS de operación de salones

Base auditada: `main` en `c2e96daed0f8df855e497ad4d95ae261edd39ef4`. Entrega documental para revisión en la rama local `codex/fresha-blueprint`.

La evidencia muestra altas de citas, productos y proveedores, movimientos y arqueos de caja, una venta en efectivo completada, ediciones en segmentos estándar, configuración de turnos y comisión y registro manual de un pago al equipo. Los principales huecos afectan la relación efectiva entre cita, caja, stock y comisiones, la autorización con distintos usuarios y las reglas que requieren probar excepciones o concurrencia.

## Qué cubre el expediente

| Módulo | Resultado observado | Incertidumbre que afecta al producto |
|---|---|---|
| Agenda | Cita de 90 min sin cliente guardada, con servicio y empleado | Solapamientos, reprogramación, cancelación, inasistencia y recurrencia |
| CRM | Navegación en perfil y guardado de edición de segmentos estándar | Alta y edición de ficha con prueba directa, pertenencia efectiva, consentimiento |
| Servicios | Catálogo, categoría, duración y precio utilizados en cita y venta | Ciclo de administración del servicio, overrides y recursos |
| Ventas | Venta directa de 25 MXN y 6,25 MXN de propina, pago efectivo de 31,25 MXN registrado en el detalle | Conciliación de la venta con sesión de caja, cita, stock, reembolsos y otros medios |
| Caja | Apertura, movimientos, arqueo con diferencia, cierre y sugerencia para una sesión nueva | Reapertura de la sesión cerrada, pagos mixtos, exportación y permisos efectivos |
| Inventario | Producto con stock inicial 12, proveedor creado, recuento en revisión | Pedido/recepción, ajuste final, venta y devolución con stock |
| Equipo | Turno recurrente guardado y roles visibles | Concesión y cumplimiento de permisos, fichajes y efecto de turnos en reservas |
| Comisiones y pagos | Regla fija 20 % y registro manual de 6,25 MXN en un ejemplo de propina | Base de comisión sobre ventas, devoluciones, salarios y transferencia bancaria |
| Informes e integraciones | Informes con datos y catálogo de integraciones | Fórmulas, trazabilidad por operación, exportación y conectores activos |

Cada alcance y su prueba quedan trazados en [Especificaciones funcionales](02_FUNCTIONAL_SPECIFICATIONS.md). Las observaciones se limitan a la interfaz y los resultados visibles de las cuentas de prueba.

## Inventario reconstruido

- **396 archivos versionados**: 252 JPG, 14 PNG, 16 MP4, 77 Markdown, 18 CSV, 9 JSON y 10 TXT. SHA-256 da 316 contenidos únicos, 71 grupos repetidos y 80 copias adicionales. Los 16 MP4 representan 14 contenidos distintos. Las dos copias de cada video de citas coinciden byte a byte; el índice elige las rutas bajo `05_EVIDENCIAS/`.
- **13 entradas de video previas**: 3 rutas del paquete válidas, 9 reubicadas bajo `VIDEOS/` y 1 fuente distribuida en dos partes. El MP4 monolítico de exploración global está ausente. La parte 1 dura 167 s y la parte 2 177,125 s, frente a 333,37 s registrados para el original. Ambas muestran la zona de catálogo/inventario cerca del corte. Usa los segundos locales de cada parte o los nombres de fotogramas históricos, sin sumar las duraciones como si fueran una concatenación.
- **253 referencias principales a fotogramas**: 60 en su ruta declarada, 160 reubicadas y 33 sin pieza disponible, correspondientes a precierre V06 y cierre V07. Sus MP4 permiten revisar los puntos decisivos. El índice previo atribuye números que corresponden a importes, sufijos decimales o número de montaje a segundos. El índice nuevo omite los segundos de montajes `detail_N` y distingue las marcas del original de Equipo de las del recorte.
- Entre las demás ausencias están `00_COMIENZA_AQUI/`, `06_DOCUMENTOS_ORIGINALES/`, `05_EVIDENCIAS/CAPTURAS_UI/`, paquetes ZIP históricos, la captura E04 de recordatorios y el fotograma histórico de Equipo a 150 s. Hay capturas de Caja en `CAJA_SCREENSHOTS/` y un árbol AX de recordatorios en `WORK_PRIMERA_PASADA/`. De los 13 hashes de fuente de video, solo el recorte de Equipo tiene coincidencia exacta en el árbol. Los otros tienen MP4 de consulta.
- El [índice de evidencia](01_EVIDENCE_INDEX.csv) contiene una fila por archivo y filas de reconciliación de mapas, manifiestos e índices históricos. `rutas_reales` lista candidatos separados por ` | `. `ruta_canonica` identifica un contenido exacto cuando procede, `sha256` corresponde al archivo presente y `sha256_referido` al registro histórico. Una ruta reubicada por colección y nombre indica correspondencia de inventario. `VERIFICADA_POR_HASH` exige igualdad binaria. Las ausencias en filas de referencia pueden repetirse entre fuentes. Identifica los archivos por ruta, pues el ID lógico de un video puede aparecer en más de una fila.

## Método y alcance

Se revisaron los mapas principales, las síntesis funcionales y de diseño y los paquetes históricos pertinentes. La pasada funcional contrastó afirmaciones con fotogramas y muestreó tramos de video de venta, arqueo, apertura posterior, segmentación y el corte de exploración global. La segunda pasada examinó composición, controles y feedback en los mismos fotogramas, con muestras adicionales de móvil y tablas. Los nombres de fotogramas indican marcas aproximadas salvo cuando se cita directamente un segundo local del MP4. Los árboles AX conservados se limitan a pantallas históricas de marketing y complementos. No se efectuaron pruebas nuevas sobre Fresha. El trabajo usó Git, SHA-256, FFmpeg/FFprobe e inspección visual. Las skills de ingeniería inversa y UX solicitadas no estaban instaladas.

## Decisiones propuestas

**DECISION_PROPIA.** Empezar con clientes, servicios, equipo mínimo y agenda. Continuar con caja y POS como primera integración con dinero, seguida de stock, comisiones y análisis. La agenda entrega valor temprano y fija empleado, horario, precio histórico y vínculo de compra.

**DECISION_PROPIA.** Monolito modular Next.js y TypeScript con PostgreSQL administrado mediante Supabase, identidad con Supabase Auth, autorización por negocio y centro, operaciones transaccionales y Playwright para los recorridos del negocio. La UX propia usa navegación textual, colores petróleo y terracota, agenda de escritorio con alternativa en lista y paneles que preservan filtros y selección.

- [Especificaciones funcionales](02_FUNCTIONAL_SPECIFICATIONS.md)
- [Auditoría UX/UI y sistema de diseño](03_UX_UI_AUDIT.md)
- [Arquitectura y contratos](04_ARCHITECTURE.md)
- [Estrategia de pruebas](05_TEST_STRATEGY.md)
- [Hoja de ruta](06_IMPLEMENTATION_ROADMAP.md)
- [Preguntas para decidir antes de programar](07_OPEN_QUESTIONS.md)
