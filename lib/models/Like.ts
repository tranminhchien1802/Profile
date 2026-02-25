import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>({
  fromUserId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index để check match nhanh
LikeSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export const Like = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);
