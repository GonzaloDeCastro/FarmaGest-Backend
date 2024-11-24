const Reporte = require("../models/reportesModel");

const reportesController = {
  obtenerTodasLasVentas: (req, res) => {
    // Extraemos los parámetros de paginación y búsqueda del objeto req.query
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";

    // Llamamos a obtenerTodasLasVentas pasando un objeto con los parámetros y un callback
    Reporte.obtenerTodasLasVentas({ page, pageSize, search }, (err, ventas) => {
      if (err) {
        console.error("Error al obtener las ventas:", err);
        res.status(500).json({ mensaje: "Error al obtener las ventas" });
      } else {
        res.json(ventas);
      }
    });
  },
};

module.exports = reportesController;
