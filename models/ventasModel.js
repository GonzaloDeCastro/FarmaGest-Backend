const db = require("../db");
const ItemVenta = require("./itemsVentaModel");

class Venta {
  constructor(cliente_id, usuario_id, fecha, total, items) {
    this.cliente_id = cliente_id;
    this.usuario_id = usuario_id;
    this.fecha = fecha;
    this.total = total;
    this.items = items; // Array de items asociados a la venta
  }

  static crearVentaConItems(nuevaVenta, callback) {
    const queryVenta = `
      INSERT INTO ventas (cliente_id, usuario_id, fecha, total, numero_factura)
      VALUES (?, ?, ?, ?, ?)
    `;
    const paramsVenta = [
      nuevaVenta.cliente_id,
      nuevaVenta.usuario_id,
      nuevaVenta.fecha,
      nuevaVenta.total,
      nuevaVenta.numero_factura,
    ];

    db.query(queryVenta, paramsVenta, (err, resultado) => {
      if (err) return callback(err);

      const ventaId = resultado.insertId;
      const items = nuevaVenta.items.map((item) => ({
        ...item,
        venta_id: ventaId,
      }));

      ItemVenta.agregarItems(items, (err) => {
        if (err) return callback(err);
        callback(null, ventaId);
      });
    });
  }
  static obtenerTodasLasVentas(
    { page = 1, pageSize = 10, search = "" },
    callback
  ) {
    const offset = (page - 1) * pageSize;
    const searchQuery = `%${search}%`;

    const queryVentas = `
      SELECT v.venta_id, v.fecha_hora,v.numero_factura, c.nombre AS cliente_nombre, 
      c.apellido AS cliente_apellido, u.nombre AS usuario_nombre,u.apellido AS usuario_apellido, v.total
      FROM ventas v
      JOIN clientes c ON v.cliente_id = c.cliente_id
      JOIN usuarios u ON v.usuario_id = u.usuario_id
      WHERE c.nombre LIKE ? OR u.nombre LIKE ?
      ORDER BY v.fecha_hora DESC
      LIMIT ? OFFSET ?
    `;

    db.query(
      queryVentas,
      [searchQuery, searchQuery, pageSize, offset],
      (err, ventas) => {
        if (err) return callback(err);

        if (ventas.length === 0) {
          return callback(null, []);
        }

        const ventaIds = ventas.map((venta) => venta.venta_id);

        const queryItems = `
        SELECT iv.venta_id, iv.producto_id, p.nombre AS producto_nombre, iv.cantidad, iv.precio_unitario, iv.total_item
        FROM items_venta iv
        JOIN productos p ON iv.producto_id = p.producto_id
        WHERE iv.venta_id IN (?)
      `;

        db.query(queryItems, [ventaIds], (err, items) => {
          if (err) return callback(err);

          const ventasConItems = ventas.map((venta) => {
            const itemsDeVenta = items.filter(
              (item) => item.venta_id === venta.venta_id
            );
            return { ...venta, items: itemsDeVenta };
          });

          callback(null, ventasConItems);
        });
      }
    );
  }

  static obtenerVentaConItemsPorId(venta_id, callback) {
    const queryVenta = `
      SELECT v.venta_id, v.fecha_hora, v.total, c.nombre AS cliente_nombre, u.nombre AS usuario_nombre
      FROM ventas v
      JOIN clientes c ON v.cliente_id = c.cliente_id
      JOIN usuarios u ON v.usuario_id = u.usuario_id
      WHERE v.venta_id = ?
    `;

    db.query(queryVenta, [venta_id], (err, resultados) => {
      if (err) return callback(err);
      if (resultados.length === 0) return callback(null, null);

      const venta = resultados[0];

      ItemVenta.obtenerItemsPorVenta(venta_id, (err, items) => {
        if (err) return callback(err);
        venta.items = items;
        callback(null, venta);
      });
    });
  }

  // Otros métodos permanecen iguales...
}

module.exports = Venta;
