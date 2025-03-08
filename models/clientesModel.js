const db = require("../db");

class Cliente {
  constructor(nombre, apellido, dni, obra_social_id, ciudad_id) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.obra_social_id = obra_social_id;
    this.ciudad_id = ciudad_id;
  }

  static obtenerClientes(
    page = 0,
    pageSize = 6,
    search = "",
    sesion,
    callback
  ) {
    const offset = (page - 1) * pageSize;
    const searchQuery = search ? `%${search}%` : "%";

    let query = `
      SELECT c.cliente_id, c.nombre as Nombre, c.apellido as Apellido, c.dni as DNI, o.obra_social_id,o.obra_social,ci.ciudad_id, ci.ciudad as Ciudad
      FROM clientes as c
      LEFT JOIN obras_sociales as o on o.obra_social_id = c.obra_social_id
      LEFT JOIN ciudades as ci on ci.ciudad_id = c.ciudad_id
      WHERE c.deleted_at is NULL and (c.nombre LIKE ? OR c.apellido LIKE ? OR c.dni LIKE ?)
    `;

    const params = [searchQuery, searchQuery, searchQuery];
    query += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    if (sesion) {
      db.query(
        `UPDATE sesiones SET ultima_actividad = NOW() WHERE sesion_id = ?`,
        [sesion],
        (err, resultado) => {
          if (err) {
            console.error("Error al insertar usuario:", err);
            return callback(err);
          }
        }
      );
    }
    return db.query(query, params, callback);
  }

  static agregarCliente(nuevoCliente, usuario_id, callback) {
    return db.query(
      "INSERT INTO clientes (nombre, apellido, dni, obra_social_id, ciudad_id) VALUES (?, ?, ?, ?, ?)",
      [
        nuevoCliente.nombre,
        nuevoCliente.apellido,
        nuevoCliente.dni,
        nuevoCliente.obra_social_id,
        nuevoCliente.ciudad_id,
      ],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }
        db.query(
          `INSERT INTO auditoria_clientes (cliente_id, accion, detalle_cambio, fecha_movimiento, usuario_id) VALUES (?, 'CREAR', 'Se ha creado un nuevo cliente ${nuevoCliente.nombre} ${nuevoCliente.apellido}', NOW(), ?)`,
          [result.insertId, usuario_id], // usuario_id por defecto 1 si no está disponible
          (err) => {
            if (err) {
              console.error("Error al registrar en auditoría:", err);
            }
          }
        );
        callback(null, { id: result.insertId, ...nuevoCliente });
      }
    );
  }

  static actualizarCliente(cliente_id, cliente, callback) {
    db.query(
      "SELECT * FROM clientes WHERE cliente_id = ?",
      [cliente_id],
      (err, resultados) => {
        if (err) {
          return callback(err, null);
        }

        if (resultados.length === 0) {
          return callback(new Error("Cliente no encontrado"), null);
        }

        const clienteActual = resultados[0];

        let detalle_cambio = "";

        // 2️⃣ Comparar campo por campo y generar la descripción del cambio
        if (cliente.nombre !== clienteActual.nombre) {
          detalle_cambio += `Nombre: ${clienteActual.nombre} → ${cliente.nombre}; `;
        }
        if (cliente.apellido !== clienteActual.apellido) {
          detalle_cambio += `Apellido: ${clienteActual.apellido} → ${cliente.apellido}; `;
        }
        if (cliente.dni !== clienteActual.dni) {
          detalle_cambio += `DNI: ${clienteActual.dni} → ${cliente.dni}; `;
        }
        if (cliente.obra_social_id !== clienteActual.obra_social_id) {
          detalle_cambio += `Obra Social: ${clienteActual.obra_social_id} → ${cliente.obra_social_id}; `;
        }
        if (cliente.ciudad_id !== clienteActual.ciudad_id) {
          detalle_cambio += `Ciudad: ${clienteActual.ciudad_id} → ${cliente.ciudad_id}; `;
        }

        db.query(
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
        if (detalle_cambio !== "") {
          db.query(
            "INSERT INTO auditoria_clientes (cliente_id, accion, detalle_cambio, fecha_movimiento, usuario_id) VALUES (?, 'ACTUALIZAR', ?, NOW(), ?)",
            [cliente_id, detalle_cambio, cliente.usuario_id], // usuario_id por defecto 1 si no está disponible
            (err) => {
              if (err) {
                console.error("Error al registrar en auditoría:", err);
              }
            }
          );
        }
      }
    );
  }

  static eliminarCliente(
    clienteID,
    usuario_id,
    clienteNombre,
    clienteApellido,
    callback
  ) {
    db.query(
      `INSERT INTO auditoria_clientes (cliente_id, accion, fecha_movimiento,detalle_cambio, usuario_id) VALUES (?, 'ELIMINAR', NOW(),'Se ha eliminado cliente ${clienteNombre} ${clienteApellido}',?)`,
      [clienteID, usuario_id],
      (err) => {
        if (err) {
          console.error("Error al registrar en auditoría:", err);
        }
      }
    );
    return db.query(
      "UPDATE clientes SET deleted_at = NOW() WHERE cliente_id = ?",
      [clienteID],
      callback
    );
  }

  static obtenerObrasSociales(callback) {
    return db.query(
      `
      SELECT obra_social_id, obra_social, plan, descuento, codigo
      FROM obras_sociales WHERE deleted_at IS NULL
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
