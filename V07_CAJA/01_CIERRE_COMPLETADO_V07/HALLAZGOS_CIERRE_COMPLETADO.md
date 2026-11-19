# FRESHA - Cierre de caja verificado (V07)

**Fuente primaria:** `01_CIERRE_COMPLETADO_V07/VIDEO_ORIGINAL.mp4` (76.8 segundos, pantalla móvil).

Esta versión agrega el **cierre exitoso** de la caja registradora y conserva V06 como respaldo anidado. Trabajar con la evidencia en orden V04–V07, sin contar dos veces resultados repetidos.

## Hallazgos principales

1. El saldo teórico de caja antes del arqueo era **2,150 MXN**; corresponde a la secuencia anterior de efectivo inicial 2,000, entrada 200 y salida 50.
2. En el formulario de cierre, el usuario puede introducir una **cantidad contada**. La grabación muestra **1,000 MXN**; la interfaz calcula una **diferencia de -1,150 MXN** frente al previsto.
3. El cierre incluye campos distintos para **importe de efectivo al cierre** (dinero reservado para próxima apertura) y **efectivo que transferir al banco**, además de comentario.
4. Con **2,000 MXN** en 'importe al cierre' y **1,000 MXN** como contado, aparece validación roja: **'El importe de efectivo al cierre es mayor que el efectivo contabilizado'**.
5. Tras modificar el importe al cierre, el sistema muestra la confirmación **'Caja registradora cerrada'** y cambia el estado a **Cerrada** (se observa a los ~54-56 s). La ficha de la caja cerrada muestra **1,000 MXN** como 'Saldo de Caja de'. No confundir este número con el saldo teórico histórico **2,150 MXN**, que aparece en la sección 'Pagos/Previsión'.
6. En el detalle de la caja cerrada hay opciones **Ver actividad, Ver informe, Reabrir caja registradora cerrada** y exportar actividad como **PDF, Excel, CSV**.
7. El enlace 'Ver informe' lleva a un informe ('Resumen de la caja registradora') que en la configuración de filtros observada muestra **'No se han encontrado resultados'**. Eso no demuestra ausencia de registro; puede depender de filtros o del acceso.

## Comprobado frente a no comprobado

**Comprobado en video:** apertura previa, cálculo del previsto, conteo, diferencia negativa, mensaje de validación, cambio final a Cerrada, detalle histórico, opciones de reapertura/exportación visibles.

**No comprobado:** descarga real de PDF/Excel/CSV; funcionamiento de reapertura; destino final y consistencia contable de los importes reservados/transferidos; comportamiento al crear una nueva sesión; aplicación de permisos; modificación de la caja por otros usuarios; contratos de API o código interno.

**Advertencia:** la cantidad del banco y el importe reservado se editan durante la grabación; usar las capturas y el video para determinar los valores en cada instante. No inferir reglas de conciliación a partir de campos intermedios.

Ver también `03_CODEX_HANDOFF/ANALISIS_Y_PRUEBAS_PARA_CODEX.md`.
