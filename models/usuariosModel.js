const db = require("../db");

class Usuario {
  constructor(nombre, apellido, correo, rol_id, contrasena) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.rol_id = rol_id;
    this.contrasena = contrasena;
  }

  static obtenerUsuarios(
    page = 0,
    pageSize = 6,
    search = "",
    rolID = "1",
    callback
  ) {
    const offset = (page - 1) * pageSize;
    const searchQuery = search ? `%${search}%` : "%";

    let query = `
    SELECT u.usuario_id, u.nombre as Nombre, u.apellido as Apellido, u.correo as Correo,  r.rol_id, r.rol as Rol FROM usuarios as u
    LEFT JOIN roles as r on r.rol_id = u.rol_id
    WHERE (nombre LIKE ? OR apellido LIKE ? OR correo LIKE ?)
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
  static agregarUsuario(nuevoUsuario, callback) {
    // Primero, verifica si el correo ya está registrado
    db.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [nuevoUsuario.correo],
      (error, results) => {
        if (error) {
          console.error("Error al verificar correo:", error);
          return callback(error);
        }

        if (results.length > 0) {
          // Si ya existe un usuario con ese correo, retorna un error
          return callback(new Error("El correo ya está registrado"));
        } else {
          // Si no existe, inserta el nuevo usuario
          db.query(
            "INSERT INTO usuarios (nombre, apellido, correo, rol_id, contrasena, estado) VALUES (?, ?, ?, ?, ?, true)",
            [
              nuevoUsuario.nombre,
              nuevoUsuario.apellido,
              nuevoUsuario.correo,
              nuevoUsuario.rol_id,
              nuevoUsuario.contrasena,
            ],
            (err, resultado) => {
              if (err) {
                console.error("Error al insertar usuario:", err);
                return callback(err);
              }
              callback(null, resultado);
            }
          );
        }
      }
    );
  }

  static actualizarUsuario(usuario_id, usuario, callback) {
    return db.query(
      "UPDATE usuarios SET nombre = ?, apellido = ?, correo = ?, rol_id = ? WHERE usuario_id = ?",
      [
        usuario.nombre,
        usuario.apellido,
        usuario.correo,
        usuario.rol_id,
        parseInt(usuario_id),
      ],
      callback
    );
  }

  static actualizarPassword(usuario_id, usuario, callback) {
    return db.query(
      "UPDATE usuarios SET contrasena = ? WHERE correo = ?",
      [usuario.password, usuario.correo],
      callback
    );
  }

  static eliminarUsuario(usuarioID, callback) {
    return db.query(
      "DELETE FROM usuarios WHERE usuario_id = ?",
      [usuarioID],
      callback
    );
  }

  static validarUsuarioLogin(correo, contrasena, callback) {
    return db.query(
      `
    SELECT 
    u.usuario_id, 
    u.nombre, 
    u.apellido, 
    u.correo, 
    u.estado, 
    u.rol_id,
    r.rol, 
    GROUP_CONCAT(p.permiso) as permisos
FROM 
    usuarios as u
LEFT JOIN 
    roles as r on r.rol_id = u.rol_id
LEFT JOIN 
    roles_permisos as rp on rp.rol_id = u.rol_id
LEFT JOIN 
    permisos as p on p.permiso_id = rp.permiso_id
WHERE 
    u.correo = ? 
    AND u.contrasena = ?
GROUP BY 
    u.usuario_id, u.nombre, u.apellido, u.correo, u.estado, u.rol_id;
    `,
      [correo, contrasena],
      callback
    );
  }

  static obtenerRoles(callback) {
    return db.query(
      `
    SELECT rol_id, rol
    FROM roles 
    `,
      callback
    );
  }
}

module.exports = Usuario;
