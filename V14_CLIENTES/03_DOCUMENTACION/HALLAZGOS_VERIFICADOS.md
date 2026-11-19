# Hallazgos y límites de la última grabación

## A. Ficha de cliente (0–45 s)
- Se abre un perfil lateral de **Jack Doe (ejemplo)** desde Clientes → Lista de clientes.
- Panel con identidad del cliente, botón **Acciones**, botón **Reservar ahora**, accesos para añadir pronombres y fecha de nacimiento y una fecha de creación visible.
- Navegación lateral dentro de la ficha: **Resumen, Citas, Ventas, Datos del cliente, Artículos, Registros (Comentarios, Alergias, Pruebas cutáneas, Formularios, Archivos), Billetera, Programa de fidelidad, Reseñas**.
- `Datos del cliente` (6 s) muestra nombre, email, teléfono, fecha de nacimiento, género, pronombres, unión y campos adicionales: origen, recomendado por, idioma preferido, país, ocupación, email adicional, teléfono adicional, etiquetas. Hay botón **Editar**, pero en esta grabación no se comprueba guardado de datos del perfil.
- `Artículos` tiene pestañas **Servicios, Productos, Membresías, Bonos**; se observan estados vacíos.
- `Registros`: aparecen categorías adicionales, incluida pruebas cutáneas; no se ha demostrado guardado de formularios o pruebas en este recorrido.
- `Billetera`: estado vacío en métodos de pago/recompensas; no se verifica un método de pago añadido.
- `Programa de fidelidad`: muestra un complemento promocional (no una prueba del motor de puntos/recompensas activo). El menú Acciones del perfil contiene opciones como añadir alerta de equipo, añadir comentario, alergia, pruebas cutáneas, formulario, etiqueta o recompensa, además de acciones de cliente; no se prueban todas.

## B. Segmentos de clientes (48–80 s)
- Acceso por Clientes → Segmentos de clientes, con pestañas **Estándar** y **Personalizado**, búsqueda por nombre y menús Acciones para segmentos.
- Segmentos estándar observados: `Primera visita` (sin citas pasadas y con cita futura); `Clientes fieles`; `Antiguos clientes`; `Clientes que más gastan`; `Próximos cumpleaños`.
- `Editar Clientes fieles` (55 s): entradas con umbral **2 ventas** y período **últimos 5 meses**, contador **Total de destinatarios: 0**. En opciones avanzadas hay control **Mostrar como distintivo en el perfil del cliente**. Se registra un aviso de **«Segmento actualizado correctamente»** al regresar a la lista (62–66 s).
- `Editar Clientes que más gastan` (68–72 s): formulario con umbral **500** y ventana **12 meses**, además de selector de tipo de compra (servicio/producto/tarjeta regalo/bono/membresía observables). Segundo aviso de actualización en pantalla. No se verifica efecto en número de clientes.
- Segmentos personalizados visibles: clientes que reservaron online, clientes con próximas citas, clientes con ventas, clientes importados; aparece opción **Añadir segmento**. No se verifica creación ni edición de un segmento personalizado.
- Conteos observados en segmentos mostrados: cero. No se puede inferir el algoritmo o la forma de actualización de membresías.

## C. Fidelización y reputación online (80–100.6 s)
- `Programa de fidelidad`: pantalla de activación/complemento con precio mostrado en la sesión y botón para empezar; no prueba que el sistema esté activo.
- `Reputación online`: resumen con valoración general **0,0**, total de reseñas **0**, índice de respuesta no informado; pestañas `Resumen`, `Todas las reseñas`, `Responder con IA`.
- Aparece tarjeta para **vincular cuenta de Google**, pero no se realiza la conexión.
- `Responder con IA`: aparece una pantalla vacía/promocional; no se ha demostrado una respuesta generada ni publicada.

## Estado de las pruebas
**Verificado en interacción visible:** navegación entre secciones, apertura de formularios de segmentación y confirmación de edición guardada de segmento estándar.
**Sólo disponible/visible:** funcionalidades de acciones del cliente, segmentos personalizados, fidelidad de pago, respuestas con IA, conexión a Google.
**Pendiente:** cambios reales de ficha, crear segmento personalizado, evaluar membresía efectiva a segmentos, acciones en masa, reseñas con datos reales, lógica de puntos, activación de complementos, auditoría de permisos.

## Advertencia técnica
No se captura tráfico HTTP, HTML íntegro, CSS ni JavaScript. No hay fuente para inferir endpoints reales, tablas internas o lógica de backend exacta.
