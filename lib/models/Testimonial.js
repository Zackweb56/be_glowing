import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [80, 'Location cannot exceed 80 characters'],
      default: '',
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [600, 'Comment cannot exceed 600 characters'],
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

export default mongoose.models.Testimonial ||
  mongoose.model('Testimonial', TestimonialSchema);
