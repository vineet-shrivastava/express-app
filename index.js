const express = require('express');
const Joi = require('joi');

const app = express();

/**
 * middleware
 * for parsing of content to json in request body
 */
app.use(express.json());

const courses = [
    { id: 1, name: 'Course1' },
    { id: 2, name: 'Course2' },
    { id: 3, name: 'Course3' },
];

/**
 * listening to root path
 */
app.get('/', (req, res) => {
    res.send('Hello World');
});

/**
 * listening to api/courses
 */
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

/**
 * loading a single course
 */
app.get('/api/courses/:id', (req, res) => {
    /**
     * checks if the course exists
     */
    const course = findCourse(req.params.id);
    res.send(course);
});

/**
 * loading a post for a specified year and month
 * req.params [returns route params]
 * req.query [returns query params]
 */
app.get('/api/posts/:year/:month', (req, res) => {
    res.send(`Year: ${req.params.year}, Month: ${req.params.month}, SortBy: ${req.query.sortBy}`);
});

/**
 * creates a new course
 */
app.post('/api/courses', (req, res) => {
    /**
     * validate course
     * object de-structuring [getting only the required properties in an object ]
     * equivalent to using result.error
     */
    const { error } = validateCourse(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    /**
     * checks if the course exists
     */
    const course = findCourse(req.params.id);
    /**
     * validate course
     * object de-structuring [getting only the required properties in an object ]
     * equivalent to using result.error
     */
    const { error } = validateCourse(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

/**
 * delete a course
 */
app.delete('/api/courses/:id', (req, res) => {
    /**
     * checks if the course exists
     */
    const course = findCourse(req.params.id);

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

function findCourse(id) {
    const course = courses.find((course) => {
        return course.id === +id;
    })
    if(!course) {
        /**
         * setting course status and a message
         */
        return res.status(404).send('Course with given id not found.');
    }
    return course;
}

function validateCourse(course) {
    /**
     * creating a validation schema using JOI
     */
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

/**
 * checking if a port is specified from outside
 * default port is 3000
 * export PORT=5000 [mac]
 * set PORT=5000 [windows]
 */
const port = process.env.PORT || 3000;
/**
 * server started and listening on port 3000
 */
app.listen(port, () => {
    console.log(`Listening on port ${port}..`);
});