import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    deviceId: { type: String, required: true, index: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    answers: { type: [Number], default: [] },
    markedQuestions: { type: [Number], default: [] },
    weakTopics: { type: [Number], default: [] },
    timeTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Reuse the model if it already exists (needed for serverless functions)
export default mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);