import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccountController, getAccountBalance, getAccountsController} from '../controllers/account.controller.js';

const router = express.Router();

/**
 * POST /api/accounts
 * Create new account
 * protected route, only authenticated users can create accounts
 */

router.post("/", authMiddleware, createAccountController);

/**
 * GET /api/accounts
 * Get all accounts for the authenticated user
 * protected route, only authenticated users can access their accounts
 */

router.get("/", authMiddleware,  getAccountsController);

/**
 * GET /api/accounts/balance/:accountId
 * Get balance for a specific account
 * protected route, only authenticated users can access their account balance
 */

router.get("/balance/:accountId", authMiddleware, getAccountBalance)

export default router;