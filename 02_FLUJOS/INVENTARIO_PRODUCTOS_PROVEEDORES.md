# Inventario, productos y proveedores

**Fuente:** `INVENTARIO_PROVEEDORES` y archivos originales V11.

### Producto — guardado verificado
Formulario con nombre, código de barras (aviso de unicidad), marca y modal crear marca, unidad/cantidad, descripciones, categoría y alta contextual, precios de compra/venta, impuesto, margen, toggle comisión de personal, SKU manual/automático, proveedor, controlar stock, stock actual, mínimo, cantidad a reponer, alertas y foto. En la prueba se guarda un producto con **stock 12** y precio público **123 MXN**, mostrando «Producto creado». Un intento anterior muestra validación general de errores, pero no identifica los campos inválidos individualmente.

### Proveedor — guardado verificado
Se navega al catálogo y se da de alta un proveedor de prueba, con confirmación de creación.

### Recuento — solo iniciado
Se crea/inicia un recuento que aparece listado, pero no se comprueba finalización ni modificación de stock.

### No probado
Vincular efectivamente proveedor al artículo, pedidos, recepciones, transacciones de stock, movimiento con venta/reembolso, caducidad, validación SKU duplicado y permisos de inventario.
