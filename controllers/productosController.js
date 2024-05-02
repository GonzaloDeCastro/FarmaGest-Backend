const Producto = require("../models/productosModel");

const productosController = {
  obtenerTodos: (req, res) => {
    Producto.obtenerTodos((err, productos) => {
      if (err) throw err;
      res.json(productos);
    });
  },

  obtenerPorId: function (req, res) {
    Producto.obtenerPorId(req.params.id, (err, producto) => {
      if (err) throw err;
      res.json(producto);
    });
  },

  crear: function (req, res) {
    const nuevoProducto = req.body;
    Producto.crear(nuevoProducto, (err, resultado) => {
      if (err) throw err;
      res.send("Producto creado exitosamente");
    });
  },

  eliminar: function (req, res) {
    Producto.eliminar(req.params.id, (err, producto) => {
      if (err) throw err;
      res.json(producto);
    });
  },
};

module.exports = productosController;
