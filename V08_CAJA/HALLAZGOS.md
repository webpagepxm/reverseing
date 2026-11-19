# VIDEO 1 — Hallazgos de Caja registradora

**Duración:** 2 min 02.68 s.
**Identificación del usuario:** VIDEO 1 (corrige la denominación inicial «video 2»).

## Cronología observable (marcas aproximadas)

| Momento | Evidencia visual | Estado |
|---|---|---|
| 0–24 s | Caja abierta con saldo mostrado de **2,000 MXN** y controles «Ver», «Entrada de efectivo», «Salida de efectivo». | Observado |
| 28–36 s | Formulario de cierre con campos de arqueo, importe de efectivo al cierre, importe a transferir al banco y comentario. | Observado |
| ~51–56 s | La previsión de efectivo muestra 2,000 MXN y el conteo registrado muestra 300 MXN; aparece diferencia **−1,700 MXN**. Se indica 20 MXN para transferir y 280 MXN de efectivo al cierre. | Observado en pantalla, algunos campos se ajustan durante el flujo |
| 60–68 s | Caja pasa a estado «Cerrada». Resumen de caja cerrada e historial de actividad aparecen en panel lateral; historial contiene evento de cierre. | Verificado visualmente |
| ~84–94 s | Página de Caja muestra saldo 0 MXN con estado «Cerrada», acción «Abrir una caja registradora». | Observado |
| ~96 s | Formulario de nueva apertura muestra saldo sugerido **280 MXN**, acompañado de indicación de efectivo dejado de la caja anterior. | Observado |
| ~100–104 s | Se introduce **2,820 MXN** para la nueva apertura y se confirma. Aparece aviso «Caja registradora abierta» y caja con saldo **2,820 MXN**. | Verificado visualmente |
| ~108–116 s | La caja anterior aparece en el historial con saldo contabilizado de **300 MXN**, mientras la nueva caja permanece abierta con **2,820 MXN**. | Observado |

## Reglas verificadas por esta sesión

1. Fresha permite completar un cierre con diferencia negativa entre monto esperado y contabilizado. En esta sesión, previsto 2,000, contado 300 y diferencia -1,700 MXN.
2. El formulario de cierre permite separar efectivo retenido para próxima apertura y efectivo a transferir al banco. En la prueba observada, 280 y 20 MXN, respectivamente.
3. Tras cerrar una sesión, la caja se presenta como cerrada y ofrece abrir una sesión nueva.
4. El formulario de apertura siguiente sugiere el efectivo retenido de la sesión previa (**280 MXN**), que el usuario puede modificar antes de confirmar.
5. La nueva sesión puede abrirse con un importe diferente del sugerido: se introduce y muestra **2,820 MXN**.
6. La sesión cerrada continúa visible en el historial junto con la sesión nueva abierta.

## Limitaciones

- No se observan ventas reales ni vínculos entre cobro y saldo de caja en este video.
- La grabación no prueba permisos por rol, auditorías backend, reversión de cierres, edición de movimientos ni conciliación contable.
- La sugerencia de 280 MXN está comprobada visualmente en este caso; la regla general exacta para todos los escenarios requiere más pruebas.
- Ningún código de aplicación ni tráfico de red se inspeccionó en este video.
