const AuditoriaObrasSociales = require("../../models/auditorias/auditoriaObrasSocialesModel");

const auditoriaObrasSocialesController = {
  obtenerAuditoriaObrasSociales: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 99;
    const search = req.query.search || "";
    AuditoriaObrasSociales.obtenerAuditoriaObrasSociales(
      page,
      pageSize,
      search,
      (err, auditoriaObrasSociales) => {
        if (err) {
          console.error("Error al obtener auditoria clientes:", err);
          res
            .status(500)
            .json({ mensaje: "Error al obtener auditoria clientes" });
        } else {
          res.json(auditoriaObrasSociales);
        }
      }
    );
  },
};

module.exports = auditoriaObrasSocialesController;
