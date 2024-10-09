import mongoose, { Schema, Document } from "mongoose";
import User, { IUser } from "./user.model";

export interface IMember extends IUser {
    email: string;
    password: string;
    isAdmin: boolean;
}

const MemberSchema: Schema = new Schema({
    email: { type: String, unique: true },
    password: { type: String,},
    isAdmin: { type: Boolean, }
});

// Inherit from User
const Member = User.discriminator<IMember>("Member", MemberSchema);
export default Member;
