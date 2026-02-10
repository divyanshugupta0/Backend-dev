const express = require("express");
const app = express();
const port = 8000;

const fs = require('fs');
const path = require('path');
const os = require('os');
// import * as res from 'express/lib/response';

// Middleware to parse JSON body
app.use(express.json());//if their are multiple middlewares then we can use app.use() method to use them all at once and next() method is -
//  - used to pass the control to the next middleware in the stack
// like
app.use((req, res, next) => {
    console.log("This is a middleware function");
    next(); // Pass control to the next middleware
});
// if we want to return from any middleware function then we can use return statement to stop the -
// -execution of the middleware and return the response to the client
// like example
app.use((req,res) => {
    console.log("This is the last middleware function");
    res.status(200).json(student);
});

// - we can also use middleware to handle errors in our application
// like example
app.use((err, req, res, next) => {
    console.error(err.stack);   
    res.status(500).send("Something broke!");
    next(); // Pass control to the next middleware
});

app.use((req, res) => {
    res.status(404).send("Page not found");
    next(); // Pass control to the next middleware
});

const logger = () => {
    const log = `Request received at ${new Date().toISOString()}  Method : ${req.method}  URL : ${req.url}`;
    fs.appendFile("serverLog.txt", log, (err) => {
        if (err) {
            console.error("Failed to write to log file:", err);
        }
        console.log("Log written to serverLog.txt");
    });
    next(); // Pass control to the next middleware
};
// Note: The logger middleware is defined but not used in the code. To use it, you can add the following line before the other middleware functions:
app.use(logger); // Use the logger middleware for all routes

const studentsFilePath = path.join(__dirname, "students.json"); 
module.exports = { studentsFilePath };
const student = require('./students.json');
app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);

});
module.exports = app;
