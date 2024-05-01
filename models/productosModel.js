const db = require("../db");

class Producto {
  constructor(nombre_producto, precio, cantidad) {
    this.nombre_producto = nombre_producto;
    this.precio = precio;
    this.cantidad = cantidad;
  }

  static obtenerTodos(callback) {
    return db.query("SELECT * FROM productos", callback);
  }

  static obtenerPorId(id, callback) {
    return db.query("SELECT * FROM productos WHERE id = ?", [id], callback);
  }

  static crear(nuevoProducto, callback) {
    return db.query(
      "INSERT INTO productos (nombre_producto, precio, cantidad) VALUES (?, ?, ?)",
      [
        nuevoProducto.nombre_producto,
        nuevoProducto.precio,
        nuevoProducto.cantidad,
      ],
      callback
    );
  }

  static actualizar(id, producto, callback) {
    return db.query(
      "UPDATE productos SET nombre_producto = ?, precio = ?, cantidad = ? WHERE id = ?",
      [producto.nombre_producto, producto.precio, producto.cantidad, id],
      callback
    );
  }

  static eliminar(id, callback) {
    return db.query("DELETE FROM productos WHERE id = ?", [id], callback);
  }
}

module.exports = Producto;
