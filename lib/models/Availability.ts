import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailability extends Document {
  matchId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
}

const AvailabilitySchema = new Schema<IAvailability>({
  matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Index để tìm availability nhanh
AvailabilitySchema.index({ matchId: 1, userId: 1 }, { unique: true });

export const Availability = mongoose.models.Availability || mongoose.model<IAvailability>('Availability', AvailabilitySchema);
