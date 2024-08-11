
import * as User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { sendResetPasswordEmail } from '../utils/emailService';




export const createUser = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;
  try {
    const userId = await User.create(name, email, password);
    return res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return res.json({ message: 'Login successful', token });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    await sendResetPasswordEmail(user.email, resetToken);
    return res.json({ message: 'Password reset email sent' });
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateUser(decoded.userId, { password: hashedPassword });
    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token', error: (error as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    // Convert id from string to number if necessary
    const numericId = parseInt(id, 10);
    await User.updateUser(numericId, updates);
    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  try {
    // Convert id from string to number if necessary
    const numericId = parseInt(id, 10);
    await User.deleteUser(numericId);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: (error as Error).message });
  }
};
