# Ventas / pagos — alcance parcial

**Fuente:** `REGISTRO_VENTA` y exploración `EXPLORACION_GLOBAL`, además de las capturas de Ventas/Citas del usuario.

### Observado en interfaz
- Registro de venta con selección de servicios y categorías, carrito lateral y total.
- Navegación a paso de cobro (`Carrito → Propina → Pago`) en las sesiones grabadas.
- Selección de forma de pago: efectivo, tarjeta, dividido y otros métodos visibles; sale opción de guardar venta pendiente de pago.
- Ventas/Borradores como secciones separadas.

### No confundir
La presencia de un botón de pago o mensaje de guardado no demuestra reconciliación contable, distribución de propinas, descuento de existencias, asientos internos ni transición de cita a venta en todas las condiciones. Para implementar esas partes deberán tomarse decisiones propias o realizar pruebas adicionales.

### UX
División de pantalla en catálogo a la izquierda y carrito/resumen a la derecha; CTA claro de avanzar; navegación escalonada que concentra una decisión por paso; mantener visible el total al cambiar de sección. Estados vacíos en pestañas sin elementos.
