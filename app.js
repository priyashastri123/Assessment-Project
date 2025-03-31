const express = require('express');
const router = require('./routes/index');
const connectDB = require('./connection/db')
const bodyParser = require('body-parser');
const { startMonitoring } = require('./utils/cpuMonitor');
const app = express();
const port = 3000;

// Built-in Middleware for Parsing Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Start CPU monitoring
startMonitoring();

// Connect to MongoDB
connectDB();
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
