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
      enum: ['performing-arts', 'visual-arts', 'festivals', 'community', 'workshops', 'film', 'public-art', 'wellness', 'kid-friendly', 'parks'],
      default: 'community',
    },
    neighborhood: {
      type: String,
      enum: ['ward-a', 'ward-b', 'ward-c', 'ward-d', 'ward-e', 'ward-f'],
      required: [true, 'Neighborhood / ward is required'],
    },
    venueSubarea: {
      type: String,
      trim: true,
      maxlength: [80, 'Subarea cannot exceed 80 characters'],
      default: '',
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
      default: null,
    },
    isFree: {
      type: Boolean,
      required: [true, 'Please specify if this event is free or paid'],
      default: true,
    },
    ticketPrice: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: null,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    rsvpUrl: {
      type: String,
      trim: true,
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