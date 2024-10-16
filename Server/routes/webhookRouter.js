// webhookRouter.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('./models/Payment'); // सुनिश्चित करें कि पथ सही है

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // इवेंट को हैंडल करें
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            // आवश्यक जानकारी निकालें
            const paymentDetails = {
                sessionId: session.id,
                villaName: session.display_items && session.display_items[0].custom && session.display_items[0].custom.name,
                price: session.amount_total / 100, // डॉलर में कन्वर्ट करें
                quantity: session.display_items && session.display_items[0].quantity,
                customerEmail: session.customer_details && session.customer_details.email,
                paymentStatus: session.payment_status,
            };

            try {
                const payment = new Payment(paymentDetails);
                await payment.save();
                console.log('Payment details saved to database:', payment);
            } catch (error) {
                console.error('Error saving payment to database:', error);
                return res.status(500).send('Internal Server Error');
            }
            break;
        // अन्य इवेंट्स को हैंडल करें यदि आवश्यक हो
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // इवेंट की पुष्टि करें
    res.json({ received: true });
});

module.exports = router;
