import { ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database'; // Assuming you have a database connection utility
import { getDatabase } from '../helpers/datbaseContext';

// Define the form data interface
interface FormModel {
  id: number ;
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
  user_id: number;
}

// Function to insert form data into the database
export const createFormData = async (formData: FormModel): Promise<number> => {
    const database = getDatabase();
    const connection = await getConnection(database);

    console.log('Received form data:', formData);

  const query = `
    INSERT INTO form_data2 (text, multilineText, email, telephone, number, date, time, timestamp, checkbox, dropdown, radioList, checkboxList, pdfFile, imageFile, listBox, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

  return connection.query<ResultSetHeader>(
    query,
    [
      formData.text, formData.multilineText, formData.email, formData.telephone,
      formData.number, formData.date, formData.time, formData.timestamp,
      formData.checkbox, formData.dropdown, formData.radioList,
      formData.checkboxList.join(','), formData.pdfFile || null, formData.imageFile || null, formData.listBox, formData.user_id
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
export const getFormData = async (user_id: string): Promise<FormModel[]> => {
    const database = getDatabase();
    const connection = await getConnection(database);

  const query = 'SELECT * FROM form_data2 WHERE user_id = ?';

  return connection.query(query, [user_id])
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

export const updateFormData = async (formId: string, formData: Partial<FormModel>): Promise<void> => {
  const database = getDatabase();
  const connection = await getConnection(database);

  const query = `
    UPDATE form_data2
    SET 
      text = COALESCE(?, text),
      multilineText = COALESCE(?, multilineText),
      email = COALESCE(?, email),
      telephone = COALESCE(?, telephone),
      number = COALESCE(?, number),
      date = COALESCE(?, date),
      time = COALESCE(?, time),
      timestamp = COALESCE(?, timestamp),
      checkbox = COALESCE(?, checkbox),
      dropdown = COALESCE(?, dropdown),
      radioList = COALESCE(?, radioList),
      checkboxList = COALESCE(?, checkboxList),
      pdfFile = COALESCE(?, pdfFile),
      imageFile = COALESCE(?, imageFile),
      listBox = COALESCE(?, listBox),
      user_id = COALESCE(?, user_id)
    WHERE id = ?
  `;

  const values = [
    formData.text || null,
    formData.multilineText || null,
    formData.email || null,
    formData.telephone || null,
    formData.number || null,
    formData.date || null,
    formData.time || null,
    formData.timestamp || null,
    formData.checkbox !== undefined ? formData.checkbox : null,
    formData.dropdown || null,
    formData.radioList || null,
    formData.checkboxList || null,
    formData.pdfFile || null,
    formData.imageFile || null,
    formData.listBox || null,
    formData.user_id || null,
    formId
  ];

  await connection.query(query, values);
  connection.release();
};

export const deleteFormData = async (formId: string): Promise<void> => {
  const database = getDatabase();
  const connection = await getConnection(database);

  const query = 'DELETE FROM form_data2 WHERE id = ?';
  console.log("This is form Id",[formId])

  await connection.query(query, [formId]);

  connection.release();
};
