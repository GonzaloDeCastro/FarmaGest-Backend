const pool = require("../db");
const bcrypt = require("bcrypt");

exports.getUserSession = async (req, res) => {
  let client; // Declarar el cliente fuera del bloque try
  const { sesion_id } = req.query;

  try {
    client = await pool.connect();

    const result = await client.query(
      `SELECT sesion_id, ip_address, browser, logget_at from usuario_sesiones 
      where sesion_id::UUID = $1;`,
      [sesion_id.payload]
    );

    const results = { results: result ? result.rows : null };

    res.json(results);
  } catch (err) {
    console.error("Error executing the query:", err);
    res.status(500).send("Server error");
  } finally {
    if (client) {
      client.release(); // Liberar la conexión en caso de error o éxito
    }
  }
};
exports.getLogin = async (req, res) => {
  let client; // Declarar el cliente fuera del bloque try
  const { username, password } = req.query.dataLogin;

  try {
    client = await pool.connect();
    // Usar parámetros de consulta para prevenir inyección SQL
    const result = await client.query(
      `SELECT u.usuario_id, u.password_hash FROM usuarios as u 
    WHERE u.correo_electronico = $1;`,
      [username]
    );

    if (result.rowCount > 0) {
      const user = result.rows[0];

      // Comparar la contraseña ingresada con el hash almacenado
      const match = await bcrypt.compare(password, user.password_hash);

      if (match) {
        // Eliminar la contraseña del objeto user antes de devolverlo
        delete user.password_hash;
        res.json(user);
      } else {
        res.json(1); // Contraseña incorrecta
      }
    } else {
      res.json(1); // Usuario no encontrado
    }
  } catch (err) {
    console.error("Error executing the query:", err);
    res.status(500).send("Server error");
  } finally {
    if (client) {
      client.release(); // Liberar la conexión en caso de error o éxito
    }
  }
};

// Add session
exports.addSession = async (req, res) => {
  const { usuario_id, ip_address, browser } = req.body;

  let client; // Declarar client fuera del bloque try-catch-finally

  try {
    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO usuario_sesiones ( usuario_id, ip_address, browser, logged_at) 
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING sesion_id`,
      [usuario_id, ip_address, browser]
    );

    const sessionID =
      result && result.rows && result.rows.length > 0
        ? result.rows[0].sesion_id
        : null; // Obtener el ID generado
    res.json({
      message: `Session added successfully `,
      sessionID: sessionID, // Enviar el ID generado en la respuesta
    });
  } catch (error) {
    console.error("Error executing the query:", error);
    res.status(500).send("Server error");
  } finally {
    if (client) {
      client.release(); // Liberar la conexión en caso de error o éxito
    }
  }
};

exports.logoutSession = async (req, res) => {
  let client = null; // Declara client fuera del bloque try-catch-finally
  sessionID = req.params.id;
  try {
    client = await pool.connect();
    const result = await client.query(
      `UPDATE usuario_sesiones SET terminated_at = CURRENT_TIMESTAMP
      WHERE sesion_id = '${sessionID}'::UUID`
    );
    // Return the updated equipment
    res.json({
      message: "Logout successfully",
    });
  } catch (error) {
    console.error("Error executing the query:", error);
    res.status(500).send("Server error");
  } finally {
    if (client) {
      client.release(); // Liberar la conexión en caso de error o éxito
    }
  }
};
