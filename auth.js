const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const {Course, User} = require('./models');

const authenticateUser = (async (req, res, next) => {
    let message = null;
  
    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    if (credentials) {
      // Look for a user whose `username` matches the credentials `name` property.
      const user = await User.findOne({where: {emailAddress: credentials.name}})
  
      if (user) {
        //Chcek if passords don't match
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication successful for username: ${user.emailAddress}`);
  
          // Store the user on the Request object.
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.emailAddress}`;
        }
      } else {
        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    if (message) {
      console.warn(message);
      res.status(401).json({ message: 'Access Denied' });
    } else {
      next();
    }
  });


    module.exports = {authenticateUser}