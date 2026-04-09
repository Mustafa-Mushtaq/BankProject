import express from 'express';
import authRouter from './routes/auth.routes.js';
import cookieparser from 'cookie-parser';
import router from './routes/accounts.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();

app.use(cookieparser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the Bank API");
});

app.use("/api/auth", authRouter);
app.use("/api/accounts", router);  
app.use("/api/transactions", transactionRoutes);

export default app;