import { Request, Response } from 'express';
import * as FormModel from '../models/Form'; 
import upload from '../middlewares/upload';


interface Files {
  [fieldname: string]: Express.Multer.File[]; // SHape of req.files
}

export const submitForm = async (req: Request, res: Response): Promise<void> => {
  // console.log("Hiii")
  // upload.fields([
  //   { name: 'pdfFile', maxCount: 1 },
  //   { name: 'imageFile', maxCount: 1 }
  // ])(req, res, async (err) => {
  //   console.log(req.body, "Hello");
  //   if (err) {
  //     return res.status(500).json({ message: 'File upload error', error: err.message });
  //   }

    
    const files = req.files as Files;

    
    const formData = {
      ...req.body,
      // pdfFile: files['pdfFile'] && files['pdfFile'][0] ? files['pdfFile'][0].path : null,
      // imageFile: files['imageFile'] && files['imageFile'][0] ? files['imageFile'][0].path : null,
      checkboxList: Array.isArray(req.body.checkboxList) ? req.body.checkboxList : []
    };

    console.log('Received formData:', formData);

    
    FormModel.createFormData(formData)
      .then((insertId) => {
        res.status(200).json({ message: 'Form data inserted successfully', id: insertId });
      })
      .catch((error) => {
        console.error('Error inserting form data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      });
  };


// Controller function to handle fetching form data
export const viewFormData = (req: Request, res: Response): void => {
  FormModel.getFormData()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.error('Error retrieving form data:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    });
};

export const uploadFile = (req: Request, res: Response): void => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err.message });
      }
      res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    });
};
