const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/books", async (req, res) => {
    const { author, sort } = req.query;

    if (author) {
        const result = await pool.query(
            "SELECT * FROM books WHERE author = $1",
            [author]
        );

        return res.json(result.rows);
    }

    if (sort === "year") {
        const result = await pool.query(
            "SELECT * FROM books ORDER BY year"
        );

        return res.json(result.rows);
    }

    const result = await pool.query("SELECT * FROM books");

    res.json(result.rows);
});

app.get("/books/:id", async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT * FROM books WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(result.rows[0]);
});

app.post("/books", async (req, res) => {
    const { title, author, year, author_id } = req.body;

    if (!title || !author || !year) {
        return res.status(400).json({
            message: "Title, author and year are required"
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO books (title, author, year, author_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, author, year, author_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                message: "Author does not exist"
            });
        }

        throw error;
    }
});

app.delete("/books/:id", async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM books WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(result.rows[0]);
});

app.patch("/books/:id", async (req, res) => {
    const { id } = req.params;
    const { title, author, year } = req.body;

    const result = await pool.query(
        `UPDATE books
         SET title = COALESCE($1, title),
             author = COALESCE($2, author),
             year = COALESCE($3, year)
         WHERE id = $4
         RETURNING *`,
        [title, author, year, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(result.rows[0]);
});

app.get("/authors", async (req, res) => {
    const result = await pool.query("SELECT * FROM authors");

    res.json(result.rows);
});

app.post("/authors", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    const result = await pool.query(
        "INSERT INTO authors (name) VALUES ($1) RETURNING *",
        [name]
    );

    res.status(201).json(result.rows[0]);
});

app.get("/authors/:id/books", async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT * FROM books WHERE author_id = $1",
        [id]
    );

    res.json(result.rows);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});