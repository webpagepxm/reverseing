# Preguntas abiertas

Las decisiones recomendadas son **DECISION_PROPIA**. P0 indica aprobación antes de programar la etapa que afecta. Las comprobaciones de Fresha se proponen como investigación adicional cuando su resultado pueda cambiar una decisión de producto.

## Decisiones del producto

| ID | Prioridad y momento | Pregunta y propuesta para decidir |
|---|---|---|
| D01 | P0 · Etapa 0 | ¿Cuál es el mercado, país y tipo de negocio inicial? Confirmar idioma, moneda, zona por sucursal, entidad responsable y reglas de retención. Usar una moneda por sede y adaptar cierres a su fecha operativa. |
| D02 | P0 · Etapa 0 | ¿Qué puede hacer recepción, caja, supervisión y administración? Aprobar matriz por sede para datos personales, devoluciones, exportaciones, arqueos y liquidación, y quién concede o revoca accesos. |
| D03 | P0 · Etapa 1 | ¿Se admiten citas sin cliente, buffers, reservas fuera de turno y varios empleados? Propuesta inicial de cliente opcional, intervalos sin solape y conflictos explícitos. Definir excepciones, multiempleado, reprogramación y finalización. |
| D04 | P0 · Etapa 1 | ¿Qué datos mínimos de contacto y consentimientos se justifican? Confirmar archivado, solicitudes de derechos, contactos compartidos y conservación de relaciones históricas. |
| D05 | P0 · Etapas 0 y 2 | ¿Se aprueba efectivo para el piloto? Definir si caja abierta es obligatoria, qué hacer con faltantes, sobrantes, diferencias de apertura y devoluciones de sesiones cerradas. Aprobar folios, impuestos, comprobantes y reglas de propinas y cambio. |
| D06 | P0 · Etapa 0 | ¿Alojamiento, región, presupuesto y objetivos de recuperación? Propuesta de PostgreSQL administrado con backups, ejercicio de restauración y revisión de RLS antes de producción. Fijar RPO/RTO, alertas y responsables. |
| D07 | P1 · Etapa 3 | ¿Stock negativo, múltiples almacenes, unidades fraccionarias y devoluciones no revendibles? Propuesta de bloquear stock negativo y llevar libro por centro. Aprobar ajuste por merma, recepción parcial y sincronización del recuento. |
| D08 | P1 · Etapa 4 | ¿Cuándo devenga comisión y cuál es la base? Aprobar impuestos, descuentos, vigencia, devolución posterior a liquidación, precedencia, redondeo, reparto de propina y umbrales de aprobación. |
| D09 | P1 · Etapa 4 | ¿Qué significa venta, valor de cita y cobro por período? Definir fecha de imputación, filtros, frescura, correcciones tardías, permisos del CSV y semántica de ventanas y consentimiento en segmentos. |
| D10 | P2 · Etapa 5 | ¿Qué pago electrónico o integración justifica coste y soporte? Elegir proveedor, jurisdicción, conciliación, contrato de callbacks, límites de datos y modo de desconexión antes de habilitarlo. |

## Comprobaciones de evidencia con mayor impacto

| Prioridad | Vacío y verificación que lo cerraría |
|---|---|
| P0 | **Cita → venta → pago → caja → informe.** Usar un importe y un folio trazables en cuenta de prueba. Registrar estados antes/después, pago, ID de sesión y filtro del informe. La venta en efectivo existente solo demuestra cierre en POS y un agregado compatible. |
| P0 | **Stock por venta y devolución.** Registrar producto rastreado, saldo, cantidad vendida, movimiento y saldo nuevo. Devolver con y sin reposición y observar diferencias. |
| P0 | **Permisos y concurrencia.** Probar dos roles y dos sedes en ambiente de prueba, además de dos reservas simultáneas, cierre coincidente con pago y cantidades remanentes en inventario. |
| P0 | **Arqueo mixto y reversión.** Confirmar conciliación por medio, archivo descargado, política de autorización y efecto real al reabrir. Distinguir reapertura de la misma sesión y apertura de una sesión nueva. |
| P1 | **Ciclos de catálogo y CRM.** Crear y editar clientes y servicios, comprobar persistencia y reacción ante campos inválidos o duplicados. Guardar segmento personalizado y contrastar miembros con una fixture conocida. |
| P1 | **Agenda, compras y equipo.** Ejecutar reprogramación, cancelación, inasistencia y recurrencia. Completar pedido, recepción y recuento. Probar comisión a partir de una venta elegible y reembolso, vigencia y regla aplicada. |
| P1 | **Informes.** Descargar exportaciones, comparar filtros y columnas, comprobar marcas de frescura y trazabilidad por operación. |
| P2 | **Interacción.** Capturar móvil de Agenda, CRM, Inventario y Equipo y recorrer teclado/lector de pantalla. Probar conectores solo si se priorizan. |

Para cada nueva captura, conservar ruta, fecha, entorno, datos de prueba redactados, segundo o identificador y qué cambió en el sistema. Para antecedentes y ausencias del expediente, consultar el [inventario](01_EVIDENCE_INDEX.csv) y el [resumen](00_START_HERE.md).
