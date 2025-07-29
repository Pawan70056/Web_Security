const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  otpReset: {
    type: Number,
    default: null,
  },
  otpResetExpires: {
    type: Date,
    default: null,
  },
  profileImage: {
    type: String,
    default: null,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products', // Must match the model name in productModel.js
    },
  ],
  cartItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
    },
  ],
  failedLoginAttempts: {
    type: Number,
    default: 0, // Starts with zero failed attempts
  },
  lockUntil: {
    type: Date,
    default: null, // Account is not locked by default
  },
  passwordHistory: [
    {
      password: String,
      changedAt: { type: Date, default: Date.now }
    }
  ],
  passwordExpiresAt: { type: Date, default: Date.now },

  activeTokens: [
    {
      token: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

});

// Helper method to check if the account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
