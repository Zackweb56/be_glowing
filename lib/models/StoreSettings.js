import mongoose from 'mongoose';

const StoreSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Be Glowing',
      trim: true,
    },
    // Branding
    logoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    // SEO
    siteTitle: {
      type: String,
      default: 'Be Glowing | Premium Jewelry & Accessories',
      trim: true,
    },
    seoDescription: {
      type: String,
      default: 'Discover timeless, premium jewelry and accessories crafted to elevate your style. Shop the latest collections from Be Glowing.',
      trim: true,
    },
    seoKeywords: {
      type: String,
      default: 'jewelry, accessories, be glowing, morocco',
      trim: true,
    },
    contactEmail: {
      type: String,
      default: 'contact@beglowing.com',
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: 'Morocco',
      trim: true,
    },
    currency: {
      type: String,
      default: 'MAD',
      trim: true,
    },
    instagram: {
      type: String,
      default: '',
      trim: true,
    },
    facebook: {
      type: String,
      default: '',
      trim: true,
    },
    tiktok: {
      type: String,
      default: '',
      trim: true,
    },
    whatsapp: {
      type: String,
      default: '+212',
      trim: true,
    },
    shippingPolicy: {
      type: String,
      default: '',
    },
    privacyPolicy: {
      type: String,
      default: '',
    },
    returnPolicy: {
      type: String,
      default: '',
    },
    announcements: [
      {
        text: { type: String, required: true },
        url: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
      }
    ],
    // Theme & Appearance
    themePrimaryColor: {
      type: String,
      default: '#B8963E', // Default Be Glowing gold
      trim: true,
    },
    themeSecondaryColor: {
      type: String,
      default: '#E8E4DF', // Default Be Glowing secondary
      trim: true,
    },
    themePrimaryFont: {
      type: String,
      default: 'Inter',
      trim: true,
    },
    themeSecondaryFont: {
      type: String,
      default: 'Inter',
      trim: true,
    },
    // Hero Section
    heroType: {
      type: String,
      enum: ['creative', 'simple'],
      default: 'creative',
    },
    heroBackgroundImage: {
      type: String,
      default: '',
    },
    heroTitle: {
      type: String,
      default: 'Reveal Your Natural Glow',
    },
    heroSubtitle: {
      type: String,
      default: 'Premium jewelry & accessories crafted to elevate your style.',
    },
  },
  { timestamps: true }
);

export default mongoose.models.StoreSettings || mongoose.model('StoreSettings', StoreSettingsSchema);
