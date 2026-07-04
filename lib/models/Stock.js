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
      required: [true, 'Please provide the stock quantity'],
      default: 0,
      min: [0, 'Quantity cannot be less than 0'],
    },
    alertThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Alert threshold cannot be less than 0'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);
