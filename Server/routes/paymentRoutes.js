
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { createPaymentOrder, capturePayPalPayment } = require('../Controller/paymentController');
router.post('/create-paypal-order', createPaymentOrder);
router.post('/capture-paypal-payment', capturePayPalPayment);

router.post('/create-checkout-session', async (req, res) => {
    const { villa, quantity } = req.body;

    console.log('Received request to create checkout session:', req.body); 

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: villa.Villaname,
                        },
                        unit_amount: Math.round(villa.price * 100), 
                    },
                    quantity: quantity || 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        console.log('Checkout session created successfully:', session.id); 
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error); 
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
