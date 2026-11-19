# Caja — especificación de comportamiento observado

**Fuentes:** `CAJA_MOVIL_01`, `CAJA_MOVIL_02`, `CAJA_OPERACIONES`, `CAJA_PRECIERRE`, `CAJA_CIERRE`, `CAJA_ROLLOVER`; capturas iniciales en `05_EVIDENCIAS/CAPTURAS_UI/`; documentos anteriores en `06_DOCUMENTOS_ORIGINALES/`.

## Flujo confirmado
1. Crear/configurar caja con nombre y reglas visibles. Algunas opciones permiten exigir caja abierta para ventas presenciales y mínimo de efectivo; efectos no probados.
2. Abrir caja y capturar importe inicial. Se genera estado **Abierta**, saldo y eventos de actividad.
3. Entrada manual: prueba real 2000 → **2200** al registrar +200, motivo «transferencia desde banco o caja fuerte».
4. Salida manual: prueba real 2200 → **2150** al registrar −50, motivo «gastos menores».
5. Actividad: registra al menos apertura, efectivo inicial, entrada y salida con actor/hora en el UI.
6. Cierre: formulario de arqueo con *Previsión, Contabilizado, Diferencia*, efectivo que queda para siguiente apertura, transferencia bancaria y comentario. En una sesión: 2150 previsto, 1000 contado, diferencia -1150 y cierre logrado. En otra sesión independiente: 2000 previsto, 300 contado, diferencia -1700; retenido 280, al banco 20.
7. Tras cerrar queda una sesión en el histórico; la siguiente apertura **sugiere 280** retenidos, pero se puede sustituir por 2820 (confirmado visualmente).

## Componentes UX
Lista de cajas → tarjeta de caja abierta + historial de cerradas → panel lateral de Resumen/Actividad → formularios contextuales Entrada/Salida/Cierre → confirmación → historial. Filtros de actividad incluyen tipo y empleado. Vista móvil usa panels verticales, action sheet/controles compactos.

## No probado
Cierre simultáneo por dos usuarios, edición/anulación de movimientos, autorización por roles, reporte PDF/CSV real, conciliación con pagos/ventas, reglas de caja mínima, fiscalidad y comportamiento al reabrir cierre anterior.

**Importante:** no sumar ni reconciliar valores de sesiones distintas. `CAJA_ROLLOVER` y `CAJA_CIERRE` muestran pruebas independientes.
