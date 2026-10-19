import mongoose from 'mongoose';

const usageSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true },
    // Date in YYYY-MM-DD format (UTC)
    day: { type: String, required: true },
    count: { type: Number, default: 0 },
    // Old records delete themselves automatically after 2 days
    createdAt: { type: Date, default: Date.now, expires: 172800 },
  }
);

// One record per device per day
usageSchema.index({ deviceId: 1, day: 1 }, { unique: true });

// Reuse the model if it already exists (needed for serverless functions)
export default mongoose.models.Usage || mongoose.model('Usage', usageSchema);