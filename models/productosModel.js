const db = require("../db");

// Modelo de Producto
const Producto = {
  // Obtener todos los productos
  obtenerTodos: function (callback) {
    return db.query("SELECT * FROM productos", callback);
  },

  // Obtener un producto por su ID
  obtenerPorId: function (id, callback) {
    return db.query("SELECT * FROM productos WHERE id = ?", [id], callback);
  },

  // Crear un nuevo producto
  crear: function (nuevoProducto, callback) {
    return db.query(
      "INSERT INTO productos (nombre_producto, precio, cantidad) VALUES (?, ?, ?)",
      [
        nuevoProducto.nombre_producto,
        nuevoProducto.precio,
        nuevoProducto.cantidad,
      ],
      callback
    );
  },

  // Actualizar un producto existente
  actualizar: function (id, producto, callback) {
    return db.query(
      "UPDATE productos SET nombre_producto = ?, precio = ?, cantidad = ? WHERE id = ?",
      [producto.nombre_producto, producto.precio, producto.cantidad, id],
      callback
    );
  },

  // Eliminar un producto
  eliminar: function (id, callback) {
    return db.query("DELETE FROM productos WHERE id = ?", [id], callback);
  },
};

module.exports = Producto;
