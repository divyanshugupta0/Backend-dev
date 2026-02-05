const express = require("express");
const app = express();
const port = 8000;

const fs = require('fs');
const path = require('path');
const os = require('os');

// Middleware to parse JSON body
app.use(express.json());

const students =[
        { id: 1, name: "John", age: 20, branch: "CSE" },
        { id: 2, name: "Jane", age: 22, branch: "ESE" },
        { id: 3, name: "Bob", age: 21, branch: "AIML" },
    ];


// Home route
app.get("/", (req, res) => {
    res.send("This is the Home Page");
});

// Get all students OR filter by branch
app.get("/students", (req, res) => {
    const branchName = req.query.branch;

    if (branchName) {
        const filteredStudents = students.filter(
        (s) => s.branch.toLowerCase() === branchName.toLowerCase(),
        );

    if (filteredStudents.length > 0) {
        res.json(filteredStudents);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
    } else {
        res.json(students);
    }
});

// Get student by ID
app.get("/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id);

    const student = students.find((s) => s.id === studentId);

    if (student) {
        res.json(student);
    } else {
        res.status(404).send("Student not found");
    }
});

// Add new student
app.post("/students/register", (req, res) => {
    const data = req.body;
    const foundedStudent = students.find((s) => s.id === data.id);
    if(foundedStudent){
        res.json("Student with this ID already exists");
    }else{
        students.push(data);
        fs.appendFile("./students.txt",data.req.body,(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("\nFile appended successfully");
            }
        });
    }
    res.status(201).json({
        message: "Student registered successfully",
        student: data,                          
    });
    
});

// Info route
app.route("/info").get((req, res) => {
    res.send("This is the Info Page");
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
