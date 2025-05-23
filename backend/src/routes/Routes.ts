import express from "express";
import { userSignUp } from "../controllers/userlogin";

const router = express.Router();

router.post("/register", userSignUp);

export default router;
