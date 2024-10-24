// Import dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
require('dotenv').config();
const Events = require("../models/event.models.js");
const Notification = require("../models/notifications.models.js"); // Import Notification model

// Middleware
app.use(express.json());

// Global Variables
const PORT = process.env.PORT || 3004;
const database = process.env.MONGO_DATABASE_CONNECT; //

// Connect to MongoDB
mongoose
  .connect(database)
  .then(() => {
    console.log("Connected to MongoDB!");
    app.listen(PORT, () => {
      console.log("Server listening on PORT:", PORT);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });

// Nodemailer configuration
const sendEmailNotification = async (event) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.EMAIL_PASSWORD // Your email password or app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.NOTIFY_EMAIL, 
    subject: 'Event Created Successfully',
    text: `You have created a new event: ${event.name} on ${event.date}.`
  };

  await transporter.sendMail(mailOptions);
};


app.post('/api/events/create', async (req, res) => {
  try {
    const event = await Events.create(req.body);

   
    await sendEmailNotification(event);

    
    const notificationMessage = `New event created: ${event.name}`;
    await Notification.create({
      eventId: event._id,
      message: notificationMessage
    });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const sendPushNotification = async (event) => {
  const message = {
    notification: {
      title: 'New Event Created',
      body: `Check out your new event: ${event.name}`,
    },
    topic: 'events', 
  };

  await admin.messaging().send(message);
};

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().populate('eventId');
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = app;
