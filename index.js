require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

const app = express();

// Cors
app.use(cors());

// Parse body
app.use(express.json());

dbConnection();

// Routes
app.use('/api/users', require('./routes/user.route'));
app.use('/api/login', require('./routes/auth.route'));

app.listen(process.env.PORT, () => {
  console.log('Server run on port ' + process.env.PORT);
});

