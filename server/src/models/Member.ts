import { Schema, model, Document, Types } from "mongoose";

export interface IMember extends Document {
  _id: Types.ObjectId; // ✅ Explicitly define it
  name: string;
  role?: string;
  team: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  },
  { timestamps: true }
);

export const Member = model<IMember>("Member", MemberSchema);
