import { Request, Response } from 'express';
import * as FormModel from '../models/Form'; 
import upload from '../middlewares/upload';


// interface Files {
//   [fieldname: string]: Express.Multer.File[]; // SHape of req.files
// }

export const submitForm = async (req: Request, res: Response): Promise<void> => {
  upload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err.message });
    }

    const user_id = (req as any).userData?.userId;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const formData = {
      ...req.body,
      checkboxList: Array.isArray(req.body.checkboxList) ? req.body.checkboxList : [],
      pdfFile: files && files['pdfFile'] ? files['pdfFile'][0].path : null,
      imageFile: files && files['imageFile'] ? files['imageFile'][0].path : null,
      user_id: user_id,
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
  });
};



export const viewFormData = (req: Request, res: Response): void => {
  const user_id = (req as any).userData?.userId;

  if (!user_id) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }
  FormModel.getFormData(user_id)
    .then((data) => {
      res.status(200).json(data);
      console.log(data, "This is the Forms Data on user_id")
    })
    .catch(error => {
      console.error('Error retrieving form data:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    });
};


export const editForm = async (req: Request, res: Response): Promise<void> => {
  const formId = req.params.id;

  upload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload error', error: err.message });
    }

    const user_id = (req as any).userData?.userId;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const formData = {
      ...req.body,
      checkboxList: Array.isArray(req.body.checkboxList) ? req.body.checkboxList.join(',') : req.body.checkboxList,
      pdfFile: files && files['pdfFile'] ? files['pdfFile'][0].path : null,
      imageFile: files && files['imageFile'] ? files['imageFile'][0].path : null,
      user_id: user_id,
    };

    FormModel.updateFormData(formId, formData)
      .then(() => {
        res.status(200).json({ message: 'Form data updated successfully' });
      })
      .catch((error) => {
        console.error('Error updating form data:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      });
  });
};


export const deleteForm = (req: Request, res: Response): void => {
  const formId = req.params.id;

  if (!formId) {
    res.status(400).json({ message: 'Form ID is required' });
    return;
  }

  FormModel.deleteFormData(formId)
    .then(() => {
      res.status(200).json({ message: 'Form data deleted successfully' });
    })
    .catch((error) => {
      console.error('Error deleting form data:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    });
};


//======================================================================================================


export const uploadFile = (req: Request, res: Response): void => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err.message });
      }
      res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    });
};
