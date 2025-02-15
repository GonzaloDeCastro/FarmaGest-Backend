const Sesiones = require("../models/sesionesModel");

const sesionesController = {
  obtenerSesiones: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 99;
    const search = req.query.search || "";
    Sesiones.obtenerSesiones(page, pageSize, search, (err, sesiones) => {
      if (err) {
        console.error("Error al obtener sesiones:", err);
        res.status(500).json({ mensaje: "Error al obtener sesiones" });
      } else {
        res.json(sesiones);
      }
    });
  },
};

module.exports = sesionesController;
