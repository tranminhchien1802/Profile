import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 100 },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  bio: { type: String, default: '' },
  email: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Profile = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
