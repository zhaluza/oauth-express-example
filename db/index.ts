import mongoose from 'mongoose';

const dbUri = process.env.DB_URI;

if (!dbUri) throw new Error('Database URI must be provided!');

const initializeDb = () => {
  mongoose.connect(
    dbUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) {
        console.log(`Error connecting to ${dbUri}: ${err}`);
      } else {
        console.log(`Successfully connected to ${dbUri}`);
      }
    }
  );

  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log('Connected to MongoDB');
  });
};

export default initializeDb;
