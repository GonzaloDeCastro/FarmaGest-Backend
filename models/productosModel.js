const db = require("../db");

class Producto {
  constructor(nombre_producto, precio, cantidad, compania) {
    this.nombre_producto = nombre_producto;
    this.precio = precio;
    this.cantidad = cantidad;
    this.compania = compania;
  }

  static obtenerTodos(page, pageSize, search, callback) {
    const offset = (page - 1) * pageSize;
    const searchQuery = search ? `%${search}%` : "%";
    return db.query(
      `
    SELECT p.producto_id, p.nombre_producto as Producto, p.precio as Precio, p.cantidad as Cantidad,  u.usuario_id as UsuarioID, u.compania as Compania
    FROM productos as p LEFT JOIN usuarios as u on p.proveedor_id = u.usuario_id 
    WHERE p.nombre_producto LIKE ? OR p.precio LIKE ? OR p.cantidad LIKE ? OR u.compania LIKE ?
      LIMIT ? OFFSET ?;`,
      [searchQuery, searchQuery, searchQuery, searchQuery, pageSize, offset],
      callback
    );
  }

  static obtenerPorId(producto_id, callback) {
    return db.query(
      "SELECT * FROM productos WHERE producto_id = ?",
      [producto_id],
      callback
    );
  }

  static crear(nuevoProducto, callback) {
    return db.query(
      "INSERT INTO productos (nombre_producto, precio, cantidad, proveedor_id) VALUES (?, ?, ?, ?)",
      [
        nuevoProducto.nombre_producto,
        nuevoProducto.precio,
        nuevoProducto.cantidad,
        nuevoProducto.proveedor_id,
      ],
      callback
    );
  }

  static actualizar(producto_id, producto, callback) {
    return db.query(
      "UPDATE productos SET nombre_producto = ?, precio = ?, cantidad = ?, proveedor_id = ? WHERE producto_id = ?",
      [
        producto.nombre_producto,
        producto.precio,
        producto.cantidad,
        producto.proveedor_id,
        producto_id,
      ],
      callback
    );
  }

  static eliminar(producto_id, callback) {
    return db.query(
      "DELETE FROM productos WHERE producto_id = ?",
      [producto_id],
      callback
    );
  }
}

module.exports = Producto;
