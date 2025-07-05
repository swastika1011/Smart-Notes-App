import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topicTitle: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  subjectTag: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Note || mongoose.model('Note', noteSchema); 