const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./configs/corsOptions');
const { logger } = require('./middlewares/logEvents');
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./configs/dbConn');
const mongoose = require('mongoose');
const routes = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const apiPrefix = '/api/v1';
app.use(`${apiPrefix}/`, routes);

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});