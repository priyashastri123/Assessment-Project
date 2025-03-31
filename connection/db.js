const mongoose = require('mongoose');

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        try {
            const mongoURI = 'mongodb://localhost:27017/mydatabase';
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 50000, // Increased timeout
            });
            await mongoose.connection.asPromise(); // Ensure connection is ready
            console.log('MongoDB connected successfully');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            process.exit(1);
        }
    }
}


module.exports = connectDB;
