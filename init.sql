CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER
);

INSERT INTO books (title, author, year)
VALUES
    ('1984', 'George Orwell', 1949),
    ('The Hobbit', 'J.R.R. Tolkien', 1937),
    ('Dune', 'Frank Herbert', 1965);

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

ALTER TABLE books
ADD COLUMN author_id INTEGER REFERENCES authors(id);