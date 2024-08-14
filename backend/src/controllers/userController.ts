
import * as User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { sendResetPasswordEmail } from '../utils/emailService';


export const createUser = (req: Request, res: Response): void => {
  const { name, email, password } = req.body;

  User.create(name, email, password)
    .then(userId => {
      res.status(201).json({ message: 'User created successfully', userId });
    })
    .catch(error => {
      if (error.code === 'ER_DUP_ENTRY') {
        //Duplicate entry error
        res.status(409).json({ message: 'Email already in use', error: error.message });
      } else if (error.name === 'ValidationError') {
        res.status(422).json({ message: 'Validation error', error: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    });
};

export const loginUser = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  User.findByEmail(email)
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }

          const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
          res.json({ message: 'Login successful', token });
        });
    })
    .catch(error => {
      if (error.name === 'DatabaseError') {
        res.status(503).json({ message: 'Service Unavailable', error: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    });
};

export const forgotPassword = (req: Request, res: Response): void => {
  const { email } = req.body;

  User.findByEmail(email)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return; // We are ensuring that no code is executing after this
      }

      const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      return sendResetPasswordEmail(user.email, resetToken)
        .then(() => {
          res.json({ message: 'Password reset email sent' });
        });
    })
    .catch(error => {
      if (error.name === 'EmailServiceError') {
        res.status(503).json({ message: 'Email service unavailable', error: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    });
};



export const resetPassword = (req: Request, res: Response): void => {
  const { token, newPassword } = req.body;

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(400).json({ message: 'Invalid or expired token', error: err.message });
    }

    bcrypt.hash(newPassword, 10)
      .then(hashedPassword => {
        return User.updateUser(decoded.userId, { password: hashedPassword });
      })
      .then(() => {
        res.json({ message: 'Password reset successful' });
      })
      .catch(error => {
        if (error.name === 'DatabaseError') {
          res.status(503).json({ message: 'Service Unavailable', error: error.message });
        } else {
          res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
      });
  });
};

export const updateUser = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;
  const numericId = parseInt(id, 10);

  User.updateUser(numericId, updates)
    .then(() => {
      res.json({ message: 'User updated successfully' });
    })
    .catch(error => {
      if (error.name === 'NotFoundError') {
        res.status(404).json({ message: 'User not found', error: error.message });
      } else if (error.name === 'ValidationError') {
        res.status(422).json({ message: 'Validation error', error: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    });
};

export const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.params;
  const numericId = parseInt(id, 10);

  User.deleteUser(numericId)
    .then(() => {
      res.json({ message: 'User deleted successfully' });
    })
    .catch(error => {
      if (error.name === 'NotFoundError') {
        res.status(404).json({ message: 'User not found', error: error.message });
      } else if (error.name === 'DatabaseError') {
        res.status(503).json({ message: 'Service Unavailable', error: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    });
};


