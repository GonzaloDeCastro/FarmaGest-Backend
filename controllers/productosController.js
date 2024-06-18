const Producto = require("../models/productosModel");

const productosController = {
  obtenerTodos: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    Producto.obtenerTodos(page, pageSize, search, (err, productos) => {
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
      res.send(resultado);
    });
  },

  actualizar: function (req, res) {
    const editarProducto = req.body;
    Producto.actualizar(req.params.id, editarProducto, (err, producto) => {
      if (err) throw err;
      res.json(producto);
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
