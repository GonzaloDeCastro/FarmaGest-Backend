// reportesController.js
const { VentasPorFechaStrategy } = require("../models/reportesStrategies");

// Clase Contexto que gestiona la estrategia a utilizar.
class ReporteContext {
  constructor(strategy) {
    this.strategy = strategy; // Almacena la estrategia pasada al constructor.
  }

  setStrategy(strategy) {
    this.strategy = strategy; // Permite cambiar la estrategia en tiempo de ejecución.
  }

  // Método que utiliza la estrategia configurada para procesar la solicitud y enviar la respuesta.
  obtenerReporte(req, res) {
    this.strategy.execute(req, (err, result) => {
      if (err) {
        console.error("Error al obtener el reporte:", err);
        res.status(500).json({ mensaje: "Error al obtener el reporte" });
      } else {
        res.json(result);
      }
    });
  }
}

// Controlador que utiliza el contexto y la estrategia para manejar las solicitudes de reportes de ventas.
const reporteController = {
  obtenerVentasPorFecha: (req, res) => {
    const context = new ReporteContext(new VentasPorFechaStrategy());
    context.obtenerReporte(req, res);
  },
};

// Exporta el controlador para que pueda ser utilizado por las rutas.
module.exports = reporteController;
