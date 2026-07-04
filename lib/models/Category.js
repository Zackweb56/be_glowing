// lib/models/Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

CategorySchema.pre('save', async function () {
  if (this.name && !this.slug) {
    this.slug = generateSlug(this.name);
  }
});

CategorySchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update.name && !update.slug) {
    update.slug = generateSlug(update.name);
  }
});

CategorySchema.pre('updateOne', async function () {
  const update = this.getUpdate();
  if (update.name && !update.slug) {
    update.slug = generateSlug(update.name);
  }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;