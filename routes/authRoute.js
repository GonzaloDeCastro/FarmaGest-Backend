const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const db = require("../db"); // Conexión usando mysql2/promise

dotenv.config();

const router = express.Router();

// 📌 Configurar Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 📌 1️⃣ Enviar email con enlace de recuperación
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El email es obligatorio" });
  }

  try {
    // 📌 Usar `db.query()` con Promesas
    const [users] = await db.query("SELECT id FROM usuarios WHERE correo = ?", [
      email,
    ]);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar token de recuperación (expira en 1 hora)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Guardar token en la BD
    await db.query("UPDATE usuarios SET reset_token = ? WHERE correo = ?", [
      token,
      email,
    ]);

    // Enlace de recuperación
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Enviar email
    await transporter.sendMail({
      from: `"Soporte" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Recuperación de contraseña",
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>Este enlace expirará en 1 hora.</p>`,
    });

    res.json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
});

// 📌 2️⃣ Verificar token y cambiar contraseña
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token y nueva contraseña son obligatorios" });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Buscar usuario con el token válido
    const [users] = await db.query(
      "SELECT id FROM usuarios WHERE correo = ? AND reset_token = ?",
      [email, token]
    );

    if (!users || users.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Cifrar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y eliminar token
    await db.query(
      "UPDATE usuarios SET password = ?, reset_token = NULL WHERE correo = ?",
      [hashedPassword, email]
    );

    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    console.error("Error en reset-password:", error);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
});

module.exports = router;
