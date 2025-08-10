// backend/src/models/Session.ts
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['practice', 'exam'], required: true },
  domains: [{ type: String }], // Selected domains
  questions: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: { type: Number }, // User's chosen index
    correct: { type: Boolean },
    timeSpent: { type: Number }, // In seconds
  }],
  score: { type: Number }, // Calculated at end
  duration: { type: Number }, // Exam time limit in minutes (optional)
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

export default mongoose.model('Session', sessionSchema);
