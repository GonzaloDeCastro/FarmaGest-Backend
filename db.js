// db.js
const mysql = require("mysql2");
require("dotenv").config();
class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance = this;
      this.connection = mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database,
        timezone: "Z",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      this.connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
        } else {
          console.log("Successful connection to the MySQL database");
        }
      });
    }

    return Database.instance; // Retorna siempre la misma instancia
  }

  getConnection() {
    return this.connection; // Método para acceder a la conexión
  }
}

const instance = new Database(); // Instancia única del Singleton
module.exports = instance.getConnection(); // Exporta la conexión
