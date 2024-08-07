import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt
    .verify(token, process.env.JWT_SECRET)
    .then((decoded) => {
      req.userData = { userId: decoded.userId };
      next();
    })
    .catch((error) => {
      res.status(401).json({ message: "Authentication failed" });
    });
};
