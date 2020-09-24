var express = require('express');
var router = express.Router();
const {Course, User} = require('../models');
const Sequelize = require('sequelize');
const auth = require('../auth')

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error)
    }
  }
}

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
      model: User, 
      as: 'owner',
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'] 
      }},
    ],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt'] 
      }
  });
  res.json(courses);
}));

// GET /api/courses/:id 200 - Returns the course (including the user that owns the course) for the provided course ID
router.get("/:id", asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
  include: [
    {model: User, as: 'owner', attributes: {
      exclude: ['password', 'createdAt', 'updatedAt'] 
    }},
  ],
    attributes: {
      exclude: ['userId', 'createdAt', 'updatedAt'] 
    }
  });
  if(course) {
    res.status(200).json(course);
  }else{
    res.status(404).json({message: "Course not found"});
  }
})); 

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', auth.authenticateUser , asyncHandler(async (req, res) => {
  let course;
    course = await Course.create(req.body);
    return res.status(201).location('/api/courses/' + course.id).end(); 
}))

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/:id', auth.authenticateUser , asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({message: "You need to provide either; Title, Description, Estimated Time, Materials Needed or User ID for the owner of this course, to update"});
    }
      //Can only update course that belong to the user 
      if (req.currentUser.id === course.userId){
          course.title = req.body.quote;
          course.description = req.body.description;
          course.estimatedTime = req.body.estimatedTime;
          course.materialsNeeded = req.body.materialsNeeded;
          course.userId = req.body.userId;

          await course.update(req.body);
          res.status(204).json({message: req.currentUser}).end();

      } else {
        res.status(403).json({message: "You do not have authorization to alter this course"});
      }
  } else {
    res.status(404).json({message: "Course not found"});
  }
}))

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/:id', auth.authenticateUser , asyncHandler(async (req ,res) => {
  const course = await Course.findByPk(req.params.id);
  if(course) {
    if (req.currentUser.id === course.userId){
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({message: "You do not have authorization to delete this course"});
    }
  } else {
    res.status(404).json({message: "No record by that ID"});
  }
}));

module.exports = router