const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const localUri = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/trendydev';
  const fallbackToLocal = process.env.MONGODB_FALLBACK_LOCAL === 'true';

  try {
    const conn = await mongoose.connect(primaryUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // FIX FOR "Username null" ERROR
    // Attempt to drop the legacy 'username' index if it exists
    try {
      const collection = mongoose.connection.collection('users');
      // List indexes to debug (optional, but good for logs)
      // const indexes = await collection.indexes();
      // console.log('Current Indexes:', indexes);

      // check if username_1 exists and drop it
      const indexExists = await collection.indexExists('username_1');
      if (indexExists) {
        console.log('Detected legacy unique index on "username". Dropping it to fix registration...');
        await collection.dropIndex('username_1');
        console.log('Successfully dropped "username_1" index.');
      }
    } catch (indexErr) {
      // It's okay if it fails (e.g., index doesn't exist), just log it
      console.log('Index cleanup check:', indexErr.message);
    }

  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (fallbackToLocal) {
      console.log('Attempting fallback to local MongoDB at', localUri);
      try {
        const conn = await mongoose.connect(localUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`Fallback MongoDB connected: ${conn.connection.host}`);
        return;
      } catch (localErr) {
        console.error('Local MongoDB fallback failed:', localErr);
      }
    }
    process.exit(1);
  }
};

module.exports = connectDB;
