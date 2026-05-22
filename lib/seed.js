/**
 * SEED SCRIPT
 * Run: node lib/seed.js
 * Creates the admin user and default engineering categories.
 * Only run once on fresh setup, or it will skip existing data.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@engineeringtutorials.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@SecurePass123!';

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not set in .env.local');
  process.exit(1);
}

// ── Inline schemas (mirrors lib/models/) ──────────────────────────────────
const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, default: 'student' }, isVerified: { type: Boolean, default: false },
  courseOfInterest: { type: String, default: 'electrical' },
  streak: { current: Number, longest: Number, lastLogin: Date, history: [Date] },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String, slug: { type: String, unique: true }, description: String,
  icon: String, color: { type: String, default: '#16a34a' }, order: Number, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// ── Default categories ─────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { name: 'Electrical & Electronics Engineering', slug: 'electrical-electronics-engineering', description: 'Circuit theory, electronics, power systems, signals & systems, and more.', icon: '⚡', color: '#f59e0b', order: 1 },
  { name: 'Civil Engineering', slug: 'civil-engineering', description: 'Structural analysis, fluid mechanics, geotechnics, construction materials.', icon: '🏗️', color: '#64748b', order: 2 },
  { name: 'Mechanical Engineering', slug: 'mechanical-engineering', description: 'Thermodynamics, mechanics, machine design, manufacturing processes.', icon: '⚙️', color: '#3b82f6', order: 3 },
  { name: 'Computer Engineering', slug: 'computer-engineering', description: 'Digital logic, computer architecture, embedded systems, VLSI design.', icon: '💻', color: '#8b5cf6', order: 4 },
  { name: 'Chemical Engineering', slug: 'chemical-engineering', description: 'Mass & energy balances, reaction engineering, transport phenomena.', icon: '🧪', color: '#ec4899', order: 5 },
  { name: 'Petroleum Engineering', slug: 'petroleum-engineering', description: 'Reservoir engineering, drilling, production, well logging.', icon: '🛢️', color: '#b45309', order: 6 },
  { name: 'Aerospace Engineering', slug: 'aerospace-engineering', description: 'Aerodynamics, propulsion, flight mechanics, spacecraft design.', icon: '🚀', color: '#0891b2', order: 7 },
  { name: 'Structural Engineering', slug: 'structural-engineering', description: 'Structural design, loads analysis, reinforced concrete, steel structures.', icon: '🏛️', color: '#16a34a', order: 8 },
  { name: 'Biomedical Engineering', slug: 'biomedical-engineering', description: 'Biomechanics, medical imaging, biosensors, bioinstrumentation.', icon: '🔬', color: '#dc2626', order: 9 },
  { name: 'Environmental Engineering', slug: 'environmental-engineering', description: 'Water treatment, air quality, waste management, sustainability.', icon: '🌿', color: '#059669', order: 10 },
];

async function seed() {
  console.log('🔌  Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('✅  Connected\n');

  // ── Admin user ─────────────────────────────────────────────────────────
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`ℹ️   Admin already exists (${ADMIN_EMAIL}) — skipping`);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: hash,
      role: 'admin',
      isVerified: true,
      courseOfInterest: 'electrical',
      streak: { current: 0, longest: 0, history: [] },
    });
    console.log(`✅  Admin created: ${ADMIN_EMAIL}`);
  }

  // ── Categories ─────────────────────────────────────────────────────────
  console.log('\n📁  Seeding categories…');
  let created = 0, skipped = 0;
  for (const cat of DEFAULT_CATEGORIES) {
    const existing = await Category.findOne({ slug: cat.slug });
    if (existing) { skipped++; continue; }
    await Category.create(cat);
    console.log(`   ✅  ${cat.name}`);
    created++;
  }
  console.log(`\n   Created: ${created}  |  Skipped (already exist): ${skipped}`);

  console.log('\n🎉  Seed complete!\n');
  console.log('Next steps:');
  console.log('  1. Start the dev server:  npm run dev');
  console.log(`  2. Log in as admin at:    http://localhost:3000/login`);
  console.log(`     Email:    ${ADMIN_EMAIL}`);
  console.log(`     Password: ${ADMIN_PASSWORD}`);
  console.log('  3. Go to /admin/tutorials/new to create your first tutorial\n');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
