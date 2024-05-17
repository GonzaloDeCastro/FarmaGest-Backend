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
    SELECT usuario_id, nombre as Nombre, apellido as Apellido, correo_electronico as Email,compania as Compania
    FROM usuarios`,
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
      "INSERT INTO usuarios (nombre, apellido, correo) VALUES (?, ?, ?)",
      [nuevoUsuario.nombre, nuevoUsuario.apellido, nuevoUsuario.correo],
      callback
    );
  }

  static actualizar(usuario_id, usuario, callback) {
    return db.query(
      "UPDATE usuarios SET nombre = ?, apellido = ?, correo = ? WHERE usuario_id = ?",
      [usuario.nombre, usuario.apellido, usuario.correo, usuario_id],
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
