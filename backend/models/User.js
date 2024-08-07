import db from "../config/database.js";
import bcrypt from "bcryptjs";

export const create = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );
  return result.insertId;
};

export const findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const findById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

export const updateUser = async (id, updates) => {
  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const query = `UPDATE users SET ${keys
    .map((key) => `${key} = ?`)
    .join(", ")} WHERE id = ?`;
  await db.query(query, [...values, id]);
};

export const deleteUser = async (id) => {
  await db.query("DELETE FROM users WHERE id = ?", [id]);
};
