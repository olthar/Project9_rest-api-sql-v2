'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');

// const sequelize = require('./models').sequelize;


const indexRouter = require('./routes/index');
const coursesRouter = require('./routes/courses');
const usersRouter = require('./routes/users');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(express.json());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here
app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);


// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!, Connection working!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => error.message);
    res.status(400).json(errors);   
  } else {
      res.status(err.status || 500).json({
        message: err.message,
        name: err.name,
        error: {},
      });
  }
});

// set our port
app.set('port', process.env.PORT || 5000);

// Test connection to the database and sync the models
// start listening on our port

console.log('Testing the connection to the database...');
(async () => {
  try {
    // Test the connection to the database
    console.log('Connection to the database successful!');
    await sequelize.authenticate();

    // Sync the models
    console.log('Synchronizing the models with the database...');
    await sequelize.sync;

    const server = await app.listen(app.get('port'), () => {
      console.log(`Express server is listening on port ${server.address().port}`);
    })

  } catch(error) {
    console.error('Error on start-up:', error);
  }
})();
