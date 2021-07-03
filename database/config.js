const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      userNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Database online!');
  } catch(error) {
    console.log(error);
    throw new Error('Cannot start database');
  }
}

module.exports = {
  dbConnection
};

