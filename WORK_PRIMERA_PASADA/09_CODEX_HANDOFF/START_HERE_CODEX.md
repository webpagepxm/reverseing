# Prompt autocontenido para Codex
Actúa como ingeniero de producto. Este paquete documenta parcialmente Fresha desde una cuenta autorizada; NO contiene su backend ni código fuente. Objetivo posterior: diseñar una implementación independiente educativa con funcionalidades documentadas e identidad original.
1. Lee todos los Markdown, CSV y evidencias. Comprueba SOURCE_MANIFEST.json: cada archivo listado debe existir y coincidir SHA256/tamaño. Revisa MASTER_INDEX y referencias E/F/T.
2. Distingue observaciones históricas recuperadas E01, evidencia UI actual E02–E11, inferencias, propuestas y desconocidos. No atribuyas a Fresha tablas/API/frameworks no verificados.
3. Reconstruye inventario funcional y navegación. Conserva límites de cobertura; “visible” no significa funcionando, “activo” no significa enviado, “reservado” no significa cobrado.
4. Analiza árboles de accesibilidad y captura; no son DOM/HTML/CSS/red completos. No hay JS propietario ni HAR.
5. Modela relaciones cliente→cita/líneas→servicio/personal→venta/pagos→comisión/reportes; las partes posteriores al carrito requieren definición y pruebas propias.
6. Diseña esquema original con tenant/sucursal, auth/roles/RLS, disponibilidad transaccional, precios históricos, importes exactos, inventario por movimientos, políticas versionadas y auditoría.
7. Propón contratos API propios, validaciones, errores, idempotencia y permisos. Marca decisiones propuestas y preguntas abiertas.
8. Planifica módulos y dependencias. No copies marca, assets, textos ni código de Fresha.
9. Define tests unitarios de reglas, integración transacciones/RLS, Playwright de recorridos, concurrencia y recuperación. Diferencia pruebas planificadas y ejecutadas.
10. Antes de construir presenta el alcance inferido y alternativas. Si se autoriza implementación, usa Next.js/React/TypeScript y Supabase/PostgreSQL como base propuesta, marketing/POS simulados, entornos separados, Git privado y migraciones versionadas.
11. No declares terminado sin ejecutar verificaciones, documentar resultados y limitaciones. No modificar CALLEJERO OPS ni Denbou.
12. No necesitas esta conversación: los documentos y evidencias son la fuente. Ante un vacío, decide explícitamente un comportamiento propio o pide aclaración; nunca fabrica una observación de Fresha.
Este turno de investigación no autoriza despliegues, pagos reales, envíos o publicaciones.
