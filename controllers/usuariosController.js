const Usuario = require("../models/usuariosModel");

const usuariosController = {
  obtenerUsuarios: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const rolID = req.query.rolID || 0;

    Usuario.obtenerUsuarios(page, pageSize, search, rolID, (err, usuarios) => {
      if (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
      } else {
        res.json(usuarios);
      }
    });
  },

  agregarUsuario: (req, res) => {
    const { nombre, apellido, correo, rol_id } = req.body;
    const nuevoUsuario = new Usuario(nombre, apellido, correo, rol_id);

    Usuario.agregarUsuario(nuevoUsuario, (err, resultado) => {
      if (err) {
        console.error("Error al agregar usuario:", err);
        res.status(500).json({ mensaje: "Error al agregar usuario" });
      } else {
        res.status(201).json({
          mensaje: "Usuario agregado correctamente",
          usuario_id: resultado.insertId,
        });
      }
    });
  },

  actualizarUsuario: (req, res) => {
    const editarUsuario = req.body;
    Usuario.actualizarUsuario(req.params.id, editarUsuario, (err, usuario) => {
      if (err) throw err;
      res.json(usuario);
    });
  },

  eliminarUsuario: (req, res) => {
    const usuarioID = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL

    Usuario.eliminarUsuario(usuarioID, (err, resultado) => {
      if (err) {
        console.error("Error al eliminar usuario:", err);
        res.status(500).json({ mensaje: "Error al eliminar usuario" });
      } else {
        if (resultado.affectedRows > 0) {
          res.json({ mensaje: "Usuario eliminado correctamente" });
        } else {
          res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
      }
    });
  },

  obtenerRoles: (req, res) => {
    Usuario.obtenerRoles((err, roles) => {
      if (err) throw err;
      res.json(roles);
    });
  },
};

module.exports = usuariosController;
