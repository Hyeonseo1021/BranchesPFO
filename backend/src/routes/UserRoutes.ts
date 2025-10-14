import express from "express";
import {
  userLogin,
  userSignUp,
  updateUserInfo,
  changePassword,
  deleteUser,
  me
} from "../controllers/UserController";
import  verifyToken  from "../middleware/verifyToken";
import User from "../models/User";

const UserRoutes = express.Router();

UserRoutes.post("/register", userSignUp);
UserRoutes.post("/login", userLogin); 
UserRoutes.put("/profile/:userId", verifyToken, updateUserInfo);
UserRoutes.put("/profile/:userId/password", verifyToken, changePassword);
UserRoutes.delete("/profile/:userId", verifyToken, deleteUser);
UserRoutes.get("/me", verifyToken, me);



export default UserRoutes;