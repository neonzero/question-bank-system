// backend/src/models/Domain.ts
import mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  weight: { type: Number, default: 1 }, // For exam distribution (higher = more questions)
});

export default mongoose.model('Domain', domainSchema);
