import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["MINT", "TRANSFER", "REVERSAL", "WITHDRAWAL"],
        required: true
    },
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required: false,
        index: true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:{true: "To account is required for a transaction"},
        index: true
    },
    status:{
        type: String, 
        enum:{
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message:"Status can either be PENDING, COMPLETED, FAILED or REVERSED",
        },
        default: "PENDING"
    },
    amount:{
        type: Number,
        required: {true: "Amount is required for a transaction"},
        min: [0, "Amount must be a positive number"]
    },
    // Add an idempotency key to ensure that duplicate transactions are not created in case of retries
    //generated on client side and sent with the transaction request, it should be unique for each transaction request
    idempotencyKey:{
        type: String,
        required: {true: "Idempotency key is required for a transaction"},
        index: true,
        unique: true
    }
    
},{
    timestamps: true
})

const transactionModel = mongoose.model("transaction", transactionSchema)

export default transactionModel;