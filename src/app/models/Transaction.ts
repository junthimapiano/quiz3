// models/Transaction.ts
import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  note: { type: String },
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

// models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);