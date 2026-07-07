import mongoose from 'mongoose';

const StoreSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Be Glowing',
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
  },
  { timestamps: true }
);

export default mongoose.models.StoreSettings || mongoose.model('StoreSettings', StoreSettingsSchema);
