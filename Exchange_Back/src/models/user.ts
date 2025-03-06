import { model, Schema, Types } from "mongoose";

const userModel = new Schema({
    _id: { type: Types.ObjectId, auto: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creation_date: { type: Date, default: Date.now() },
    wallet: {
        usd: { type: Number, default: 100 },
        gbp: { type: Number, default: 100 }
    },
    refreshToken: {type: String}
});

const users = model("users", userModel);

export default users;
