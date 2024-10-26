const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => res.send("Include API"));

app.get("/api", (req, res) => res.send("API Gateway"));

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log("Server ready on port 3000."));

module.exports = app;