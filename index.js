require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT | 3000;
const throttle = require('./middleware/throttle');
const indexRouter = require('./routes/index');

app.use(throttle(60));
app.use(cors());
app.use('/', indexRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));