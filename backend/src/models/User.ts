import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from "../config/database";
import { getDatabase } from "../helpers/datbaseContext";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}


export const create = async (name: string, email: string, password: string): Promise<number> => {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const database = getDatabase();

  const connection = await getConnection(database);

  // Perform the database query 
  return connection.query<ResultSetHeader>(
    "INSERT INTO patients (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  )
  .then(([result]) => {
    connection.release(); // Releasing the connection
    return result.insertId; // Returning the ID of the inserted record
  })
  .catch((queryError) => {
    connection.release();
    console.error('Error executing query:', queryError);
    throw queryError;
  });
};

export const findByEmail = async (email: string): Promise<User | null> => {
  const database = getDatabase();
  const connection = await getConnection(database);

  return connection.query<RowDataPacket[]>(
    "SELECT * FROM patients WHERE email = ?",
    [email]
  )
  .then(([rows]) => {
    connection.release();
    return rows.length > 0 ? (rows[0] as User) : null;
  })
  .catch((error) => {
    connection.release();
    console.error('Error querying by email:', error);
    throw error;
  });
};

export const findById = async (id: number): Promise<User | null> => {
  const database = getDatabase();
  const connection = await getConnection(database);

  return connection.query<RowDataPacket[]>(
    "SELECT * FROM patients WHERE id = ?",
    [id]
  )
  .then(([rows]) => {
    connection.release();
    return rows.length > 0 ? (rows[0] as User) : null;
  })
  .catch((error) => {
    connection.release();
    console.error('Error querying by ID:', error);
    throw error;
  });
};

export const updateUser = async (id: number, updates: Partial<User>): Promise<void> => {
  const database = getDatabase();
  const connection = await getConnection(database);

  // Directly specify the fields to be updated
  const query = `UPDATE patients SET name = COALESCE(?, name), email = COALESCE(?, email), password = COALESCE(?, password) WHERE id = ?`;

  const { name, email, password } = updates;

  return connection.query(query, [name, email, password, id])
    .then(() => {
      connection.release();
    })
    .catch((error) => {
      connection.release();
      console.error('Error updating user:', error);
      throw error;
    });
};

export const deleteUser = async (id: number): Promise<void> => {
  const database = getDatabase();
  const connection = await getConnection(database);

  return connection.query("DELETE FROM patients WHERE id = ?", [id])
  .then(() => {
    connection.release();
  })
  .catch((error) => {
    connection.release();
    console.error('Error deleting user:', error);
    throw error;
  });
};

