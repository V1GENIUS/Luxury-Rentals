const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal environment
const environment = process.env.NODE_ENV === 'production' ? 
 new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET) :
  new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);

const client = new paypal.core.PayPalHttpClient(environment);

const createPaymentOrder = async (req, res) => {
  const { paymentMethod, villa, quantity } = req.body;

  if (!villa || !villa.price) {
    return res.status(400).json({ error: "Invalid villa data" });
  }

  try {
    if (paymentMethod === 'paypal') {
      // Create PayPal order
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (villa.price * quantity).toFixed(2),  
          },
        }],
      });

      const order = await client.execute(request);
      res.json({ orderID: order.result.id });  
        } else if (paymentMethod === 'stripe') {
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: villa.price * quantity * 100, 
        currency: 'usd',
        payment_method_types: ['card'],
        description: `Payment for ${villa.Villaname}`
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });

    } else {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ message: 'Error processing payment', error });
  }
};

// Capture PayPal payment
const capturePayPalPayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    
    // Execute the PayPal payment capture
    const captureResult = await client.execute(request);
    res.status(200).json(captureResult);
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return res.status(500).json({ message: 'Error capturing PayPal payment', error });
  }
};

module.exports = { createPaymentOrder, capturePayPalPayment };
