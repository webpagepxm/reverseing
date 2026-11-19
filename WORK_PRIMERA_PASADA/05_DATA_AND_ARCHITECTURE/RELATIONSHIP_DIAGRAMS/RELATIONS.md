# Relaciones observadas e inferidas
Cadena histórica observada hasta carrito, reporte leído después (E01):
```mermaid
flowchart TD
 C["Cliente ficticio"] --> A["Cita reservada"]
 S["Servicio"] --> A
 T["Empleado"] --> A
 A --> V["Carrito POS"]
 A --> R["Resumen de citas"]
```
No flecha pago→comisión→reportes porque no se comprobó.
Modelo para implementación propia, INFERIDO:
```mermaid
erDiagram
 APPOINTMENT ||--|{ APPOINTMENT_LINE : contains
 SERVICE ||--o{ APPOINTMENT_LINE : selects
 STAFF ||--o{ APPOINTMENT_LINE : performs
 APPOINTMENT ||--o{ SALE : originates
 SALE ||--|{ SALE_LINE : contains
 SALE ||--o{ PAYMENT : settles
 SALE_LINE ||--o{ COMMISSION_ACCRUAL : generates
 PRODUCT ||--o{ STOCK_MOVEMENT : changes
```
Cardinalidades propuestas, incluidas venta opcional y pagos múltiples; no reconstrucción de esquema real.
