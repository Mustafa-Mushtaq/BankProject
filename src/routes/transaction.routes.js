import express from 'express';
import { authMiddleware, authSystemUserMiddleware } from '../middleware/auth.middleware.js';
import { createTransaction, createInitialFundTransfer } from '../controllers/transaction.controller.js';

const transactionRoutes = express.Router();

/**
 * POST /api/transactions
 * Create a new transaction
 * protected route, only authenticated users can create transactions
 */
transactionRoutes.post("/", authMiddleware, createTransaction);

/**
 * POST /api/transactions/system/initial-funds
 * Create initial fund transfer transactions from system account to user accounts
 * This route is protected and can only be accessed by system users (e.g. admin)
 */
transactionRoutes.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundTransfer);

export default transactionRoutes;