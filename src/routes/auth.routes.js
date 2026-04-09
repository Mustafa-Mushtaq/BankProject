import express from 'express';
import { userRegisterController, userLoginController, userLogoutController } from '../controllers/auth.controller.js';

const router = express.Router();

/* Route: POST /api/auth/register */
router.post("/register", userRegisterController);

/* Route: POST /api/auth/login */
router.post("/login", userLoginController);

/* Route: POST /api/auth/logout */
router.post("/logout", userLogoutController )

export default router;