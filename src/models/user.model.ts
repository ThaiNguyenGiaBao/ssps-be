import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    avatarUrl: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String,},
    avatarUrl: { type: String,}
});

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
