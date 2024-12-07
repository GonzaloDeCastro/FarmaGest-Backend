// reportesStrategies.js
const db = require("../db");

// Clase abstracta para la estrategia de reportes. Define un método execute que deben implementar todas las estrategias concretas.
class ReporteStrategy {
  execute(req, callback) {
    throw new Error("You must implement this method");
  }
}

// Estrategia concreta para obtener reportes de ventas por fecha.
class VentasPorFechaStrategy extends ReporteStrategy {
  execute(req, callback) {
    // Extrae las fechas de inicio y fin desde la consulta, que son usadas para filtrar las ventas en la base de datos.
    const { dateSelectedFrom, dateSelectedTo } = req.query;
    let queryVentasPorFecha;
    const params = [dateSelectedFrom];

    // Prepara la consulta SQL basada en si se proporcionó una fecha de fin.
    if (dateSelectedTo) {
      // Si se proporciona la fecha de fin, selecciona ventas entre las fechas de inicio y fin.
      queryVentasPorFecha = `
                SELECT DATE(v.fecha_hora) AS fecha, COUNT(*) AS cantidad_ventas, SUM(v.total) AS monto_total
                FROM ventas v
                WHERE DATE(v.fecha_hora) BETWEEN DATE(?) AND DATE(?)
                GROUP BY DATE(v.fecha_hora)
                ORDER BY fecha DESC;
            `;
      params.push(dateSelectedTo);
    } else {
      // Si no se proporciona la fecha de fin, selecciona ventas desde la fecha de inicio hasta la fecha actual.
      queryVentasPorFecha = `
                SELECT DATE(v.fecha_hora) AS fecha, COUNT(*) AS cantidad_ventas, SUM(v.total) AS monto_total
                FROM ventas v
                WHERE DATE(v.fecha_hora) >= DATE(?)
                GROUP BY DATE(v.fecha_hora)
                ORDER BY fecha DESC;
            `;
    }

    // Ejecuta la consulta en la base de datos y maneja el resultado o el error.
    db.query(queryVentasPorFecha, params, (err, resultados) => {
      if (err) return callback(err);
      callback(null, resultados);
    });
  }
}

// Exporta la estrategia para que pueda ser utilizada por otras partes del sistema.
module.exports = { VentasPorFechaStrategy };
