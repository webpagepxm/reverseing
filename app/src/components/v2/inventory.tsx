"use client";

import { useState } from "react";
import { useQuery } from "../../lib/query";
import { byId, cents, currency, stockFor, todayAt, upsert, uuid, type Order, type Product, type StockCount } from "../../lib/v2/model";
import { commit, useDemo } from "../../lib/v2/store";
import { Heading, Panel } from "../ui";
import { Action, Choice, Details, Editor, Field, includes, numeric, Rows, Search, text } from "./common";

export function Inventory({ route }: { route: string }) {
  const demo = useDemo();
  const { params, update } = useQuery();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const selected = params.get("ficha");
  const mode = params.get("editar");
  const edit = selected === "nuevo" || mode === "1";
  const open = (id: string, editMode: string | null = null) => update({ ficha: id, editar: editMode });
  const close = () => update({ ficha: null, editar: null }, true);
  const add = (label: string) => <button className="button primary" onClick={() => open("nuevo")}>{label}</button>;
  const date = todayAt(byId(demo.branches, demo.branch)?.zone ?? demo.business.zone);
  const products = demo.products.filter((item) => item.branch === demo.branch);
  const tracked = products.filter((item) => item.tracked && !item.archived);

  if (route === "catalogo/proveedores") {
    const supplier = byId(demo.suppliers, selected ?? "");
    const rows = demo.suppliers.filter((item) => includes(item.name + " " + item.contact, query) && (!filter || (filter === "Activos") !== item.archived));
    return <>
      <Heading title="Proveedores" action={add("Nuevo proveedor")}/>
      <Search label="Buscar proveedores" value={query} set={setQuery}><label>Estado<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Todos</option><option>Activos</option><option>Archivados</option></select></label></Search>
      <Rows columns={["Proveedor", "Contacto", "Estado"]} rows={rows.map((item) => ({ ...item, values: [item.contact || "—", item.archived ? "Archivado" : "Activo"], open: () => open(item.id) }))}/>
      {edit && <Editor title={supplier ? "Editar proveedor" : "Nuevo proveedor"} close={close} save={(data) => commit((current) => {
        const name = text(data, "name");
        if (!name) throw Error("Introduce el nombre del proveedor.");
        return { ...current, suppliers: upsert(current.suppliers, { id: supplier?.id ?? uuid(), name, description: text(data, "description"), contact: text(data, "contact"), phone: text(data, "phone"), email: text(data, "email"), address: text(data, "address"), archived: supplier?.archived ?? false }) };
      })}><Field name="name" label="Nombre" value={supplier?.name} required/><Field name="description" label="Descripción" value={supplier?.description}/><Field name="contact" label="Contacto" value={supplier?.contact}/><Field name="phone" label="Teléfono" type="tel" value={supplier?.phone}/><Field name="email" label="Correo" type="email" value={supplier?.email}/><Field name="address" label="Dirección" value={supplier?.address}/></Editor>}
      {supplier && !edit && <Panel title="Ficha de proveedor" close={close}><div className="detail-hero"><h3>{supplier.name}</h3><p>{supplier.archived ? "Archivado" : "Activo"}</p></div>
        <Details fields={[["Descripción", supplier.description], ["Contacto", supplier.contact], ["Teléfono", supplier.phone], ["Correo", supplier.email], ["Dirección", supplier.address], ["Productos", demo.products.filter((item) => item.supplier === supplier.id).map((item) => item.name).join(", ")], ["Pedidos", demo.orders.filter((item) => item.supplier === supplier.id).length]]}/>
        <div className="actions"><button className="button" onClick={() => open(supplier.id, "1")}>Editar proveedor</button><Action label={supplier.archived ? "Reactivar proveedor" : "Archivar proveedor"} confirmation="¿Cambiar el estado del proveedor?" run={() => commit((current) => ({ ...current, suppliers: upsert(current.suppliers, { ...supplier, archived: !supplier.archived }) }))}/></div>
      </Panel>}
    </>;
  }

  if (route.endsWith("/recuentos")) {
    const count = byId(demo.counts, selected ?? "");
    const advance = (target: StockCount["status"]) => commit((current) => {
      if (!count) return current;
      const stored = byId(current.counts, count.id);
      if (!stored || stored.status !== count.status) return current;
      const stock = target === "Aplicado" ? stockFor(current, count.product) : count.expected;
      if (target === "Aplicado" && stock !== count.expected) throw Error("Cambió la existencia. Vuelve al conteo para actualizar el saldo esperado.");
      return { ...current, counts: upsert(current.counts, { ...stored, status: target, expected: target === "Conteo" ? stockFor(current, stored.product) : stored.expected }), stock: target === "Aplicado" ? [...current.stock, { id: count.id + "-ajuste", product: count.product, delta: count.counted - stock, date, kind: "Recuento", source: count.id }] : current.stock };
    });
    return <>
      <Heading title="Recuentos" action={tracked.length > 0 && add("Nuevo recuento")}/>
      <Rows columns={["Producto", "Esperado", "Contado", "Estado"]} rows={demo.counts.filter((item) => products.some((product) => product.id === item.product)).map((item) => ({ id: item.id, name: byId(products, item.product)!.name, values: [item.expected, item.counted, item.status], open: () => open(item.id) }))}/>
      {selected === "nuevo" && <Editor title="Nuevo recuento" close={close} save={(data) => commit((current) => {
        const product = text(data, "product");
        return { ...current, counts: [...current.counts, { id: uuid(), product, expected: stockFor(current, product), counted: 0, date, status: "Borrador" }] };
      })}><Choice name="product" label="Producto" items={tracked}/></Editor>}
      {count && mode === "conteo" && <Editor title="Registrar conteo" close={() => open(count.id)} label="Enviar a revisión" save={(data) => commit((current) => {
        const stored = byId(current.counts, count.id);
        if (!stored || stored.status !== "Conteo") throw Error("El recuento ya cambió de estado.");
        const counted = numeric(data, "counted");
        if (!Number.isInteger(counted) || counted < 0) throw Error("Introduce una cantidad entera válida.");
        return { ...current, counts: upsert(current.counts, { ...stored, counted, status: "Revisión" }) };
      })}><Field label="Cantidad contada" name="counted" type="number" min={0} value={count.counted} required/></Editor>}
      {count && mode !== "conteo" && <Panel title="Detalle de recuento" close={close}><Details fields={[["Producto", byId(demo.products, count.product)?.name], ["Estado", count.status], ["Esperado", count.expected], ["Contado", count.counted], ["Diferencia", count.counted - count.expected]]}/>
        <div className="actions">{count.status === "Borrador" && <Action label="Iniciar conteo" run={() => advance("Conteo")}/>}
          {count.status === "Conteo" && <button className="button" onClick={() => open(count.id, "conteo")}>Registrar conteo</button>}
          {count.status === "Revisión" && <><Action label="Volver al conteo" run={() => advance("Conteo")}/><Action label="Aplicar recuento" confirmation="¿Aplicar la diferencia al inventario?" run={() => advance("Aplicado")}/></>}
        </div>
      </Panel>}
    </>;
  }

  if (route.endsWith("/pedidos")) {
    const order = byId(demo.orders, selected ?? "");
    const suppliers = demo.suppliers.filter((item) => !item.archived);
    const status = (item: Order) => item.lines.every((line) => line.received === line.quantity) ? "Recibido" : item.lines.some((line) => line.received > 0) ? "Recepción parcial" : "Ordenado";
    return <>
      <Heading title="Pedidos de stock" action={tracked.length > 0 && suppliers.length > 0 && add("Nuevo pedido")}/>
      <Rows columns={["Proveedor", "Fecha", "Estado", "Remanente"]} rows={demo.orders.filter((item) => item.branch === demo.branch).map((item) => ({ id: item.id, name: byId(demo.suppliers, item.supplier)?.name ?? "Proveedor", values: [item.date, status(item), item.lines.reduce((sum, line) => sum + line.quantity - line.received, 0)], open: () => open(item.id) }))}/>
      {selected === "nuevo" && <Editor title="Nuevo pedido" close={close} label="Crear pedido" save={(data) => commit((current) => {
        const lines = tracked.map((product) => ({ product: product.id, quantity: numeric(data, product.id), received: 0 })).filter((line) => line.quantity > 0);
        if (!lines.length || lines.some((line) => !Number.isSafeInteger(line.quantity))) throw Error("Añade al menos un producto con cantidad entera.");
        return { ...current, orders: [...current.orders, { id: uuid(), supplier: text(data, "supplier"), branch: current.branch, date, lines }] };
      })}><Choice name="supplier" label="Proveedor" items={suppliers}/>{tracked.map((item) => <Field key={item.id} name={item.id} label={"Cantidad de " + item.name} type="number" value={0} min={0} max={100000}/>)}</Editor>}
      {order && mode === "recibir" && <Editor title="Registrar recepción" close={() => open(order.id)} label="Confirmar recepción" save={(data) => commit((current) => {
        const stored = byId(current.orders, order.id)!;
        const deltas = stored.lines.map((line) => ({ product: line.product, quantity: numeric(data, line.product), remaining: line.quantity - line.received }));
        if (!deltas.some((line) => line.quantity > 0) || deltas.some((line) => !Number.isInteger(line.quantity) || line.quantity < 0 || line.quantity > line.remaining)) throw Error("Introduce cantidades válidas dentro del remanente.");
        const id = uuid();
        return { ...current, orders: upsert(current.orders, { ...stored, lines: stored.lines.map((line, index) => ({ ...line, received: line.received + deltas[index].quantity })) }), stock: [...current.stock, ...deltas.filter((line) => line.quantity > 0).map((line) => ({ id: id + line.product, product: line.product, delta: line.quantity, date, kind: "Recepción", source: stored.id }))] };
      })}>{order.lines.map((line) => <Field key={line.product} name={line.product} label={"Recibir " + byId(demo.products, line.product)?.name} type="number" value={0} min={0} max={line.quantity - line.received}/>)}</Editor>}
      {order && mode !== "recibir" && <Panel title="Detalle de pedido" close={close}><Details fields={[["Proveedor", byId(demo.suppliers, order.supplier)?.name], ["Fecha", order.date], ["Estado", status(order)]]}/>
        <Rows columns={["Producto", "Pedido", "Recibido", "Remanente"]} rows={order.lines.map((line) => ({ id: line.product, name: byId(demo.products, line.product)?.name ?? "Producto", values: [line.quantity, line.received, line.quantity - line.received] }))}/>
        {status(order) !== "Recibido" && <div className="actions"><button className="button primary" onClick={() => open(order.id, "recibir")}>Registrar recepción</button></div>}
      </Panel>}
    </>;
  }

  const product = byId(products, selected ?? "");
  const onlyStock = route === "catalogo/inventario";
  const rows = products.filter((item) => (!onlyStock || item.tracked) && includes(item.name + " " + item.sku + " " + item.category, query) && (!filter || (filter === "Activos") !== item.archived));
  return <>
    <Heading title={onlyStock ? "Existencias" : "Productos"} action={!onlyStock && add("Nuevo producto")}/>
    <Search label="Buscar por producto o SKU" value={query} set={setQuery}><label>Estado<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Todos</option><option>Activos</option><option>Archivados</option></select></label></Search>
    <Rows columns={["Producto", "Existencias", "SKU", "Categoría", "Precio", "Proveedor", "Sucursal", "Estado"]} rows={rows.map((item) => ({ ...item, values: [item.tracked ? stockFor(demo, item.id) : "—", item.sku, item.category, currency(item.price), byId(demo.suppliers, item.supplier)?.name ?? "—", byId(demo.branches, item.branch)?.name, item.archived ? "Archivado" : "Activo"], open: () => open(item.id) }))}/>
    {!onlyStock && edit && <Editor title={product ? "Editar producto" : "Nuevo producto"} close={close} save={(data) => commit((current) => {
      const next: Product = { id: product?.id ?? uuid(), name: text(data, "name"), sku: text(data, "sku"), category: text(data, "category"), description: text(data, "description"), price: cents(data.get("price")), supplier: text(data, "supplier"), branch: product?.branch ?? text(data, "branch"), tracked: product?.tracked ?? data.has("tracked"), archived: product?.archived ?? false };
      if (!next.name || !next.sku || !next.category || !Number.isSafeInteger(next.price) || next.price < 0) throw Error("Revisa el nombre, el SKU, la categoría y el precio.");
      if (current.products.some((item) => item.id !== next.id && item.branch === next.branch && item.sku.toLowerCase() === next.sku.toLowerCase())) throw Error("Ya existe ese SKU en la sucursal.");
      const quantity = numeric(data, "stock");
      if (!Number.isSafeInteger(quantity) || quantity < 0 || (!next.tracked && quantity > 0)) throw Error("El saldo inicial requiere seguimiento de existencias y una cantidad válida.");
      return { ...current, products: upsert(current.products, next), stock: !product && next.tracked ? [...current.stock, { id: next.id + "-inicial", product: next.id, delta: quantity, date, kind: "Saldo inicial", source: next.id }] : current.stock };
    })}><Field name="name" label="Nombre" value={product?.name} required/><Field name="sku" label="SKU" value={product?.sku} required/><Field name="category" label="Categoría" value={product?.category} required/><Field name="description" label="Descripción" value={product?.description}/><Field name="price" label="Precio (MXN)" type="number" value={(product?.price ?? 0) / 100} min={0} step={.01} required/>
      <Choice name="supplier" label="Proveedor" items={demo.suppliers.filter((item) => !item.archived || item.id === product?.supplier)} value={product?.supplier} blank="Sin proveedor"/>
      {!product && <><Choice name="branch" label="Sucursal" items={demo.branches} value={demo.branch}/><label className="inline-check"><input type="checkbox" name="tracked" defaultChecked/>Seguimiento de existencias</label><Field name="stock" label="Stock inicial" type="number" min={0} value={0} required/></>}
    </Editor>}
    {product && !edit && <Panel title={onlyStock ? "Movimientos de inventario" : "Ficha de producto"} close={close}><div className="detail-hero"><h3>{product.name}</h3><p>{product.sku} · {product.archived ? "Archivado" : "Activo"}</p></div><Details fields={[["Descripción", product.description], ["Precio", currency(product.price)], ["Existencias", product.tracked ? stockFor(demo, product.id) : "Sin seguimiento"], ["Proveedor", byId(demo.suppliers, product.supplier)?.name]]}/>
      {!onlyStock && <div className="actions"><button className="button" onClick={() => open(product.id, "1")}>Editar producto</button><Action label={product.archived ? "Reactivar producto" : "Archivar producto"} confirmation="¿Cambiar la disponibilidad del producto?" run={() => commit((current) => ({ ...current, products: upsert(current.products, { ...product, archived: !product.archived }) }))}/></div>}
      <Rows columns={["Movimiento", "Unidades", "Fecha"]} rows={demo.stock.filter((item) => item.product === product.id).toReversed().map((item) => ({ id: item.id, name: item.kind, values: [item.delta, item.date] }))}/>
    </Panel>}
  </>;
}
