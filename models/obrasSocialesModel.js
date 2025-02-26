const db = require("../db");

class ObraSocial {
  constructor(obra_social, plan, descuento, codigo) {
    this.obra_social = obra_social;
    this.plan = plan;
    this.descuento = descuento;
    this.codigo = codigo;
  }

  static obtenerObrasSociales(
    page = 0,
    pageSize = 6,
    search = "",
    sesion,
    callback
  ) {
    const offset = (page - 1) * pageSize;

    const searchQuery = search ? `%${search}%` : "%";

    let query = `
      SELECT obra_social_id, obra_social, plan as Plan, descuento as Descuento, codigo as Codigo
      FROM obras_sociales
      WHERE obra_social LIKE ? OR plan LIKE ? OR codigo LIKE ?
    `;

    const params = [searchQuery, searchQuery, searchQuery];
    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    if (sesion) {
      db.query(
        `UPDATE sesiones SET ultima_actividad = NOW() WHERE sesion_id = ?`,
        [sesion],
        (err, resultado) => {
          if (err) {
            console.error("Error al insertar usuario:", err);
            return callback(err);
          }
        }
      );
    }
    return db.query(query, params, callback);
  }

  static agregarObraSocial(nuevaObraSocial, callback) {
    return db.query(
      "INSERT INTO obras_sociales (obra_social, plan, descuento, codigo) VALUES (?, ?, ?, ?)",
      [
        nuevaObraSocial.obra_social,
        nuevaObraSocial.plan,
        nuevaObraSocial.descuento,
        nuevaObraSocial.codigo,
      ],
      callback
    );
  }

  static actualizarObraSocial(obraSocialID, obraSocialActualizada, callback) {
    return db.query(
      "UPDATE obras_sociales SET obra_social = ?, plan = ? , descuento = ?, codigo = ? WHERE obra_social_id = ?",
      [
        obraSocialActualizada.obra_social,
        obraSocialActualizada.plan,
        obraSocialActualizada.descuento,
        obraSocialActualizada.codigo,
        obraSocialID,
      ],
      callback
    );
  }

  static eliminarObraSocial(obraSocialID, callback) {
    return db.query(
      "DELETE FROM obras_sociales WHERE obra_social_id = ?",
      [obraSocialID],
      callback
    );
  }
}

module.exports = ObraSocial;
