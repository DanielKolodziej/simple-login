const express = require('express');
const historyApiFallback = require('connect-history-api-fallback');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/singin.js')
const port = 4000;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Set up Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/simple-login', { useNewUrlParser: true}).then(
  () => {console.log('Database is connected')},
  err => {console.log(`Can not connect to database ${err}`)}
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/account', apiRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info('server started on port:', port);
});

module.exports = app;
