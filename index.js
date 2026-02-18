const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

const booksPath = path.join(__dirname, 'books.json');
const authorsPath = path.join(__dirname, 'authors.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

const readJson = async (file) => {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data || '[]');
};

const writeJson = async (file, data) => {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
};

const nextId = (items) => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((i) => Number(i.id) || 0)) + 1;
};

const validateYear = (required) => (req, res, next) => {
    const year = req.body.year;
    if (year === undefined || year === null || year === '') {
        if (required) return res.status(400).json({ error: 'Year is required' });
        return next();
    }
    const yearNum = Number(year);
    const maxYear = new Date().getFullYear() + 1;
    if (!Number.isInteger(yearNum) || yearNum < 1450 || yearNum > maxYear) {
        return res.status(400).json({ error: `Year must be an integer between 1450 and ${maxYear}` });
    }
    req.body.year = yearNum;
    next();
};

const parsePagination = (req) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    if (!Number.isInteger(page) || page < 1) return { error: 'page must be a positive integer' };
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) return { error: 'limit must be an integer between 1 and 100' };
    return { page, limit };
};

app.get('/', async (req, res) => {
    try {
        const [books, authors] = await Promise.all([readJson(booksPath), readJson(authorsPath)]);
        res.render('home', { books, authors });
    } catch (err) {
        res.render('home', { books: [], authors: [] });
    }
});

app.get('/books/search', async (req, res) => {
    try {
        const title = typeof req.query.title === 'string' ? req.query.title.trim() : '';
        if (!title) return res.status(400).json({ error: 'title query is required' });
        const books = await readJson(booksPath);
        const term = title.toLowerCase();
        const result = books.filter((b) => String(b.title || '').toLowerCase().includes(term));
        res.json({ total: result.length, data: result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to search books' });
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await readJson(booksPath);
        let result = books;

        if (req.query.author !== undefined) {
            const author = String(req.query.author || '').trim().toLowerCase();
            if (!author) return res.status(400).json({ error: 'author query cannot be empty' });
            result = result.filter((b) => String(b.author || '').toLowerCase() === author);
        }

        if (req.query.year !== undefined) {
            const yearNum = Number(req.query.year);
            if (!Number.isInteger(yearNum)) return res.status(400).json({ error: 'year query must be an integer' });
            result = result.filter((b) => Number(b.year) === yearNum);
        }

        const pagination = parsePagination(req);
        if (pagination.error) return res.status(400).json({ error: pagination.error });

        const { page, limit } = pagination;
        const total = result.length;
        const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const data = result.slice(start, start + limit);

        res.json({ page, limit, total, totalPages, data });
    } catch (err) {
        res.status(500).json({ error: 'Failed to load books' });
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const books = await readJson(booksPath);
        const book = books.find((b) => Number(b.id) === id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load book' });
    }
});

app.post('/books', validateYear(true), async (req, res) => {
    try {
        const title = String(req.body.title || '').trim();
        const author = String(req.body.author || '').trim();
        if (!title) return res.status(400).json({ error: 'Title is required' });
        if (!author) return res.status(400).json({ error: 'Author is required' });

        const books = await readJson(booksPath);
        const book = {
            id: nextId(books),
            title,
            author,
            year: req.body.year
        };
        books.push(book);
        await writeJson(booksPath, books);
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create book' });
    }
});

app.put('/books/:id', validateYear(true), async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const title = String(req.body.title || '').trim();
        const author = String(req.body.author || '').trim();
        if (!title) return res.status(400).json({ error: 'Title is required' });
        if (!author) return res.status(400).json({ error: 'Author is required' });

        const books = await readJson(booksPath);
        const index = books.findIndex((b) => Number(b.id) === id);
        if (index === -1) return res.status(404).json({ error: 'Book not found' });

        const updated = { id, title, author, year: req.body.year };
        books[index] = updated;
        await writeJson(booksPath, books);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

app.patch('/books/:id', validateYear(false), async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const books = await readJson(booksPath);
        const index = books.findIndex((b) => Number(b.id) === id);
        if (index === -1) return res.status(404).json({ error: 'Book not found' });

        const current = books[index];
        const title = req.body.title !== undefined ? String(req.body.title || '').trim() : current.title;
        const author = req.body.author !== undefined ? String(req.body.author || '').trim() : current.author;
        if (!title) return res.status(400).json({ error: 'Title cannot be empty' });
        if (!author) return res.status(400).json({ error: 'Author cannot be empty' });

        const updated = {
            ...current,
            title,
            author,
            year: req.body.year !== undefined ? req.body.year : current.year
        };

        books[index] = updated;
        await writeJson(booksPath, books);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const books = await readJson(booksPath);
        const index = books.findIndex((b) => Number(b.id) === id);
        if (index === -1) return res.status(404).json({ error: 'Book not found' });
        const removed = books.splice(index, 1)[0];
        await writeJson(booksPath, books);
        res.json(removed);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

app.get('/authors', async (req, res) => {
    try {
        const authors = await readJson(authorsPath);
        res.json(authors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load authors' });
    }
});

app.get('/authors/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const authors = await readJson(authorsPath);
        const author = authors.find((a) => Number(a.id) === id);
        if (!author) return res.status(404).json({ error: 'Author not found' });
        res.json(author);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load author' });
    }
});

app.post('/authors', async (req, res) => {
    try {
        const name = String(req.body.name || '').trim();
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const authors = await readJson(authorsPath);
        const author = {
            id: nextId(authors),
            name,
            country: req.body.country !== undefined ? String(req.body.country || '').trim() : ''
        };

        authors.push(author);
        await writeJson(authorsPath, authors);
        res.status(201).json(author);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create author' });
    }
});

app.put('/authors/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const name = String(req.body.name || '').trim();
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const authors = await readJson(authorsPath);
        const index = authors.findIndex((a) => Number(a.id) === id);
        if (index === -1) return res.status(404).json({ error: 'Author not found' });

        const updated = {
            id,
            name,
            country: req.body.country !== undefined ? String(req.body.country || '').trim() : ''
        };

        authors[index] = updated;
        await writeJson(authorsPath, authors);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update author' });
    }
});

app.patch('/authors/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const authors = await readJson(authorsPath);
        const index = authors.findIndex((a) => Number(a.id) === id);
        if (index === -1) return res.status(404).json({ error: 'Author not found' });

        const current = authors[index];
        const name = req.body.name !== undefined ? String(req.body.name || '').trim() : current.name;
        if (!name) return res.status(400).json({ error: 'Name cannot be empty' });

        const updated = {
            ...current,
            name,
            country: req.body.country !== undefined ? String(req.body.country || '').trim() : current.country
        };

        authors[index] = updated;
        await writeJson(authorsPath, authors);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update author' });
    }
});

app.delete('/authors/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const authors = await readJson(authorsPath);
        const index = authors.findIndex((a) => Number(a.id) === id);
        if (index === -1) return res.status(404).json({ error: 'Author not found' });
        const removed = authors.splice(index, 1)[0];
        await writeJson(authorsPath, authors);
        res.json(removed);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete author' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
