const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const auth = require('../middleware/authMiddleware');

// Create donation
router.post('/', auth, async (req, res) => {
  try {
    const { eventName, foodType, quantity, location, contact, lat, lng } = req.body;

    if (!eventName || !foodType || !quantity || !location || !contact || !lat || !lng) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const donation = new Donation({
      donorId: req.user.id,
      eventName,
      foodType,
      quantity,
      location,
      contact,
      lat,
      lng,
      status: 'pending'
    });

    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending donations
router.get('/pending', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'pending' });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get accepted donations
router.get('/accepted', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'accepted' });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept donation
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted', acceptedBy: req.user.id, ngoId: req.user.id },
      { new: true }
    );
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark donation as received
router.put('/:id/received', auth, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: 'received' },
      { new: true }
    );
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/donations/new - Donor creates donation
router.post('/new', auth, async (req, res) => {
  try {
    if (req.user.role !== 'donor') return res.status(403).json({ message: 'Only donors can create donations' });
    const { eventName, foodType, quantity, location, contact, lat, lng } = req.body;
    const donation = await Donation.create({
      donorId: req.user.id,
      eventName, foodType, quantity, location, contact,
      lat: lat ?? null,
      lng: lng ?? null,
      status: 'pending'
    });
    res.status(201).json(donation);
  } catch (e) {
    console.error(e);
    // If validation failed, return a 400 with details so frontend can surface useful messages
    if (e.name === 'ValidationError' && e.errors) {
      const errors = Object.keys(e.errors).reduce((acc, key) => {
        acc[key] = e.errors[key].message || 'Invalid value';
        return acc;
      }, {});
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Failed to create donation' });
  }
});

// GET /api/donations - NGOs fetch all available donations (pending)
router.get('/', auth, async (req, res) => {
  try {
    const filter = { status: 'pending' };
    const donations = await Donation.find(filter).sort({ createdAt: -1 }).populate('donorId', 'name contact');
    res.json(donations);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
});

// Get user's own donations
router.get('/my-donations', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/donations/:id - NGO accepts or updates donation (assign ngoId and status)
router.put('/:id', auth, async (req, res) => {
  try {
    const update = {};
    if (req.user.role === 'ngo') {
      // Accept if pending
      update.ngoId = req.user.id;
      if (req.body.status) update.status = req.body.status; else update.status = 'accepted';
    } else if (req.user.role === 'donor') {
      // Donor may only update details if still pending
      const allowed = ['eventName', 'foodType', 'quantity', 'location', 'contact'];
      allowed.forEach(k => { if (req.body[k]) update[k] = req.body[k]; });
      if (req.body.lat !== undefined) update.lat = req.body.lat;
      if (req.body.lng !== undefined) update.lng = req.body.lng;
    }

    const donation = await Donation.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update donation' });
  }
});

// PUT /api/donations/:id/status - Update donation status (NGO)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ngo') return res.status(403).json({ message: 'Only NGOs can update status' });
    const { status } = req.body; // pending | accepted | delivered
    const donation = await Donation.findByIdAndUpdate(req.params.id, { status, ngoId: req.user.id }, { new: true });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// GET /api/donations/status/:userId - Fetch status for donor/NGO
router.get('/status/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    let query;
    if (req.user.role === 'donor' || req.user.id === userId) {
      query = { donorId: userId };
    } else {
      query = { ngoId: userId };
    }
    const donations = await Donation.find(query).sort({ updatedAt: -1 });
    res.json(donations);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch status list' });
  }
});

module.exports = router;
