import mongoose, { Schema, Document } from "mongoose";
import User, { IUser } from "./user.model";

export interface ISender extends IUser {
    method: string;
}

const SenderSchema: Schema = new Schema({
    method: { type: String, required: true }
});

// Inherit from User
const Sender = User.discriminator<ISender>("Sender", SenderSchema);
export default Sender;
