const db = require("../db");

class Usuario {
  constructor(nombre, apellido, correo_electronico, compania, cuit) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo_electronico = correo_electronico;
  }

  static obtenerTodos(page, pageSize, search, rolID, callback) {
    const offset = (page - 1) * pageSize;
    const searchQuery = search ? `%${search}%` : "%";

    let query = `
    SELECT u.usuario_id, u.nombre as Nombre, u.apellido as Apellido, u.correo_electronico as Email,
    r.rol_id, r.descripcion as Rol, c.cuit, c.compania as Compania, 
    COALESCE(os.obra_social, '-') as obra_social, os.codigo
    FROM usuarios AS u 
    JOIN usuario_roles AS ur ON ur.usuario_id = u.usuario_id
    JOIN roles AS r ON r.rol_id = ur.rol_id
    LEFT JOIN usuario_obra_social AS uos ON uos.usuario_id = u.usuario_id
    LEFT JOIN obras_sociales AS os ON os.codigo = uos.codigo
    LEFT JOIN usuario_compania AS uc ON uc.usuario_id = u.usuario_id
    LEFT JOIN companias AS c ON c.compania_id = uc.compania_id
    WHERE (u.nombre LIKE ? OR u.apellido LIKE ? OR u.correo_electronico LIKE ?)
  `;

    // Agregar condición para filtrar por rol si rolID no es 0
    const params = [searchQuery, searchQuery, searchQuery];
    if (rolID != 0) {
      query += ` AND r.rol_id = ?`;
      params.push(rolID);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    return db.query(query, params, callback);
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
  static obtenerObrasSociales(callback) {
    return db.query(
      `
    SELECT codigo, obra_social, plan, descuento
    FROM obras_sociales 
    `,
      callback
    );
  }

  static obtenerCompanias(callback) {
    return db.query(
      `
    SELECT compania_id,compania, cuit
    FROM companias 
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

  static agregarUsuarioRol(usuarioRol, callback) {
    return db.query(
      "INSERT INTO usuario_roles (usuario_id, rol_id) VALUES (?, ?)",
      [usuarioRol.usuario_id, usuarioRol.rol_id],
      callback
    );
  }
  static agregarUsuarioOs(usuarioOs, callback) {
    return db.query(
      "INSERT INTO usuario_obra_social (usuario_id, codigo) VALUES (?, ?)",
      [usuarioOs.usuario_id, usuarioOs.codigo],
      callback
    );
  }

  static agregarUsuarioCompania(usuarioCompania, callback) {
    return db.query(
      "INSERT INTO usuario_compania (usuario_id, compania_id) VALUES (?, ?)",
      [usuarioCompania.usuario_id, usuarioCompania.compania_id],
      callback
    );
  }

  static actualizar(usuario_id, usuario, callback) {
    return db.query(
      "UPDATE usuarios SET nombre = ?, apellido = ?, correo_electronico = ?, compania = ?, cuit= ? WHERE usuario_id = ?",
      [
        usuario.nombre,
        usuario.apellido,
        usuario.correo_electronico,
        usuario.compania,
        usuario.cuit,
        parseInt(usuario_id),
      ],
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
  static eliminarUsuarioRol(usuario_id, callback) {
    return db.query(
      "DELETE FROM usuario_roles WHERE usuario_id = ?",
      [usuario_id],
      callback
    );
  }
  static eliminarUsuarioOs(usuario_id, callback) {
    return db.query(
      "DELETE FROM usuario_obra_social WHERE usuario_id = ?",
      [usuario_id],
      callback
    );
  }
}

module.exports = Usuario;
