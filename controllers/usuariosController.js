const Usuario = require("../models/usuariosModel");

const usuariosController = {
  obtenerTodos: (req, res) => {
    Usuario.obtenerTodos((err, usuarios) => {
      if (err) throw err;
      res.json(usuarios);
    });
  },

  obtenerRoles: (req, res) => {
    Usuario.obtenerRoles((err, roles) => {
      if (err) throw err;
      res.json(roles);
    });
  },

  obtenerPorId: function (req, res) {
    Usuario.obtenerPorId(req.params.id, (err, usuario) => {
      if (err) throw err;
      res.json(usuario);
    });
  },

  crear: function (req, res) {
    const nuevoUsuario = req.body;

    Usuario.crear(nuevoUsuario, (err, resultado) => {
      if (err) throw err;
      res.send(resultado);
    });
  },

  agregarUsuarioRol: function (req, res) {
    const nuevoUsuarioRol = req.body;
    Usuario.agregarUsuarioRol(nuevoUsuarioRol, (err, resultado) => {
      if (err) throw err;
      res.send(resultado);
    });
  },

  actualizar: function (req, res) {
    const editarUsuario = req.body;
    Usuario.actualizar(req.params.id, editarUsuario, (err, usuario) => {
      if (err) throw err;
      res.json(usuario);
    });
  },
  eliminar: function (req, res) {
    Usuario.eliminar(req.params.id, (err, usuario) => {
      if (err) throw err;
      res.json(usuario);
    });
  },
  eliminarUsuarioRol: function (req, res) {
    Usuario.eliminarUsuarioRol(req.params.id, (err, usuario) => {
      if (err) throw err;
      res.json(usuario);
    });
  },
};

module.exports = usuariosController;
