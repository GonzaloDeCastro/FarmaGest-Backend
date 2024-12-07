// db.js
const mysql = require("mysql2");

class Database {
  constructor() {
    if (!Database.instance) {
      Database.instance = this;
      this.connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "farma_gest",
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
