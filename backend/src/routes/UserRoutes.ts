import express from "express";
import { userSignUp } from "../controllers/UserControllers.js";

const router = express.Router();

router.post("/register", userSignUp);

export default router;
