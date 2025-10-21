import { Schema, model, Document } from "mongoose";

export interface IGame extends Document {
  name: string;
  shortName?: string;
  description?: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    shortName: { type: String, trim: true },
    description: { type: String, trim: true },
    points: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Game = model<IGame>("Game", GameSchema);
