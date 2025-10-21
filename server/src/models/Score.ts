import { Schema, model, Document, Types } from "mongoose";

export interface IScore extends Document {
  game: Types.ObjectId;
  team: Types.ObjectId;
  member?: Types.ObjectId; // optional, for individual points
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreSchema = new Schema<IScore>(
  {
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    member: { type: Schema.Types.ObjectId, ref: "Member" },
    points: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// You can enforce one unique combination of (game, member) or (game, team)
ScoreSchema.index(
  { game: 1, team: 1, member: 1 },
  { unique: true, sparse: true }
);

export const Score = model<IScore>("Score", ScoreSchema);
