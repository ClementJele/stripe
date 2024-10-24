
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors()); // enforce cors later
app.use(express.json());

const Events = require("../models/event.models");
const Registration = require("../models/registration.models"); // Import Registration model
const mongoose = require("mongoose");
const apiKeyAuth = require('../Authorization/auth');
require('dotenv').config();

// GLOBAL VARIABLES
const PORT = process.env.ENV || 3006;
const database = process.env.MONGO_DATABASE_CONNECT;
const schemaFields = ["name", "description", "date", "duration", "location", "poster", "capacity", "creator"];

// MIDDLEWARE

app.use(apiKeyAuth);

// REQUESTS

app.get('/api/events', async (req, res) => {
  try{
    const events = await Events.find();
    res.status(200).json(events);
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
});

app.get('/api/events/:id', async (req, res) => {
  try{
    const events = await Events.findById({_id: req.params.id});
    res.status(200).json(events);
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
});

app.get('/api/events/:field/:value', async (req, res) => {
  try {
    const field = req.params.field;
    const value = req.params.value;
    if(schemaFields.includes(field)){
      const events = await Events.find().where(field).equals(value);
      res.status(200).json(events);
    }
    else{
      res.status(400).send({error: "Bad Request"});
    }
  } catch (error) {
    res.status(500).send({message: error.message})
  }
})

app.post('/api/events/create', async (req, res) => {
  try {
    const event = await Events.create(req.body);
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New registration endpoint
app.post('/api/events/:eventID/register', async (req, res) => {
  try {
    const { eventID } = req.params;
    const { fullName, studentNumber, email, phone, creator, userID } = req.body;

    console.log('Request Body:', req.body);

    const existingRegistration = await Registration.findOne({ eventID, userID });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You have already registered for this event.' });
    }

    console.log('Creator Object:', creator);

    // Validate creator object
    if (!creator || typeof creator !== 'object') {
      return res.status(400).json({ message: 'Invalid creator data.' });
    }

    const registrationData = {
      eventID,
      fullName,
      studentNumber,
      email,
      phone,
      creator: {
        name: creator.name || 'N/A',
        surname: creator.surname || 'N/A',
        email: creator.email || 'N/A',
        _id: creator._id || userID // Use userID as fallback for _id
      },
      userID,
    };

    console.log('Registration Data:', registrationData);

    const registration = await Registration.create(registrationData);

    const registrationCount = await Registration.countDocuments({ eventID });
    await Events.findByIdAndUpdate(eventID, { registrationCount }, { new: true });

    console.log('Saved Registration:', registration);

    res.status(200).json({
      message: 'Registration successful',
      registration: {
        ...registration.toObject(),
        creator: registration.creator,
        userID: registration.userID
      }
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ error: error.message });
  }
});



app.get('/api/events/:id/:field', async (req, res) => {
  try {
    const eventID = req.params.id;
    const field = req.params.field;
    if(schemaFields.includes(field)){
      const event = await Events.find({_id: eventID});
      res.status(200).json({[field]: event[0][field]});
    }
    else{
      res.status(400).send({error: "Bad Request"})
    }
  } catch (error) {
    res.status(500).send({message: error.message})
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Events.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true});
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
});

app.put('/api/events/like/:id', async (req, res) => {
  try {
    const event = await Events.findByIdAndUpdate(
      {_id: req.params.id},
      { $inc: { likes: 1 } }, // Increment likes by 1
      { new: true } // Return the updated document
    );
    res.status(200).send(event);
  } catch (error) {
    res.status(500).send({error: error.message});
  }
})

app.delete('/api/events/:id', async (req, res) => {
  try {
    await Events.findByIdAndDelete({_id: req.params.id});
    res.status(200).send({status: "Event successfully deleted"});
  } catch (error) {
    res.status(500).send({error: error.message})
  }
});

// New route to fetch registered events for a user
app.get('/api/user/:userID/tickets', async (req, res) => {
  try {
    const userID = req.params.userID;
    
    // Fetch all registrations for this user
    const registrations = await Registration.find({ userID: userID });
    
    if (!registrations || registrations.length === 0) {
      return res.status(404).json({ message: "No tickets found for this user." });
    }

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching tickets for user:", error.message);
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
