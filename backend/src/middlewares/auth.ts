// import jwt from "jsonwebtoken";

// export default (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];
//   jwt
//     .verify(token, process.env.JWT_SECRET)
//     .then((decoded) => {
//       req.userData = { userId: decoded.userId };
//       next();
//     })
//     .catch((error) => {
//       res.status(401).json({ message: "Authentication failed" });
//     });
// };


import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  userData?: { userId: string };
}

export default (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Authentication failed: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Authentication failed: Malformed token" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }
    req.userData = { userId: (decoded as { userId: string }).userId };
    next();
  });
};

