import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide the associated product for this stock record'],
      unique: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be less than 0'],
    },
    initialQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Initial quantity cannot be less than 0'],
    },
    soldQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Sold quantity cannot be less than 0'],
    },
    alertThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Alert threshold cannot be less than 0'],
    },
    isInitialized: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Always clear the cached model so schema changes take effect immediately
// This is critical in Next.js dev/HMR environments
if (mongoose.models.Stock) {
  delete mongoose.models.Stock;
}

export default mongoose.model('Stock', StockSchema);
