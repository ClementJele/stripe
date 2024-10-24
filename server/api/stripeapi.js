const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST"],
  credentials: true,
  headers: ["Content-Type"]
}));

app.use(express.static("public"));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    console.log('Received request:', req.body);

    const { items } = req.body;

    if (!items || !items.length) {
      throw new Error('No items provided');
    }
    console.log('Amount received from frontend (in Rands):', items[0].amount/100);
    const amountInCents = Math.round(items[0].amount *100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: items[0].amount, // Stripe expects amount in cents
      currency: 'zar',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created:', paymentIntent.id);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});
const calculateOrderAmount = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += item.amount;
  });
  return total;
};

app.listen(5252, () => console.log("Node server listening on port 5252!"));