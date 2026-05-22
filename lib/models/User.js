import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['student', 'author', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  courseOfInterest: {
    type: String,
    enum: ['electrical', 'civil', 'mechanical', 'computer', 'chemical', 'petroleum', 'aerospace', 'structural', 'biomedical', 'environmental'],
    default: 'electrical'
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  progress: [{
    tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial' },
    pagesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TutorialPage' }],
    lastPage: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorialPage' },
    percentComplete: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  }],
  quizResults: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    tutorialPage: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorialPage' },
    score: { type: Number },
    total: { type: Number },
    answers: [{ questionIndex: Number, selectedOption: Number, correct: Boolean }],
    takenAt: { type: Date, default: Date.now },
  }],
  newsletter: { type: Boolean, default: false },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastLogin: { type: Date },
    history: [{ type: Date }],
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for authors created by admin
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateStreak = function() {
  const now = new Date();
  const last = this.streak.lastLogin;
  if (!last) {
    this.streak.current = 1;
    this.streak.lastLogin = now;
    this.streak.history.push(now);
    return;
  }
  const dayDiff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  if (dayDiff === 0) return; // same day
  if (dayDiff === 1) {
    this.streak.current += 1;
  } else {
    this.streak.current = 1;
  }
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  this.streak.lastLogin = now;
  this.streak.history.push(now);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
