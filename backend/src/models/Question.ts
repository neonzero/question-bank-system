// backend/src/models/Question.ts
import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }], // Array of at least 4 strings
  correctAnswer: { type: Number, required: true }, // Index of correct option (0-based)
  explanation: { type: String, required: true },
  domain: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }, // Optional
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionSchema);
