var express = require('express');
var router = express.Router();
const {User} = require('../models');
const Sequelize = require('sequelize');
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('../auth')


/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    }catch(error){
      next(error)
    }
  }
}
  
  // Route that returns the current authenticated user using the auth.js authenticateUser function. 
router.get('/', auth.authenticateUser, asyncHandler (async (req, res) => {
  const user = req.currentUser;
  // Route that returns the current authenticated user.
      res.json({
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddress
  });
}));

// POST /api/users 201 - Creates a user
// Checks there is a all data needed for user creation. 
router.post('/',[
  check('firstName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a "firstName" with your POST request'),
  check('lastName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a "lastName" with your POST request'),
  check('emailAddress')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a valid "emailAddress" with your POST request'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a "password" with your POST request'),
],
 asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    //validation error handling
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    let user = req.body;
    user.password = bcryptjs.hashSync(user.password);
    const alreadyExists = await User.findOne({where: {emailAddress: user.emailAddress}})
    
    //Check to see if email is already in use. 
    if (alreadyExists) {
        res.status(400).json({ message: 'This email address already registered' });
    } else {      
        user = await User.create(req.body);
        return res.status(201).location('/').end();
    }
}));

module.exports = router