export const scope = "/b/estudio-mambo/s/roma-norte";

function module(name: string, sections: [string, string][]) {
  return { name, href: sections[0][1], sections: sections.map(([name, href]) => ({ name, href })) };
}

export const modules = [
  module("Inicio", [["Resumen", "inicio"]]),
  module("Agenda", [["Calendario", "agenda"]]),
  module("Ventas", [["Resumen", "ventas/resumen"], ["Ventas", "ventas"], ["Borradores", "ventas/borradores"], ["Nueva venta", "ventas/nueva"], ["Citas", "ventas/citas"], ["Pagos", "ventas/pagos"], ["Artículos vendidos", "ventas/articulos"], ["Caja", "ventas/caja"]]),
  module("Clientes", [["Lista de clientes", "clientes"], ["Segmentos", "clientes/segmentos"]]),
  module("Catálogo", [["Servicios", "catalogo/servicios"], ["Categorías", "catalogo/categorias"], ["Productos", "catalogo/productos"], ["Existencias", "catalogo/inventario"], ["Recuentos", "catalogo/inventario/recuentos"], ["Pedidos", "catalogo/inventario/pedidos"], ["Proveedores", "catalogo/proveedores"]]),
  module("Equipo", [["Miembros", "equipo"], ["Turnos", "equipo/turnos"], ["Asignaciones", "equipo/asignaciones"], ["Comisiones", "equipo/comisiones"], ["Liquidaciones", "equipo/liquidaciones"]]),
  module("Informes", [["Biblioteca", "informes"], ["Citas", "informes/citas"], ["Ventas", "informes/ventas"], ["Caja", "informes/caja"], ["Inventario", "informes/inventario"], ["Equipo", "informes/equipo"], ["Paneles", "informes/paneles"]]),
  module("Configuración", [["Negocio", "configuracion/negocio"], ["Sucursales", "configuracion/sucursales"], ["Accesos", "configuracion/accesos"], ["Preferencias", "configuracion/preferencias"]]),
];

export function href(route: string, params?: Record<string, string>) {
  return scope + "/" + route + "/" + (params ? "?" + new URLSearchParams(params).toString() : "");
}
