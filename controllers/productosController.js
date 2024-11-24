const Producto = require("../models/productosModel");

const productosController = {
  obtenerProductos: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 99;
    const search = req.query.search || "";

    Producto.obtenerProductos(page, pageSize, search, (err, productos) => {
      if (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).json({ mensaje: "Error al obtener productos" });
      } else {
        res.json(productos);
      }
    });
  },

  agregarProducto: (req, res) => {
    const { nombre, codigo, marca, categoria_id, stock, precio } = req.body;
    const nuevoProducto = new Producto(
      nombre,
      codigo,
      marca,
      categoria_id,
      stock,
      precio
    );

    Producto.agregarProducto(nuevoProducto, (err, resultado) => {
      if (err) {
        console.error("Error al agregar producto:", err);
        res.status(500).json({ mensaje: "Error al agregar producto" });
      } else {
        res.status(201).json({
          mensaje: "Producto agregado correctamente",
          producto_id: resultado.insertId,
        });
      }
    });
  },

  actualizarProducto: (req, res) => {
    const editarProducto = req.body;
    Producto.actualizarProducto(
      req.params.id,
      editarProducto,
      (err, producto) => {
        if (err) {
          console.error("Error al actualizar producto:", err);
          res.status(500).json({ mensaje: "Error al actualizar producto" });
        } else {
          res.json(producto);
        }
      }
    );
  },

  eliminarProducto: (req, res) => {
    const productoID = req.params.id;

    Producto.eliminarProducto(productoID, (err, resultado) => {
      if (err) {
        console.error("Error al eliminar producto:", err);
        res.status(500).json({ mensaje: "Error al eliminar producto" });
      } else {
        if (resultado.affectedRows > 0) {
          res.json({ mensaje: "Producto eliminado correctamente" });
        } else {
          res.status(404).json({ mensaje: "Producto no encontrado" });
        }
      }
    });
  },

  obtenerCategorias: (req, res) => {
    Producto.obtenerCategorias((err, categorias) => {
      if (err) {
        console.error("Error al obtener categorías:", err);
        res.status(500).json({ mensaje: "Error al obtener categorías" });
      } else {
        res.json(categorias);
      }
    });
  },
};

module.exports = productosController;
