const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['poetry', 'visual-arts', 'music', 'community', 'experimental'],
      default: 'community',
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      default: null,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

eventSchema.virtual('attendeeCount').get(function () {
  return this.attendees.length;
});

eventSchema.virtual('availableSpots').get(function () {
  if (!this.capacity) return null;
  return Math.max(0, this.capacity - this.attendees.length);
});

eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);