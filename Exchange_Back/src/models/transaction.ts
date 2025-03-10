import { model, Schema, Types } from "mongoose";

const transactionModel = new Schema({
    _id: { type: Types.ObjectId, auto: true, required: true },
    user_id: { type: Types.ObjectId, required: true },
    amount: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    rate: {type: String},
    transaction_date: { type: Date, default: Date.now },
});

const transactions = model("transaction", transactionModel);

export default transactions;
