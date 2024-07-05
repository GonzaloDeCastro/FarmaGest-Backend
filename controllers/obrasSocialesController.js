const ObraSocial = require("../models/obrasSocialesModel");

const obrasSocialesController = {
  obtenerObrasSociales: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 7;
    const search = req.query.search || "";

    ObraSocial.obtenerObrasSociales(
      page,
      pageSize,
      search,
      (err, obrasSociales) => {
        if (err) {
          console.error("Error al obtener obras sociales:", err);
          res.status(500).json({ mensaje: "Error al obtener obras sociales" });
        } else {
          res.json(obrasSociales);
        }
      }
    );
  },

  agregarObraSocial: (req, res) => {
    const { obra_social, plan, descuento, codigo } = req.body;
    const nuevaObraSocial = new ObraSocial(
      obra_social,
      plan,
      descuento,
      codigo
    );

    ObraSocial.agregarObraSocial(nuevaObraSocial, (err, resultado) => {
      if (err) {
        console.error("Error al agregar obra social:", err);
        res.status(500).json({ mensaje: "Error al agregar obra social" });
      } else {
        res.status(201).json({
          mensaje: "Obra social agregada correctamente",
          obra_social_id: resultado.insertId,
        });
      }
    });
  },

  actualizarObraSocial: (req, res) => {
    const obraSocialActualizada = req.body;
    ObraSocial.actualizarObraSocial(
      req.params.id,
      obraSocialActualizada,
      (err, obraSocial) => {
        if (err) {
          console.error("Error al actualizar obra social:", err);
          res.status(500).json({ mensaje: "Error al actualizar obra social" });
        } else {
          res.json({
            mensaje: "Obra social actualizada correctamente",
            obraSocial,
          });
        }
      }
    );
  },

  eliminarObraSocial: (req, res) => {
    const obraSocialID = req.params.id;

    ObraSocial.eliminarObraSocial(obraSocialID, (err, resultado) => {
      if (err) {
        console.error("Error al eliminar obra social:", err);
        res.status(500).json({ mensaje: "Error al eliminar obra social" });
      } else {
        if (resultado.affectedRows > 0) {
          res.json({ mensaje: "Obra social eliminada correctamente" });
        } else {
          res.status(404).json({ mensaje: "Obra social no encontrada" });
        }
      }
    });
  },
};

module.exports = obrasSocialesController;
