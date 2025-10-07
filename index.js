const express = require('express');
const app = express();
const port = 9000;
const nanoid = require('nanoid');

app.use(express.json());


// data for use in the app
const books = [];

app.post('/books', (req, res) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = req.body;
  const id = nanoid.nanoid(16);
  let finished = false;
  if (pageCount === readPage) {
    finished = true;
  };

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const book = {id, finished, insertedAt, updatedAt, name, year, author, summary, publisher, pageCount, readPage, reading};
  if (!name) {
    return res.status(400).send('Name is required');
  };
  books.push(book);
  res.status(201).send('Book added');
});

app.get('/books', (req, res) => {
  res.json(books).status(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
