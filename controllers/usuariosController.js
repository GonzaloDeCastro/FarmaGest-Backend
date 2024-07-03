const Usuario = require("../models/usuariosModel");

const usuariosController = {
  obtenerTodos: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const rolID = req.query.rolID || 0;

    Usuario.obtenerTodos(page, pageSize, search, rolID, (err, usuarios) => {
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

  obtenerObrasSociales: (req, res) => {
    Usuario.obtenerObrasSociales((err, roles) => {
      if (err) throw err;
      res.json(roles);
    });
  },

  obtenerCompanias: (req, res) => {
    Usuario.obtenerCompanias((err, roles) => {
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
  agregarUsuarioOs: function (req, res) {
    const nuevoUsuarioOs = req.body;
    Usuario.agregarUsuarioOs(nuevoUsuarioOs, (err, resultado) => {
      if (err) throw err;
      res.send(resultado);
    });
  },
  agregarUsuarioCompania: function (req, res) {
    const nuevoUsuarioCompania = req.body;

    Usuario.agregarUsuarioCompania(nuevoUsuarioCompania, (err, resultado) => {
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

  eliminarUsuarioOs: function (req, res) {
    Usuario.eliminarUsuarioOs(req.params.id, (err, usuario) => {
      if (err) throw err;
      res.json(usuario);
    });
  },

  eliminarUsuarioCompania: function (req, res) {
    Usuario.eliminarUsuarioCompania(req.params.id, (err, usuario) => {
      if (err) throw err;
      res.json(usuario);
    });
  },
};

module.exports = usuariosController;
