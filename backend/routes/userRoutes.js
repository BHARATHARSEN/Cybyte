import express from "express";
import * as userController from "../controllers/userController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.put("/update/:id", auth, userController.updateUser);
router.delete("/delete/:id", auth, userController.deleteUser);

export default router;
