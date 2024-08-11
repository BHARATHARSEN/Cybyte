// import db from "../config/database.js";
// import bcrypt from "bcryptjs";

// export const create = async (username, email, password) => {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const [result] = await db.query(
//     "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
//     [username, email, hashedPassword]
//   );
//   return result.insertId;
// };

// export const findByEmail = async (email) => {
//   const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//   return rows[0];
// };

// export const findById = async (id) => {
//   const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
//   return rows[0];
// };

// export const updateUser = async (id, updates) => {
//   const keys = Object.keys(updates);
//   const values = Object.values(updates);
//   const query = `UPDATE users SET ${keys
//     .map((key) => `${key} = ?`)
//     .join(", ")} WHERE id = ?`;
//   await db.query(query, [...values, id]);
// };

// export const deleteUser = async (id) => {
//   await db.query("DELETE FROM users WHERE id = ?", [id]);
// };

import db from "../config/database";
import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export const create = async (username: string, email: string, password: string): Promise<number> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );
  return result.insertId;
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

export const findById = async (id: number): Promise<User | null> => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return rows.length > 0 ? (rows[0] as User) : null;
};

export const updateUser = async (id: number, updates: Partial<User>): Promise<void> => {
  const keys = Object.keys(updates);
  const values = Object.values(updates);
  const query = `UPDATE users SET ${keys
    .map((key) => `${key} = ?`)
    .join(", ")} WHERE id = ?`;
  await db.query(query, [...values, id]);
};

export const deleteUser = async (id: number): Promise<void> => {
  await db.query("DELETE FROM users WHERE id = ?", [id]);
};

