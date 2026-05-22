import mongoose from 'mongoose';

const TutorialPageSchema = new mongoose.Schema({
  tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial', required: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  quiz: {
    enabled: { type: Boolean, default: false },
    questions: [{
      question: { type: String, required: true },
      options: [{ type: String }],
      correctOption: { type: Number, required: true },
      explanation: { type: String },
    }],
  },
  metaDescription: { type: String },
  readingTime: { type: Number, default: 5 },
}, { timestamps: true });

TutorialPageSchema.index({ tutorial: 1, slug: 1 }, { unique: true });

const TutorialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' },
  rejectionReason: { type: String },
  tags: [{ type: String }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  totalPages: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }],
}, { timestamps: true });

TutorialSchema.index({ slug: 1 });
TutorialSchema.index({ category: 1, status: 1 });
TutorialSchema.index({ featured: 1, status: 1 });
TutorialSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const TutorialPage = mongoose.models.TutorialPage || mongoose.model('TutorialPage', TutorialPageSchema);
export const Tutorial = mongoose.models.Tutorial || mongoose.model('Tutorial', TutorialSchema);
