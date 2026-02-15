const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs').promises;
const path = require('path');
const dataPath = path.join(__dirname, 'students.json');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const users = JSON.parse(data);

        let message = null;

        if (users.length === 0) {
            message = "User Not Found";
        }

        res.render('form', { users, message });

    } catch (err) {
        res.render('form', { users: [], message: null });
    }
});


app.post('/students/register', async (req, res) => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        const users = JSON.parse(data);
        if(users.length === 0){
            users.push({ 
                id : 1,
                name: req.body.name ,
                age : req.body.age,
                branch : req.body.branch
            });
        } else {
        users.push({ 
                id : users.length + 1,
                name: req.body.name ,
                age : req.body.age,
                branch : req.body.branch
        });
        }

        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

        res.redirect('/');
    } catch (err) {
        res.send('Error saving student');
    }
});

app.get('/students', async (req,res) => {
    try {       
        const data = await fs.readFile(dataPath, 'utf-8');
        var users = JSON.parse(data);
        let message = null;
        if(users.length === 0){
            message = "User Not Found";
        }
        res.render('students', { users,message });
    } catch (err) {
        res.render('students', { users: [], message: null });
    }
});
app.get(['/students/branch/:branch','/branch/:branch'], async (req,res) => {
    try {       
        const data = await fs.readFile(dataPath, 'utf-8');
        const users = JSON.parse(data);
        const filteredUsers = users.filter(user => user.branch.toLowerCase() === req.params.branch.toLowerCase());
        let message = null;
        if(filteredUsers.length === 0){
            message = "User Not Found";
        }
        if(req.originalUrl.startsWith('/students/branch/')){
            res.render('students', { users: filteredUsers,message });
        } else if(req.originalUrl.startsWith('/branch/')){
            res.render('form', { users: filteredUsers,message });
        }
    } catch (err) {
        res.render('students', { users: [], message: null });
    }
});
app.post(['/students/delete/:id','/delete/:id'], async (req,res) => {
    try {       
        const data = await fs.readFile(dataPath, 'utf-8');
        const users = JSON.parse(data);
        const filteredUsers = users.filter(user => user.id !== parseInt(req.params.id));
        await fs.writeFile(dataPath, JSON.stringify(filteredUsers, null, 2));
        if(req.originalUrl.startsWith('/students/delete/')){
            res.redirect('/students');
        } else if(req.originalUrl.startsWith('/delete/')){
            res.redirect('/');
        }
    }catch (err) {
        res.send('Error deleting student'); 
    }
    });
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
