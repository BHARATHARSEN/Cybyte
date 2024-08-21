import { ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database'; // Assuming you have a database connection utility
import { getDatabase } from '../helpers/datbaseContext';

// Define the form data interface
interface FormModel {
  text: string;
  multilineText: string;
  email: string;
  telephone: string;
  number: number;
  date: string;
  time: string;
  timestamp: string;
  checkbox: boolean;
  dropdown: string;
  radioList: string;
  checkboxList: string[];
  pdfFile: string;
  imageFile: string;
  listBox: string;
}

// Function to insert form data into the database
export const createFormData = async (formData: FormModel): Promise<number> => {
    const database = getDatabase();
    const connection = await getConnection(database);

    console.log('Received form data:', formData);

  const query = `
    INSERT INTO form_data2 (text, multilineText, email, telephone, number, date, time, timestamp, checkbox, dropdown, radioList, checkboxList, pdfFile, imageFile, listBox)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return connection.query<ResultSetHeader>(
    query,
    [
      formData.text, formData.multilineText, formData.email, formData.telephone,
      formData.number, formData.date, formData.time, formData.timestamp,
      formData.checkbox, formData.dropdown, formData.radioList,
      formData.checkboxList.join(','), formData.pdfFile || null, formData.imageFile || null, formData.listBox
    ]
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

// Function to retrieve all form data from the database
export const getFormData = async (): Promise<FormModel[]> => {
    const database = getDatabase();
    const connection = await getConnection(database);

  const query = 'SELECT * FROM form_data';

  return connection.query(query)
    .then(([rows]) => {
      connection.release();
      return rows as FormModel[];
    })
    .catch((queryError) => {
      connection.release();
      console.error('Error retrieving data:', queryError);
      throw queryError;
    });
};
