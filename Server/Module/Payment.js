// models/Payment.js

const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    villaName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    customerEmail: { type: String },
    paymentStatus: { type: String },
    createdAt: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model('Payment', PaymentSchema);
