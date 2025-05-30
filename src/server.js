const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

//XQaTJHlXPwILSwhI
// Load env vars
dotenv.config({ path: './src/config/config.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Route files
const auth = require('./routes/auth');
const requirement = require('./routes/requirement');
const coins = require('./routes/coins');
const profile = require('./routes/profile');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/requirements', requirement);
app.use('/api/coins', coins);
app.use('/api/profile', profile);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 