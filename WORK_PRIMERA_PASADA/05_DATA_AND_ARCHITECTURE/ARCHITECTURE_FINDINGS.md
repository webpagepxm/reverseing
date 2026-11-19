# Arquitectura
OBSERVADO: navegación modular e interdependencia cliente-cita-POS-reporte; cupones vinculan catálogo/clientes/ventas; automatizaciones se describen por eventos.
INFERIDO: modelo modular con módulos clientes, catálogo, disponibilidad, reservas, ventas, stock, remuneración, comunicaciones, analítica.
DESCONOCIDO: backend, lenguaje, cloud, tablas, servicios, colas, tenancy, APIs, consistencia, despliegue de Fresha.
Propuesta Codex: monolito modular inicial Next/TypeScript y PostgreSQL/Supabase con auth/RLS; transacciones para disponibilidad/pago/stock; outbox e idempotencia para simulación comunicaciones; métricas con timestamp de cómputo. Es una opción propia, no tecnología atribuida a Fresha.
