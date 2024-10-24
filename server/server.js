const express = require("express");
const cors = require("cors");
const app = express();

const emapiRoutes = require('./api/emapi');
const userRoutes = require('./api/user');
const storageRoutes = require('./api/storage');
const stripeRoute = require('./stripe')
// Use routes
app.use('/api/emapi', emapiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/storage', storageRoutes);