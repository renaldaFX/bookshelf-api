const express = require('express');
const app = express();
const port = 9000;
const nanoid = require('nanoid');

app.use(express.json());


// data for use in the app
const books = [];

// post book
app.post('/books', (req, res) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;
  const id = nanoid.nanoid(16);
  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  };

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const book = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  if (pageCount < readPage) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  books.push(book);
  console.log(books)
  res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: book.id }
  });
})


// get all books
app.get('/books', (req, res) => {
  const { finished } = req.query;
  if (finished == 0) {
    res.status(200).json({
      status: 'success',
      data: {
        books: books.filter(book =>
          finished === "0" ? book.finished === false : book.finished === true
        ).map(b => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher
        }))
      }
    })
  } else if (finished == 1) {
    res.status(200).json({
      status: 'success',
      data: {
        books: books.filter(book =>
          finished === "1" ? book.finished === true : book.finished === false
        ).map(b => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher
        }))
      }
    })
  } else {
    res.status(200).json({
      status: 'success',
      data: {
        books: books.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher
        }))
      }
    });
  }
});

// get all finished books
app.get('/books', (req, res) => {
  const { finished } = req.query;

  res.status(200).json({
    status: 'success',
    data: [result]
  })
});


//get book by ID
app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);
  if (book !== undefined) {
    return res.status(200).json({ status: 'success', data: { book: book } });
  } else {
    // Respons ketika buku tidak ditemukan
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    });
  }
})

//edit book by ID
app.put('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  // Mendapatkan semua data update dari body
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

  // --- 1. Validasi Input Kritis ---
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  if (readPage > pageCount) {
    res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  // --- 3. Cari Index Buku yang Akan Diperbarui ---
  // findIndex mengembalikan index (>= 0) jika ditemukan, atau -1 jika tidak.
  const index = books.findIndex((b) => b.id === bookId);

  // --- 4. Handle 404 Not Found ---
  if (index === -1) {
    console.log(`[PUT FAIL] Buku dengan ID: ${bookId} tidak ditemukan.`);
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  // --- 5. Lakukan Update Buku ---
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  // Ambil data buku yang sudah ada (untuk mempertahankan id dan insertedAt)
  const existingBook = books[index];

  // Ganti objek buku lama dengan objek baru di array (menggunakan spread operator untuk mempertahankan id & insertedAt)
  books[index] = {
    ...existingBook, // Menyalin id dan insertedAt lama
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished, // Nilai finished baru dihitung
    updatedAt, // Nilai updatedAt yang baru
  };

  console.log(`[PUT SUCCESS] Buku dengan ID: ${bookId} berhasil diperbarui.`);

  // --- 6. Respon Sukses 200 ---
  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  });
});

//deleting book by ID
app.delete('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
  } else {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
  };
})

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
})
