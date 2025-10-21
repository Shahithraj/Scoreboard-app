import { Schema, model, Document, Types } from "mongoose";

export interface ITeam extends Document {
  _id: Types.ObjectId; // ✅ Explicitly add this
  name: string;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: "Member" }],
  },
  { timestamps: true }
);

TeamSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

export const Team = model<ITeam>("Team", TeamSchema);
