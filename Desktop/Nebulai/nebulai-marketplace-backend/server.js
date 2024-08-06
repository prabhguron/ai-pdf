const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = require('./app');
const User = require('./models/userModel');
const talentProfileModel = require('./models/talentProfileModel');
const companyProfileModel = require('./models/companyProfileModel');

const db = process.env.DATABASE;

let server = null;

async function connectToMongoDB() {
  //local db connection xyz
  let dbOptions = {
    useNewUrlParser: true,
    replicaSet: 'rs0',
    // useCreateIndex: true,
    // useFindAndModify: false,
  };

  if (process.env.NODE_ENV === 'production') {
    dbOptions = {
      tls: true,
      replicaSet: 'rs0',
      useNewUrlParser: true,
      readPreference: 'primary',
      user: process.env.DATABASE_USER,
      pass: process.env.DATABASE_PASSWORD,
      retryWrites: false,
      useNewUrlParser: true,
      directConnection: true,
      tlsCAFile: `../global-bundle.pem`,
    };
  }

  await mongoose.connect(db, dbOptions);
  User.createCollection();
  talentProfileModel.createCollection();
  companyProfileModel.createCollection();
  console.log('DB connected successfully');
}

connectToMongoDB()
  .then(() => {
    // Start Server Mongo
    const port = process.env.PORT || 3000;
    server = app.listen(port, () => {
      console.log(`Running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
