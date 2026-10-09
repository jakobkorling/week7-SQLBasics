import express from "express";
import pool from "./db.js";
import { env } from "./env.js";
import {
  bookSchema,
  bookPatchSchema,
  bookQuerySchema,
  idParamSchema,
  type Book,
} from "./schemas.js";
import { z } from "zod";

const app = express();
const PORT = env.PORT;

app.use(express.json());

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}

app.get("/books", async (req, res) => {
  const parsedQuery = bookQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    res.status(400).json({
      errors: z.flattenError(parsedQuery.error),
    });
    return;
  }

  const { author, sort } = parsedQuery.data;
  if (author) {
    const result = await pool.query(
      "SELECT * FROM books WHERE author = $1",
      [author]
    );

    return res.json(result.rows);
  }

  if (sort) {
    const result = await pool.query(
      `SELECT * FROM books ORDER BY ${sort}`
    );

    return res.json(result.rows);
  }

  const result = await pool.query("SELECT * FROM books");

  res.json(result.rows);
});

app.get("/books/:id", async (req, res) => {
  const parsedParams = idParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      errors: z.flattenError(parsedParams.error),
    });
    return;
  }

  const { id } = parsedParams.data;

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
  const parsed = bookSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      errors: z.flattenError(parsed.error),
    });
    return;
  }

  const { title, author, year, author_id } = parsed.data;

  try {
    const result = await pool.query<Book>(
      "INSERT INTO books (title, author, year, author_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, author, year, author_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23503"
    ) {
      res.status(400).json({
        message: "Author does not exist",
      });
      return;
    }

    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
});

app.put("/books/:id", async (req, res) => {
  const parsedParams = idParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      errors: z.flattenError(parsedParams.error),
    });
    return;
  }

  const { id } = parsedParams.data;

  const parsed = bookSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      errors: z.flattenError(parsed.error),
    });
    return;
  }

  const { title, author, year, author_id } = parsed.data;

  const result = await pool.query<Book>(
    `UPDATE books
   SET title = $1,
       author = $2,
       year = $3,
       author_id = $4
   WHERE id = $5
   RETURNING *`,
    [title, author, year, author_id, id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      message: "Book not found",
    });
    return;
  }

  res.json(result.rows[0]);
});

app.delete("/books/:id", async (req, res) => {
  const parsedParams = idParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      errors: z.flattenError(parsedParams.error),
    });
    return;
  }

  const { id } = parsedParams.data;
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
  const parsedParams = idParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      errors: z.flattenError(parsedParams.error),
    });
    return;
  }

  const { id } = parsedParams.data;

  const parsed = bookPatchSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      errors: z.flattenError(parsed.error),
    });
    return;
  }

  const { title, author, year, author_id } = parsed.data;

  const result = await pool.query<Book>(
    `UPDATE books
    SET title = COALESCE($1, title),
        author = COALESCE($2, author),
        year = COALESCE($3, year),
        author_id = COALESCE($4, author_id)
    WHERE id = $5
    RETURNING *`,
    [title, author, year, author_id, id]
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
  const parsedParams = idParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      errors: z.flattenError(parsedParams.error),
    });
    return;
  }

  const { id } = parsedParams.data;
  const result = await pool.query(
    "SELECT * FROM books WHERE author_id = $1",
    [id]
  );

  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});