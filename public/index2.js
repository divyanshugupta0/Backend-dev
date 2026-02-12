const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// Serve static files (optional but recommended)
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/students/register', async (req, res) => {
    try {
        const data = await fs.readFile('students.json', 'utf-8');
        const users = JSON.parse(data);

        users.push({ 
            id: users.length + 1,
            name: req.body.name,
            age: req.body.age,
            branch: req.body.branch
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
