import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple nulls/empty values
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be a positive number'],
      default: 0,
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price must be a positive number'],
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please associate this product with a category'],
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
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
  { timestamps: true }
);

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') +
    '-' +
    Math.random().toString(36).substring(2, 7);
};

ProductSchema.pre('save', async function () {
  if (this.name && !this.slug) {
    this.slug = generateSlug(this.name);
  }
});

ProductSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update.name && !update.slug) {
    update.slug = generateSlug(update.name);
  }
});

ProductSchema.pre('updateOne', async function () {
  const update = this.getUpdate();
  if (update.name && !update.slug) {
    update.slug = generateSlug(update.name);
  }
});

ProductSchema.pre('updateMany', async function () {
  const update = this.getUpdate();
  if (update.name && !update.slug) {
    update.slug = generateSlug(update.name);
  }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
