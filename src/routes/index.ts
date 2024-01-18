import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

export default router;
