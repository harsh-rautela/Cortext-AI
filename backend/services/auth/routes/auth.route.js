import express from "express"
import {deductCredits, login, logout, UpdateUserPayment} from  "../controllers/auth.controller.js"
const router = express.Router();
router.post("/login",login)
router.post("/logout",logout)
router.post("/update-plan",UpdateUserPayment);
router.post("/deduct-credits",deductCredits);
export default router;