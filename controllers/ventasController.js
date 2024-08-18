const Venta = require("../models/ventasModel");

const ventasController = {
  crearVenta: (req, res) => {
    const { cliente_id, usuario_id, fecha, total, items } = req.body;
    const nuevaVenta = new Venta(cliente_id, usuario_id, fecha, total, items);

    Venta.crearVentaConItems(nuevaVenta, (err, ventaId) => {
      if (err) {
        console.error("Error al crear la venta:", err);
        res.status(500).json({ mensaje: "Error al crear la venta" });
      } else {
        res
          .status(201)
          .json({ mensaje: "Venta creada exitosamente", venta_id: ventaId });
      }
    });
  },
  obtenerTodasLasVentas: (req, res) => {
    // Extraemos los parámetros de paginación y búsqueda del objeto req.query
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";

    // Llamamos a obtenerTodasLasVentas pasando un objeto con los parámetros y un callback
    Venta.obtenerTodasLasVentas({ page, pageSize, search }, (err, ventas) => {
      if (err) {
        console.error("Error al obtener las ventas:", err);
        res.status(500).json({ mensaje: "Error al obtener las ventas" });
      } else {
        res.json(ventas);
      }
    });
  },

  obtenerVentaPorId: (req, res) => {
    const venta_id = req.params.id;

    Venta.obtenerVentaConItemsPorId(venta_id, (err, venta) => {
      if (err) {
        console.error("Error al obtener la venta:", err);
        res.status(500).json({ mensaje: "Error al obtener la venta" });
      } else {
        if (venta) {
          res.json(venta);
        } else {
          res.status(404).json({ mensaje: "Venta no encontrada" });
        }
      }
    });
  },

  // Otros métodos permanecen iguales...
};

module.exports = ventasController;
