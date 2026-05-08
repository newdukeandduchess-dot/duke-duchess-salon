import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  customer: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  services: mongoose.Types.ObjectId[];
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'], 
    default: 'scheduled' 
  },
  totalAmount: { type: Number, required: true },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
