const paypal = require('@paypal/checkout-server-sdk');


let environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
let client = new paypal.core.PayPalHttpClient(environment);


const createPayPalOrder = async (totalAmount) => {
  let request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: totalAmount,
      },
    }],
  });

  try {
    const order = await client.execute(request);
    return order.result;
  } catch (error) {
    console.error('PayPal Error: ', error);
    throw error;
  }
};


const capturePayPalOrder = async (orderId) => {
  let request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    return capture.result;
  } catch (error) {
    console.error('PayPal Capture Error: ', error);
    throw error;
  }
};

module.exports = { createPayPalOrder, capturePayPalOrder };
