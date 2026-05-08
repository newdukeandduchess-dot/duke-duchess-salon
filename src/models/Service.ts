import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema({
  serviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
