const db = require("../db");

class Sesiones {
  constructor(
    correo_usuario,
    navegador,
    ip,
    hora_logueo,
    ultima_actividad,
    hora_logout,
    sesion_id
  ) {
    this.correo_usuario = correo_usuario;
    this.navegador = navegador;
    this.ip = ip;
    this.hora_logueo = hora_logueo;
    this.ultima_actividad = ultima_actividad;
    this.hora_logout = hora_logout;
    this.sesion_id = sesion_id;
  }

  static obtenerSesiones(page = 0, pageSize = 6, search = "", callback) {
    const offset = (page - 1) * pageSize;
    const searchQuery = search ? `%${search}%` : "%";
    let query = `
    SELECT correo_usuario, navegador, ip, hora_logueo, ultima_actividad, hora_logout, sesion_id
    FROM sesiones
    ORDER BY hora_logueo DESC`;
    /* const params = [searchQuery, searchQuery, searchQuery];
    query += ` LIMIT ? OFFSET ?`; */
    /* params.push(pageSize, offset); */
    return db.query(query, /*  params, */ callback);
  }
}

module.exports = Sesiones;
