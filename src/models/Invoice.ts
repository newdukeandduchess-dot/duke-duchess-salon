import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  itemType: 'service' | 'product' | 'extra';
  itemId?: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  total: number;
  staffId?: string;
  staffName?: string;
  staffCode?: string;
  notes?: string;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  customer: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet' | 'split';
  status: 'paid' | 'pending' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  itemType: { type: String, enum: ['service', 'product', 'extra'], required: true },
  itemId: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  staffId: { type: String },
  staffName: { type: String },
  staffCode: { type: String },
  notes: { type: String },
});

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  staff: { type: Schema.Types.ObjectId, ref: 'User' },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  items: [InvoiceItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true, default: 0 },
  discount: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'wallet', 'split'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['paid', 'pending', 'refunded'], 
    default: 'paid' 
  },
}, { timestamps: true });

// Clear the model from cache to ensure schema changes (like staffCode) are picked up during development
if (mongoose.models && mongoose.models.Invoice) {
  delete mongoose.models.Invoice;
}

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
