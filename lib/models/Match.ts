import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  userAId: mongoose.Types.ObjectId;
  userBId: mongoose.Types.ObjectId;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
  createdAt: Date;
}

const MatchSchema = new Schema<IMatch>({
  userAId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  userBId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  status: { type: String, enum: ['pending', 'scheduled', 'completed'], default: 'pending' },
  scheduledDate: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Index để tìm match nhanh
MatchSchema.index({ userAId: 1, userBId: 1 });

export const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
