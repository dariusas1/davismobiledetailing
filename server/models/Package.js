const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  services: [{
    type: String
  }],
  duration: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  isPopular: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Package', packageSchema);
