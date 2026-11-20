export const scope = "/b/estudio-mambo/s/roma-norte";

export const modules = [
  { name: "Agenda", href: "agenda", sections: [{ name: "Calendario", href: "agenda" }] },
  { name: "Clientes", href: "clientes", sections: [{ name: "Lista de clientes", href: "clientes" }] },
  { name: "Catálogo", href: "catalogo/servicios", sections: [{ name: "Servicios", href: "catalogo/servicios" }] },
  { name: "Equipo", href: "equipo", sections: [{ name: "Miembros", href: "equipo" }, { name: "Turnos", href: "equipo/turnos" }] },
  { name: "Configuración", href: "configuracion/negocio", sections: [{ name: "Negocio", href: "configuracion/negocio" }, { name: "Sucursales", href: "configuracion/sucursales" }, { name: "Accesos", href: "configuracion/accesos" }] },
];
