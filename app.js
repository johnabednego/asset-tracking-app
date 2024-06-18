const express = require('express');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
