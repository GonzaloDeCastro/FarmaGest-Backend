const db = require("../db");

class Usuario {
  constructor(nombre, apellido, correo_electronico, compania, cuit) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo_electronico = correo_electronico;
    this.compania = compania;
    this.cuit = cuit;
  }

  static obtenerTodos(callback) {
    return db.query(
      `
    SELECT p.usuario_id, p.nombre_usuario as Usuario, p.precio as Precio, p.cantidad as Cantidad,  u.compania as Compania
    FROM usuarios as p LEFT JOIN usuarios as u on p.proveedor_id = u.usuario_id`,
      callback
    );
  }

  static obtenerPorId(usuario_id, callback) {
    return db.query(
      "SELECT * FROM usuarios WHERE usuario_id = ?",
      [usuario_id],
      callback
    );
  }

  static crear(nuevoUsuario, callback) {
    return db.query(
      "INSERT INTO usuarios (nombre_usuario, precio, cantidad) VALUES (?, ?, ?)",
      [nuevoUsuario.nombre_usuario, nuevoUsuario.precio, nuevoUsuario.cantidad],
      callback
    );
  }

  static actualizar(usuario_id, usuario, callback) {
    return db.query(
      "UPDATE usuarios SET nombre_usuario = ?, precio = ?, cantidad = ? WHERE usuario_id = ?",
      [usuario.nombre_usuario, usuario.precio, usuario.cantidad, usuario_id],
      callback
    );
  }

  static eliminar(usuario_id, callback) {
    return db.query(
      "DELETE FROM usuarios WHERE usuario_id = ?",
      [usuario_id],
      callback
    );
  }
}

module.exports = Usuario;
