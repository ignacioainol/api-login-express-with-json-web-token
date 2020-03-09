const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//import Routes
const authRoute = require('./routes/auth');

dotenv.config();

//connect to db
mongoose.connect(process.env.CONNECT_DB, { userNewUrlParser: true }, () => {
    console.log("connected to db!");
});

//middlewares
app.use(express.json())
//Route Middlewares
app.use('/api/user', authRoute)

app.listen(3000, () => console.log(' Server up and running '));