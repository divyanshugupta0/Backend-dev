const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs').promises;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.get('/', async (req, res) => {
    try {
        const data = await fs.readFile('students.json', 'utf-8');
        const users = JSON.parse(data);

        res.render('form', { users });
    } catch (err) {
        res.render('form', { users: [] });
    }
});

app.post('/students/register', async (req, res) => {
    try {
        const data = await fs.readFile('students.json', 'utf-8');
        const users = JSON.parse(data);

        users.push({ 
                id : users.length + 1,
                name: req.body.name ,
                age : req.body.age,
                branch : req.body.branch
        });

        await fs.writeFile('students.json', JSON.stringify(users, null, 2));

        res.redirect('/');
    } catch (err) {
        res.send('Error saving student');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
