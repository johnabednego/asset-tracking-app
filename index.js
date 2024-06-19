const serverless = require('serverless-http');
const app = require('./api/index');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
module.exports.handler = serverless(app);