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

  static obtenerProductos(page = 0, pageSize = 6, search = "", callback) {
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

    return db.query(query, params, callback);
  }

  static agregarProducto(nuevoProducto, callback) {
    return db.query(
      "INSERT INTO productos (nombre, codigo, marca, categoria_id, stock, precio) VALUES (?, ?, ?, ?, ?,?)",
      [
        nuevoProducto.nombre,
        nuevoProducto.codigo,
        nuevoProducto.marca,
        nuevoProducto.categoria_id,
        nuevoProducto.stock,
        nuevoProducto.precio,
      ],
      callback
    );
  }

  static actualizarProducto(producto_id, producto, callback) {
    return db.query(
      "UPDATE productos SET nombre = ?, codigo = ?, marca = ?, categoria_id = ?, stock = ? ,precio = ? WHERE producto_id = ?",
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
  }

  static eliminarProducto(producto_id, callback) {
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
