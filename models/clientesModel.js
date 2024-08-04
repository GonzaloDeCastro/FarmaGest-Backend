const db = require("../db");

class Cliente {
  constructor(nombre, apellido, dni, obra_social_id, ciudad_id) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.obra_social_id = obra_social_id;
    this.ciudad_id = ciudad_id;
  }

  static obtenerClientes(page = 0, pageSize = 6, search = "", callback) {
    const offset = (page - 1) * pageSize;
    const searchQuery = search ? `%${search}%` : "%";

    let query = `
      SELECT c.cliente_id, c.nombre as Nombre, c.apellido as Apellido, c.dni as DNI, o.obra_social_id,o.obra_social,ci.ciudad_id, ci.ciudad as Ciudad
      FROM clientes as c
      LEFT JOIN obras_sociales as o on o.obra_social_id = c.obra_social_id
      LEFT JOIN ciudades as ci on ci.ciudad_id = c.ciudad_id
      WHERE (c.nombre LIKE ? OR c.apellido LIKE ? OR c.dni LIKE ?)
    `;

    const params = [searchQuery, searchQuery, searchQuery];
    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    return db.query(query, params, callback);
  }

  static agregarCliente(nuevoCliente, callback) {
    return db.query(
      "INSERT INTO clientes (nombre, apellido, dni, obra_social_id, ciudad_id) VALUES (?, ?, ?, ?, ?)",
      [
        nuevoCliente.nombre,
        nuevoCliente.apellido,
        nuevoCliente.dni,
        nuevoCliente.obra_social_id,
        nuevoCliente.ciudad_id,
      ],
      callback
    );
  }

  static actualizarCliente(cliente_id, cliente, callback) {
    return db.query(
      "UPDATE clientes SET nombre = ?, apellido = ?, dni = ?, obra_social_id = ?, ciudad_id = ? WHERE cliente_id = ?",
      [
        cliente.nombre,
        cliente.apellido,
        cliente.dni,
        cliente.obra_social_id,
        cliente.ciudad_id,
        parseInt(cliente_id),
      ],
      callback
    );
  }

  static eliminarCliente(clienteID, callback) {
    return db.query(
      "DELETE FROM clientes WHERE cliente_id = ?",
      [clienteID],
      callback
    );
  }

  static obtenerObrasSociales(callback) {
    return db.query(
      `
      SELECT obra_social_id, obra_social, plan, descuento, codigo
      FROM obras_sociales 
      `,
      callback
    );
  }

  static obtenerCiudades(callback) {
    return db.query(
      `
      SELECT ciudad_id, ciudad, codigo_postal, provincia_id
      FROM ciudades
      `,
      callback
    );
  }
}

module.exports = Cliente;
