-- Skill 1
--Task 1

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (name)
VALUES
    ('Jakob'),
    ('Vicci');

INSERT INTO profiles (user_id, bio)
VALUES
    (1, 'Studerar Back End Development'),
    (2, 'Gillar hundar');

SELECT
    users.name,
    profiles.bio
FROM users
JOIN profiles ON users.id = profiles.user_id;


-- This gives an error since there is already a profile with user ID 1
--INSERT INTO profiles (user_id, bio)
--VALUES (1, 'En till profil för Jakob');

--task 2
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);

INSERT INTO authors (name)
VALUES
    ('George Orwell'),
    ('J.R.R. Tolkien');

INSERT INTO books (title, author_id)
VALUES
    ('1984', 1),
    ('Animal Farm', 1),
    ('The Hobbit', 2),
    ('The Lord of the Rings', 2);

SELECT
    authors.name,
    books.title
FROM authors
JOIN books ON authors.id = books.author_id;

-- This would cause an error because author_id is a foreign key and there is no author with id 999.
-- INSERT INTO books (title, author_id)
-- VALUES ('Unknown', 999);

-- Task 3

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE student_courses (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    PRIMARY KEY (student_id, course_id)
);

INSERT INTO students (name)
VALUES
    ('Jakob'),
    ('Vicci');

INSERT INTO courses (name)
VALUES
    ('SQL'),
    ('Node.js');

INSERT INTO student_courses (student_id, course_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 1);

SELECT
    students.name AS student,
    courses.name AS course
FROM students
JOIN student_courses ON students.id = student_courses.student_id
JOIN courses ON courses.id = student_courses.course_id;


-- This would cause an error since student_id and course_id must be unique
-- INSERT INTO student_courses (student_id, course_id)
-- VALUES (1, 1);
