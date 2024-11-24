const db = require("../db");

class Reporte {
  constructor(cliente_id, usuario_id, fecha_hora, total, itemsAgregados) {
    this.cliente_id = cliente_id;
    this.usuario_id = usuario_id;
    this.fecha_hora = fecha_hora;
    this.total = total;
    this.itemsAgregados = itemsAgregados; // Array de items asociados a la venta
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

        db.query(queryItems, [ventaIds], (err, itemsAgregados) => {
          if (err) return callback(err);

          const ventasConItems = ventas.map((venta) => {
            const itemsDeVenta = itemsAgregados.filter(
              (item) => item.venta_id === venta.venta_id
            );
            return { ...venta, itemsAgregados: itemsDeVenta };
          });

          callback(null, ventasConItems);
        });
      }
    );
  }
}

module.exports = Reporte;
