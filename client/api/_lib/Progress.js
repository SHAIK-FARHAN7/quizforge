import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    deviceId: { type: String, required: true },
    understoodTopics: { type: [Number], default: [] },
    currentTopic: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One progress record per device per quiz
progressSchema.index({ quizId: 1, deviceId: 1 }, { unique: true });

// Reuse the model if it already exists (needed for serverless functions)
export default mongoose.models.Progress || mongoose.model('Progress', progressSchema);