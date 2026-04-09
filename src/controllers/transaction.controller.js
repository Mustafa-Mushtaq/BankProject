import transactionModel from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import { sendTransactionEmailToRecipient, sendTransactionEmailToSender, sendTransactionFailureEmail } from "../services/email.service.js";
import accountModel from "../models/account.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * Create a new transaction
 * The 10-Step Transaction Creation Process:
 * - 1. Validate request
 * - 2. Validate idempotency key
 * - 3. Check account status
 * - 4. Derive SENDER balance from Ledger
 * - 5. Create Transaction (status: PENDING)
 * - 6. Create Ledger entry for SENDER (type: DEBIT)
 * - 7. Create Ledger entry for RECEIVER (type: CREDIT)
 * - 8. Update Transaction status to COMPLETED
 * - 9. Commit MongoDB Session
 * -10. Send email Notifications to both parties 
 */

async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required!"
        });
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({
            message: "Amount must be a positive number!"
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existing = await transactionModel.findOne({ idempotencyKey }).session(session);
        if (existing) {
            await session.abortTransaction();
            session.endSession();

            return res.status(200).json({
                message: `Transaction already exists with status: ${existing.status}`,
                transaction: existing
            });
        }

        const fromUserAccount = await accountModel.findById(fromAccount).populate('user').session(session);
        const toUserAccount = await accountModel.findById(toAccount).populate('user').session(session);

        if (!fromUserAccount || !toUserAccount) {
            throw new Error("From or To account not found!");
        }

        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            throw new Error("Both accounts must be ACTIVE!");
        }

        const pendingDuplicate = await transactionModel.findOne({
            fromAccount,
            toAccount,
            status: "PENDING"
        }).session(session);

        if (pendingDuplicate) {
            await session.abortTransaction();
            session.endSession();

            return res.status(409).json({
                message: "A transaction between these accounts is already pending. Please wait until it completes.",
                transaction: pendingDuplicate
            });
        }

        const balance = await fromUserAccount.getBalance();
        if (balance < amountNum) {
            throw new Error(`Insufficient balance! Current: ${balance}`);
        }

        const transaction = new transactionModel({
            type: "TRANSFER",
            fromAccount,
            toAccount,
            amount: amountNum,
            idempotencyKey,
            status: "PENDING"
        });

        await transaction.save({ session });

        await ledgerModel.create([{
            account: fromAccount,
            amount: amountNum,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            amount: amountNum,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        await sendTransactionEmailToSender(req.user.email, req.user.name, amountNum, toUserAccount.user.name, fromUserAccount.currency);
        await sendTransactionEmailToRecipient(toUserAccount.user.email, toUserAccount.user.name, amountNum, req.user.name, fromUserAccount.currency);

        return res.status(201).json({
            message: "Transaction created successfully!",
            transaction
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code === 11000 || (error.name === "MongoServerError" && error.code === 11000)) {
            const existingTransaction = await transactionModel.findOne({ idempotencyKey });
            return res.status(200).json({
                message: `Transaction already exists with status: ${existingTransaction?.status || "UNKNOWN"}`,
                transaction: existingTransaction
            });
        }

        return res.status(500).json({
            message: error.message || "Transaction failed!"
        });
    }
}

async function createInitialFundTransfer(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "To account, amount and idempotency key are required!"
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingTransaction = await transactionModel.findOne({ idempotencyKey }).session(session);
        if (existingTransaction) {
            await session.abortTransaction();
            session.endSession();

            return res.status(409).json({
                message: "Duplicate transaction detected!",
                transaction: existingTransaction
            });
        }

        const account = await accountModel.findById(toAccount).session(session);
        if (!account) {
            throw new Error("Account not found!");
        }

        const transaction = new transactionModel({
            type: "MINT",
            fromAccount: null,
            toAccount,
            amount,
            idempotencyKey,
            status: "COMPLETED"
        });

        await transaction.save({ session });

        await ledgerModel.insertMany([
            {
                account: toAccount,
                amount,
                transaction: transaction._id,
                type: "CREDIT"
            }
        ], { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Initial funds minted successfully!",
            transaction
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            message: error.message || "Transaction failed!"
        });
    }
}

export { createTransaction, createInitialFundTransfer };