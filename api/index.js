const express = require('express');
const connectDB = require('../config/db');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
connectDB();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use('/api/auth', require('../routes/authRoutes'));
app.use('/api/assets', require('../routes/assetRoutes'));
app.use('/api/users', require('../routes/userRoutes'));

module.exports = app;




// const express = require('express');
// const cors = require('cors');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./swagger');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();

// const corsOptions = {
//   origin: ['http://localhost:3000', 'http://localhost:5000'], // Add your frontend URLs here
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// };

// // Enable CORS with options
// app.use(cors(corsOptions));

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Swagger UI setup
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Define routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/assets', require('./routes/assetRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));