import { Schema, model, Document } from "mongoose";

interface IKey extends Document {
    userId: Schema.Types.ObjectId;
    secretKey: string;
    refreshToken?: string;
    refreshTokenUsed: string[];
}

// Create the schema
const keyTokenSchema = new Schema<IKey>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Member"
        },
        secretKey: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        },
        refreshTokenUsed: {
            type: [String], // Specify type as an array of strings
            default: []
        }
    },
    {
        timestamps: true,
        collection: "Keys"
    }
);

// Create and export the model
const Key = model<IKey>("Key", keyTokenSchema);
export default Key;
