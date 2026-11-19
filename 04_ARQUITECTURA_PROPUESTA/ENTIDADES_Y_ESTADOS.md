# Modelo conceptual propuesto (NO obtenido de la base de datos de Fresha)

```mermaid
erDiagram
 BUSINESS ||--o{ LOCATION : has
 BUSINESS ||--o{ EMPLOYEE : employs
 BUSINESS ||--o{ CUSTOMER : serves
 BUSINESS ||--o{ SERVICE : offers
 LOCATION ||--o{ APPOINTMENT : schedules
 EMPLOYEE ||--o{ APPOINTMENT : assigned_to
 CUSTOMER o|--o{ APPOINTMENT : optionally_books
 SERVICE ||--o{ APPOINTMENT_LINE : referenced_in
 APPOINTMENT ||--|{ APPOINTMENT_LINE : includes
 LOCATION ||--o{ CASH_SESSION : manages
 CASH_SESSION ||--o{ CASH_MOVEMENT : records
 SALE ||--o{ SALE_LINE : includes
 CUSTOMER o|--o{ SALE : makes
 APPOINTMENT o|--o{ SALE : may_generate
 SALE ||--o{ PAYMENT : receives
 PAYMENT o|--o{ CASH_MOVEMENT : may_reconcile
 PRODUCT ||--o{ STOCK_MOVEMENT : changes
 SUPPLIER o|--o{ PRODUCT_SUPPLIER : provides
 PRODUCT ||--o{ PRODUCT_SUPPLIER : linked_to
 EMPLOYEE ||--o{ COMMISSION_RULE : receives
 SALE_LINE o|--o{ COMMISSION_ENTRY : may_generate
 EMPLOYEE ||--o{ COMMISSION_ENTRY : accrues
 EMPLOYEE ||--o{ SHIFT : scheduled_for
 EMPLOYEE ||--o{ PAYROLL_ITEM : compensated_by
```

## Estados candidatos (no observados íntegramente)
- Caja: `closed` → `open` → `closed`; reapertura de una sesión cerrada **pendiente de definir**, no asumir un estado real de Fresha.
- Cita: `reserved` / `confirmed` / `completed` / `cancelled` / `no_show` (**lista orientativa**, solo algunos textos son visibles).
- Venta: `draft` / `pending_payment` / `paid` / `refunded` (propuesta de nuestra app; no tratar como estados originales confirmados).
- Stock: libro mayor de movimientos, no editar contador sin rastro.

## Decisiones de implementación originales por definir
Políticas de concurrencia en caja, devoluciones, permisos por tenant/ubicación, historial inmutable, numeración de folios, divisas, impuestos, stock multialmacén, pagos mixtos, facturación y conciliación. Priorizar pruebas y diseño de seguridad antes de producir software real.
