const db = require("../db");

class Reporte {
  constructor({
    dateSelectedFrom,
    dateSelectedTo,
    entitySelected,
    clienteProductoVendedor,
  }) {
    this.dateSelectedFrom = dateSelectedFrom;
    this.dateSelectedTo = dateSelectedTo;
    this.entitySelected = entitySelected;
    this.clienteProductoVendedor = clienteProductoVendedor;
  }

  static obtenerVentasPorFecha(
    {
      dateSelectedFrom,
      dateSelectedTo,
      entitySelected,
      clienteProductoVendedor,
    },
    callback
  ) {
    let queryVentasPorFecha;
    const params = [dateSelectedFrom];

    console.log(
      dateSelectedFrom,
      dateSelectedTo,
      entitySelected,
      clienteProductoVendedor
    );

    if (dateSelectedTo) {
      // Si `dateSelectedTo` está definido
      queryVentasPorFecha = `
        SELECT DATE(v.fecha_hora) AS fecha, COUNT(*) AS cantidad_ventas,SUM(v.total) AS monto_total
        FROM ventas v
        WHERE DATE(v.fecha_hora) BETWEEN DATE(?) AND DATE(?)
        GROUP BY DATE(v.fecha_hora)
        ORDER BY fecha DESC;
      `;
      params.push(dateSelectedTo);
    } else {
      // Si `dateSelectedTo` es nulo, buscar desde `dateSelectedFrom` hasta hoy
      queryVentasPorFecha = `
        SELECT DATE(v.fecha_hora) AS fecha, COUNT(*) AS cantidad_ventas,SUM(v.total) AS monto_total
        FROM ventas v
        WHERE DATE(v.fecha_hora) >= DATE(?)
        GROUP BY DATE(v.fecha_hora)
        ORDER BY fecha DESC;
      `;
    }

    db.query(queryVentasPorFecha, params, (err, resultados) => {
      if (err) return callback(err);

      callback(null, resultados);
    });
  }
}

module.exports = Reporte;
