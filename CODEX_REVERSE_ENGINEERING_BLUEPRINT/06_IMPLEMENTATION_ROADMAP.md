# Hoja de ruta de implementación

**DECISION_PROPIA.** La primera entrega del producto es **Agenda** con los mínimos de Clientes, Servicios y Equipo. Da una utilidad operativa completa desde temprano, permite probar permisos, horarios y conflictos y fija las entidades que alimentan POS. El primer flujo con dinero une Agenda, POS y Caja con pago en efectivo. La propuesta se revisa con las decisiones de la [lista de preguntas](07_OPEN_QUESTIONS.md).

| Etapa | Prioridad y alcance | Dependencias y salida para revisión |
|---|---|---|
| 0 · Acuerdos | P0. Definir jurisdicción, alcance de MVP, moneda y zona, permisos, reglas de agenda y política de efectivo. Elegir alojamiento, backups y objetivos de recuperación. | Aprobar decisiones P0 y criterios de piloto. Confirmar que el usuario aprueba comenzar desarrollo. |
| 1 · Agenda operativa | P0. Identidad, negocio, sede, membresía, catálogo, ficha básica, empleado/turnos, cita con o sin cliente y estados básicos. | Migraciones, aislamiento, auditabilidad, interfaz día/lista y pruebas T01–T04, T11 y subset de T15. Operador puede usar Agenda sin acoplarse a cobros. |
| 2 · POS y Caja | P0. Venta directa o desde cita, efectivo, propina, recibo operativo, arqueo y corrección auditada, informe de efectivo básico. Preparar devolución de servicios conforme a política. | Catálogo y snapshot de Agenda. Salida con T05–T08, T11, T13 en el alcance de caja y T15. Distinguir recibo operativo y obligaciones fiscales conforme a la jurisdicción. |
| 3 · Inventario | P1. Producto, proveedor, saldo por centro, recepción parcial, recuento, venta física y reposición por devolución. | POS transaccional y política de existencias. Habilitar catálogo físico al cumplir T09–T10 y repetir T08 y T11 sobre ventas físicas. |
| 4 · Comisiones e informes | P1. Devengos con vigencia, ajustes, registro de liquidación manual, informes por centro y período, CSV y segmentos básicos. | Líneas pagadas, reembolsos, reglas P1 y catálogos. T12–T13 y comprobación de conciliación con los libros. |
| 5 · Ampliaciones | P2. Pagos electrónicos y mixtos, conectores, recurrencia y grupos, recursos, fichajes, fidelidad y otras funciones según demanda. | Decisiones de producto y proveedores aprobados. T14, escenarios adicionales de seguridad y revisión de UX por módulo. |

Antes de operar con dinero real, completar T16, alarmas de fallos de escritura y reconciliación, revisión de retención y autorización, y un piloto con datos sintéticos. Primero demostrar el circuito de efectivo. El lanzamiento de nuevos medios y conectores depende de la aprobación de sus propias pruebas. El [modelo y contratos](04_ARCHITECTURE.md) y la [matriz de aceptación](05_TEST_STRATEGY.md) definen lo que se revisa en cada salida.
