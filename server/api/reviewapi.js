const express = require('express');
const Review = require('../models/review.models'); 
const app = express();
const cors = require('cors');
app.use(cors()); // enforce cors later
app.use(express.json());
const apiKeyAuth = require('../Authorization/auth');
require('dotenv').config();


const mongoose = require("mongoose");

const PORT = process.env.ENV || 3005;
const database = process.env.MONGO_DATABASE_CONNECT;


app.use(apiKeyAuth);

// POST: Submit a new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { rating, feedback, userID } = req.body;

    
    if (!rating || rating < 1 || rating > 5 || !feedback || !userID) {
      return res.status(400).json({ message: 'Invalid data provided' });
    }


    const newReview = new Review({
      rating,
      feedback,
      userID
    });

 
    const savedReview = await newReview.save();

    res.status(201).json({
      message: 'Review submitted successfully',
      review: savedReview
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
});


app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find(); 
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    console.log('Received request:', req.body);

    const { items } = req.body;

    if (!items || !items.length) {
      throw new Error('No items provided');
    }
    
    const amountInCents = Math.round(items[0].amount *100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: items[0].amount, 
      currency: 'zar',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    
    res.status(500).json({ error: error.message });
  }
});


mongoose.set("strictQuery", false);
mongoose
  .connect(database)
  .then(() => {
    console.log("Connected!");
    app.listen(PORT, () => {
      console.log("Server Listening on PORT:", PORT);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  }); 

  app.post('/api/reviews/create', async (req, res) => {
    try {
      const { rating, feedback, userID, eventID } = req.body;
  
      if (!rating || rating < 1 || rating > 5 || !feedback || !userID || !eventID) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const review = await Review.create({
        rating,
        feedback,
        userID,
        eventID,
        createdAt: new Date()
      });
  
      // Update event's average rating
      const eventReviews = await Review.find({ eventID });
      const averageRating = eventReviews.reduce((acc, curr) => acc + curr.rating, 0) / eventReviews.length;
      await Events.findByIdAndUpdate(eventID, { averageRating }, { new: true });
  
      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await Review.find();
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/reviews/event/:eventID', async (req, res) => {
    try {
      const { eventID } = req.params;
      const reviews = await Review.find({ eventID });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/reviews/user/:userID', async (req, res) => {
    try {
      const { userID } = req.params;
      const reviews = await Review.find({ userID });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Payment endpoints
  app.post('/api/payments/create-intent', async (req, res) => {
    try {
      const { amount, currency = 'zar', eventID, userID } = req.body;
  
      if (!amount || amount <= 0 || !eventID || !userID) {
        return res.status(400).json({ error: 'Invalid payment details' });
      }
  
      const amountInCents = Math.round(amount * 100);
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        metadata: {
          eventID,
          userID
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
  
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post('/api/payments/confirm/:paymentIntentId', async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update event registration status or create payment record in your database
        // You might want to create a Payment model for this
        res.status(200).json({ status: 'Payment confirmed', paymentIntent });
      } else {
        res.status(400).json({ error: 'Payment not successful' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.get('/api/payments/status/:paymentIntentId', async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      res.status(200).json({ status: paymentIntent.status });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });