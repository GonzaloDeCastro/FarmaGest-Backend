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
    SELECT u.usuario_id, u.nombre as Nombre, u.apellido as Apellido, u.correo_electronico as Email,r.descripcion as Rol, u.compania as Compania
    FROM usuarios AS u 
    JOIN usuario_roles AS ur ON ur.usuario_id = u.usuario_id
    JOIN roles AS r ON r.rol_id = ur.rol_id`,
      callback
    );
  }

  static obtenerRoles(callback) {
    return db.query(
      `
    SELECT rol_id, descripcion
    FROM roles 
    `,
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
      "INSERT INTO usuarios (nombre, apellido, correo_electronico) VALUES (?, ?, ?)",
      [
        nuevoUsuario.nombre,
        nuevoUsuario.apellido,
        nuevoUsuario.correo_electronico,
      ],
      callback
    );
  }

  static actualizar(usuario_id, usuario, callback) {
    return db.query(
      "UPDATE usuarios SET nombre = ?, apellido = ?, correo_electronico = ? WHERE usuario_id = ?",
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
