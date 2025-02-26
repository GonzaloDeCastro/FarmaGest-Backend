const db = require("../db");

class Producto {
  constructor(nombre, codigo, marca, categoria_id, stock, precio) {
    this.nombre = nombre;
    this.codigo = codigo;
    this.marca = marca;
    this.categoria_id = categoria_id;
    this.stock = stock;
    this.precio = precio;
  }

  static obtenerProductos(
    page = 0,
    pageSize = 6,
    search = "",
    sesion,
    callback
  ) {
    const offset = (page - 1) * pageSize;

    const searchQuery = search ? `%${search}%` : "%";

    let query = `
      SELECT p.producto_id, p.nombre as Nombre, p.codigo as Codigo, p.marca as Marca, p.stock as Stock, p.precio as Precio, c.categoria_id, c.nombre as Categoria 
      FROM productos as p
      LEFT JOIN categorias as c on c.categoria_id = p.categoria_id
      WHERE (p.nombre LIKE ? OR p.codigo LIKE ? OR p.marca LIKE ?)
    `;
    const params = [searchQuery, searchQuery, searchQuery];
    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

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
    return db.query(query, params, callback);
  }

  static agregarProducto(nuevoProducto, usuario_id, callback) {
    db.query(
      "INSERT INTO productos (nombre, codigo, marca, categoria_id, stock, precio) VALUES (?, ?, ?, ?, ?,?)",
      [
        nuevoProducto.nombre,
        nuevoProducto.codigo,
        nuevoProducto.marca,
        nuevoProducto.categoria_id,
        nuevoProducto.stock,
        nuevoProducto.precio,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        db.query(
          `INSERT INTO auditoria_productos (producto_id, accion, detalle_cambio, fecha_movimiento, usuario_id) VALUES (?, 'CREAR', 'Se ha creado un nuevo producto ${nuevoProducto.nombre} → Código ${nuevoProducto.codigo}', NOW(), ?)`,
          [result.insertId, usuario_id], // usuario_id por defecto 1 si no está disponible
          (err) => {
            if (err) {
              console.error("Error al registrar en auditoría:", err);
            }
          }
        );
        callback(null, { id: result.insertId, ...nuevoProducto });
      }
    );
  }

  static actualizarProducto(producto_id, producto, callback) {
    // 1️⃣ Obtener el producto actual antes de la actualización
    db.query(
      "SELECT * FROM productos WHERE producto_id = ?",
      [producto_id],
      (err, resultados) => {
        if (err) {
          return callback(err, null);
        }

        if (resultados.length === 0) {
          return callback(new Error("Producto no encontrado"), null);
        }

        const productoActual = resultados[0];
        let detalle_cambio = "";

        // 2️⃣ Comparar campo por campo y generar la descripción del cambio
        if (producto.nombre !== productoActual.nombre) {
          detalle_cambio += `Nombre: ${productoActual.nombre} → ${producto.nombre}; `;
        }
        if (producto.codigo !== productoActual.codigo) {
          detalle_cambio += `Código: ${productoActual.codigo} → ${producto.codigo}; `;
        }
        if (producto.marca !== productoActual.marca) {
          detalle_cambio += `Marca: ${productoActual.marca} → ${producto.marca}; `;
        }
        if (producto.categoria_id !== productoActual.categoria_id) {
          detalle_cambio += `Categoría: ${productoActual.categoria_id} → ${producto.categoria_id}; `;
        }
        if (producto.stock !== productoActual.stock) {
          detalle_cambio += `Stock: ${productoActual.stock} → ${producto.stock}; `;
        }
        if (producto.precio !== productoActual.precio) {
          detalle_cambio += `Precio: ${productoActual.precio} → ${producto.precio}; `;
        }

        // 4️⃣ Ejecutar la actualización en la base de datos
        db.query(
          "UPDATE productos SET nombre = ?, codigo = ?, marca = ?, categoria_id = ?, stock = ?, precio = ? WHERE producto_id = ?",
          [
            producto.nombre,
            producto.codigo,
            producto.marca,
            producto.categoria_id,
            producto.stock,
            producto.precio,
            parseInt(producto_id),
          ],
          callback
        );

        if (detalle_cambio !== "") {
          db.query(
            "INSERT INTO auditoria_productos (producto_id, accion, detalle_cambio, fecha_movimiento, usuario_id) VALUES (?, 'ACTUALIZAR', ?, NOW(), ?)",
            [producto_id, detalle_cambio, producto.usuario_id], // usuario_id por defecto 1 si no está disponible
            (err) => {
              if (err) {
                console.error("Error al registrar en auditoría:", err);
              }
            }
          );
        }
      }
    );
  }

  static eliminarProducto(
    producto_id,
    usuario_id,
    productoNombre,
    productoCodigo,
    callback
  ) {
    db.query(
      `INSERT INTO auditoria_productos (producto_id, accion, fecha_movimiento,detalle_cambio, usuario_id) VALUES (?, 'ELIMINAR', NOW(),'Se ha eliminado este producto ${productoNombre} → Código ${productoCodigo}',?)`,
      [producto_id, usuario_id],
      (err) => {
        if (err) {
          console.error("Error al registrar en auditoría:", err);
        }
      }
    );

    return db.query(
      "DELETE FROM productos WHERE producto_id = ?",
      [producto_id],
      callback
    );
  }

  static obtenerCategorias(callback) {
    return db.query("SELECT categoria_id, nombre FROM categorias", callback);
  }
}

module.exports = Producto;
