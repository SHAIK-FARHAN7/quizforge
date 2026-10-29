import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['bug', 'idea', 'other'], default: 'other' },
    message: { type: String, required: true, maxlength: 1000 },
    email: { type: String, default: '', maxlength: 200 },
    deviceId: { type: String, default: '' },
    page: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);