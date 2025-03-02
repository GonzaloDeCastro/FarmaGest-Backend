const db = require("../db");
const ItemVenta = require("./itemsVentaModel");

class Venta {
  constructor(cliente_id, usuario_id, fecha_hora, total, itemsAgregados) {
    this.cliente_id = cliente_id;
    this.usuario_id = usuario_id;
    this.fecha_hora = fecha_hora;
    this.total = total;
    this.itemsAgregados = itemsAgregados; // Array de items asociados a la venta
  }

  static obtenerTodasLasVentas(
    { page = 1, pageSize = 10, search = "", sesion },
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

          if (sesion) {
            db.query(
              `UPDATE sesiones SET ultima_actividad = NOW() WHERE sesion_id = ?`,
              [sesion],
              (err, resultado) => {
                if (err) {
                  console.error("Error al insertar usuario:", err);
                  return callback(err);
                }
              }
            );
          }
          callback(null, ventasConItems);
        });
      }
    );
  }

  static obtenerVentaConItemsPorId(venta_id, callback) {
    const queryVenta = `
      SELECT v.venta_id, v.fecha_hora, v.total, 
      c.nombre AS cliente_nombre,
      c.apellido AS cliente_apellido, 
      u.nombre AS usuario_nombre,
      u.apellido AS usuario_apellido
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
  static obtenerUltimaVenta(callback) {
    const queryVenta = `SELECT venta_id FROM ventas ORDER BY venta_id DESC LIMIT 1`;

    db.query(queryVenta, (err, resultados) => {
      if (err) return callback(err);
      if (resultados.length === 0) return callback(null, null); // No hay ventas registradas.

      // Asegurarte de que estás accediendo correctamente a venta_id de resultados
      const ventaId = resultados[0].venta_id;
      callback(null, ventaId); // Devuelve el ID directamente.
    });
  }

  static agregarVenta(nuevaVenta, itemsAgregados, callback) {
    // Primero, insertamos la venta
    const numeroFactura = nuevaVenta.numero_factura.toString().padStart(9, "0");
    db.query(
      "INSERT INTO ventas (cliente_id, usuario_id, fecha_hora, total, numero_factura) VALUES (?, ?, ?, ?, ?)",
      [
        nuevaVenta.cliente_id,
        nuevaVenta.usuario_id,
        nuevaVenta.fecha_hora,
        nuevaVenta.total,
        numeroFactura,
      ],
      (error, resultadoVenta) => {
        if (error) {
          console.error("Error al insertar venta:", error);
          return callback(error);
        }

        // Si la venta se inserta correctamente, procedemos con los items
        const ventaId = resultadoVenta.insertId;
        // Preparamos las queries para insertar cada item
        itemsAgregados.forEach((item) => {
          db.query(
            "INSERT INTO items_venta (venta_id, producto_id, cantidad, precio_unitario, total_item) VALUES (?, ?, ?, ?, ?)",
            [ventaId, item.productoId, item.cantidad, item.precio, item.total],
            (err) => {
              if (err) {
                console.error("Error al insertar item de venta:", err);
                return callback(err); // En caso de error, devolver el error
              }
              db.query(
                "UPDATE productos SET stock = stock - ? WHERE producto_id = ?",
                [item.cantidad, item.productoId], // Evita que el stock sea negativo
                (err, result) => {
                  if (err) {
                    console.error(
                      "Error al actualizar el stock del producto:",
                      err
                    );
                    return callback(err);
                  }

                  /*  if (result.affectedRows === 0) {
                    console.warn(
                      `Stock insuficiente para el producto ID ${item.productoId}`
                    );
                  } */
                }
              );
            }
          );
        });

        // Si todo es correcto, devolvemos el ID de la venta
        callback(null, ventaId);
      }
    );
  }
}

module.exports = Venta;
