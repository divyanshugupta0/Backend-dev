const express = require("express");
const app = express();
const port = 8000;

const fs = require('fs');
const path = require('path');
const os = require('os');
// import * as res from 'express/lib/response';

// Middleware to parse JSON body
app.use(express.json());//if their are multiple middlewares then we can use app.use() method to use them all at once and next() method is -

const studentsFilePath = path.join(__dirname, "students.json");

function loadStudentsFromFile(callback) {
    fs.readFile(studentsFilePath, "utf8", (err, jsonString) => {
        if (err) {
            if (err.code === "ENOENT") {
                return callback(null, []);
            }
            return callback(err);
        }

        if (!jsonString || jsonString.trim().length === 0) {
            return callback(null, []);
        }

        try {
            const parsed = JSON.parse(jsonString);
            if (!Array.isArray(parsed)) {
                return callback(new Error("students.json is not an array"));
            }
            return callback(null, parsed);
        } catch (err) {
            return callback(err);
        }
    });
}



// Home route
app.get("/", (req, res) => {
    res.send("This is the Home Page");
});

// Get all students OR filter by branch
app.get("/students", (req, res) => {
    const branchName = req.query.branch;

    loadStudentsFromFile((err, studentsArray) => {
        if (err) {
            console.log("File read failed:", err);
            return res.status(500).send("Internal Server Error");
        }

        if (branchName) {
            const filteredStudents = studentsArray.filter(
                (s) => s.branch.toLowerCase() === branchName.toLowerCase(),
            );

            if (filteredStudents.length > 0) {
                return res.json(filteredStudents);
            }
            return res.status(404).json({ message: "Student not found" });
        }

        return res.json(studentsArray);
    });
});

// Get student by ID
app.get("/students/:id", (req, res) => {
    const studentId = parseInt(req.params.id);

    loadStudentsFromFile((err, studentsArray) => {
        if (err) {
            console.log("File read failed:", err);
            return res.status(500).send("Internal Server Error");
        }

        const student = studentsArray.find((s) => s.id === studentId);

        if (student) {
            return res.json(student);
        }
        return res.status(404).send("Student not found");
    });
});

// Add new student
app.post("/students/register", (req, res) => {
    const data = req.body;
    fs.readFile(studentsFilePath, "utf8", (err, jsonString) => {
        if (err && err.code !== "ENOENT") {
            console.log("File read failed:", err);
            return res.status(500).send("Internal Server Error");
        }

        let studentsArray = [];
        if (!err && jsonString && jsonString.trim().length > 0) {
            try {
                studentsArray = JSON.parse(jsonString);
            } catch (err) {
                console.log("Error parsing JSON string:", err);
                return res.status(500).send("Internal Server Error");
            }
        }

        studentsArray.push(data);

        fs.writeFile(
            studentsFilePath,
            JSON.stringify(studentsArray, null, 2),
            (err) => {
                if (err) {
                    console.log("Error writing file:", err);
                    return res.status(500).send("Internal Server Error");
                }
                students.push(data);
                res.status(201).json(data);
            }
        );
    });
});

app.put("/students/update/:id", (req, res) => {
    const studentId = parseInt(req.params.id);
    const updatedData = req.body;

    loadStudentsFromFile((err, studentsArray) => {
        if (err) {
            console.log("File read failed:", err);
            return res.status(500).send("Internal Server Error");
        }

        const studentIndex = studentsArray.findIndex((s) => s.id === studentId);

        if (studentIndex === -1) {
            return res.status(404).send("Student not found");
        }

        studentsArray[studentIndex] = { ...studentsArray[studentIndex], ...updatedData };//rest and spread operator to update the student data

        fs.writeFile(
            studentsFilePath,
            JSON.stringify(studentsArray, null, 2),
            (err) => {
                if (err) {
                    console.log("Error writing file:", err);
                    return res.status(500).send("Internal Server Error");
                }
                res.json({message: `ID: ${studentId} updated successfully`,
                    Details: studentsArray[studentIndex]});
            }
        );
    });
});

app.delete("/students/delete/:id", (req, res) => {
    const studentId = parseInt(req.params.id);

    loadStudentsFromFile((err, studentsArray) => {
        if (err) {
            console.log("File read failed:", err);
            return res.status(500).send("Internal Server Error");
        }
        const studentIndex = studentsArray.findIndex((s) => s.id === studentId);

        if (studentIndex === -1) {
            return res.status(404).send("Student not found");
        }
        studentsArray.splice(studentIndex, 1);//we can also use filter method to remove the student from the array

        fs.writeFile(
            studentsFilePath,
            JSON.stringify(studentsArray, null, 2),
            (err) => {
                if (err) {
                    console.log("Error writing file:", err);
                    return res.status(500).send("Internal Server Error");
                }
                res.json({ message: "Student deleted successfully" });
            }
        );
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
