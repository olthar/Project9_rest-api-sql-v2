
# Full Stack JavaScript Techdegree v2 - REST API Project

A REST API using Express. The API provides a way for users to administer a school database containing information about courses: users can interact with the database by retrieving a list of courses, as well as adding, updating and deleting courses in the database.

In addition, the project will require users to create an account and log-in to make changes to the database.


You can use the project using postman

## The following routes are available
- GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
- GET /api/courses/:id 200 - Returns the course (including the user that owns the course) for the provided course ID
- POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
- PUT /api/courses/:id 204 - Updates a course and returns no content
- DELETE /api/courses/:id 204 - Deletes a course and returns no content
- GET /api/users 200 - Returns the currently authenticated user
- POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
