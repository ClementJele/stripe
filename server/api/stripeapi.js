const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Updated CORS configuration
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "OPTIONS"],  // Added OPTIONS for preflight
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization']  // Added x-api-key explicitly
}));

app.use(express.static("public"));
app.use(express.json());

// Fixed route path - added leading slash
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    // Verify API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.REACT_APP_API_KEY) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    console.log('Received request:', req.body);

    const { items } = req.body;

    if (!items || !items.length) {
      throw new Error('No items provided');
    }
    
    // Remove the additional multiplication since it's already in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: items[0].amount, 
      currency: 'zar',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5252, () => console.log("Node server listening on port 5252!"));