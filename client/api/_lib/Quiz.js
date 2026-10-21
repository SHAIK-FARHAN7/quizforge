import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  topicId: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answerIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
});

const topicSchema = new mongoose.Schema({
  topicId: { type: Number, required: true },
  title: { type: String, required: true },
  points: { type: [String], default: [] },
  example: { type: String, default: '' },
  keyTerms: { type: [String], default: [] },
  memoryTrick: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sourceType: {
      type: String,
      enum: ['notes', 'topic', 'transcript'],
      default: 'notes',
    },
    contentOrigin: {
      type: String,
      enum: ['from_notes', 'from_ai_knowledge'],
      default: 'from_notes',
    },
    topics: { type: [topicSchema], default: [] },
    questions: { type: [questionSchema], default: [] },
    // All topic names (known early), used to show "loading" tabs
    topicNames: { type: [String], default: [] },
    // 'ready' = everything is done, 'partial' = still being created
    status: { type: String, enum: ['ready', 'partial'], default: 'ready' },
    // Lock used by /api/continue so only one request builds the quiz
    building: { type: Boolean, default: false },
    // Original text, kept only while the quiz is partial
    sourceText: { type: String, default: '' },
    timeLimit: { type: Number, default: 600 },
    inputHash: { type: String, index: true },
    deviceId: { type: String, index: true },
  },
  { timestamps: true }
);

// Reuse the model if it already exists (needed for serverless functions)
export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);