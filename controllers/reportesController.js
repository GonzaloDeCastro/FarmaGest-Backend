const Reporte = require("../models/reportesModel");

const reportesController = {
  obtenerVentasPorFecha: (req, res) => {
    // Extraemos los parámetros de paginación y búsqueda del objeto req.query
    const dateSelectedFrom = req.query.dateSelectedFrom || "2024-09-01";
    const dateSelectedTo = req.query.dateSelectedTo || null;
    const entitySelected = req.query.entitySelected || "";
    const clienteProductoVendedor = req.query.clienteProductoVendedor || "";

    // Llamamos a obtenerTodasLasVentas pasando un objeto con los parámetros y un callback
    Reporte.obtenerVentasPorFecha(
      {
        dateSelectedFrom,
        dateSelectedTo,
        entitySelected,
        clienteProductoVendedor,
      },
      (err, ventas) => {
        if (err) {
          console.error("Error al obtener las ventas:", err);
          res.status(500).json({ mensaje: "Error al obtener las ventas" });
        } else {
          res.json(ventas);
        }
      }
    );
  },
};

module.exports = reportesController;
