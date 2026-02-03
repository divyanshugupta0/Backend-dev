const express = require('express');
const app = express();
const port = 8000;

const students = [
    { id:1,name: 'John', age: 20 ,branch:'CSE'},
    { id:2,name: 'Jane', age: 22,branch:'ESE' },
    { id:3,name: 'Bob', age: 21,branch:'AIML' }
];
app.get('/', (req,res) => {
    res.send("this is the Home Page");
});
app.get('/students', (req,res) => {
    res.json(students);
});
app.get('/students/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students[studentId];
    const arrindex = students.findIndex(s => s.id === studentId);
    if(id != student){
        res.status(404).send('Student not found');
    }
    if(arrindex !== -1){
        if(student){
            res.json(student);
        }
    } else {
        res.status(404).send('Student not found');
    }
});
app.get('/students/?branch', (req,res) => {
    const branchName = req.query.branch;
    const filteredStudents = students.filter(s => s.branch.toLowerCase() === branchName.toLowerCase());
    res.json(filteredStudents);
});
app.route('/info').get((req,res) => {
    res.send("This is the Info Page");
});


app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
})