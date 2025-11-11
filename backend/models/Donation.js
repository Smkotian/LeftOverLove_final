const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  eventName: { type: String, required: true },
  foodType: { type: String, required: true },
  quantity: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'received'],
    default: 'pending'
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Only keep one set of coordinates
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
