import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  phone: string;
  role: 'stylist' | 'receptionist' | 'manager' | 'ceo' | 'other';
  code: string; // Staff code for billing
  specialization?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['stylist', 'receptionist', 'manager', 'ceo', 'other'], 
    default: 'stylist' 
  },
  code: { type: String, required: true, unique: true },
  specialization: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
}, { timestamps: true });

// Ensure the model is deleted from cache during development to pick up schema changes
if (mongoose.models && mongoose.models.Staff) {
  delete mongoose.models.Staff;
}

export default mongoose.model<IStaff>('Staff', StaffSchema);
