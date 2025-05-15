const cors =  require('cors')
const express = require('express')
const app = express()

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};


const {initialiseDatabase} = require('./db/db.connect')
const Book = require('./models/book.models')

app.use(cors(corsOptions));
app.use(express.json())
initialiseDatabase()

// add book

async function createBook(bookData){
    try {
        const newBook = new Book(bookData)
        const savedBook = await newBook.save()
        return savedBook
    } catch (error) {
        throw error
    }
}

app.post("/books", async (req, res) => {
    try {
        const savedBook = await createBook(req.body)
        savedBook && res.status(201).json({message: "Book added successfully", book: savedBook})
    } catch (error) {
        res.status(500).json({error: "Failed to add book"})
    }
})

// get all books

async function readAllBook(){
    try {
        const books = await Book.find()
        return books
    } catch (error) {
        throw error
    }
}

app.get("/books", async (req, res) => {
    try {
        const allBooks = await readAllBook()
        if(allBooks.length != 0){
            res.json(allBooks)
        } else {
            res.status(404).json({error: "No book found"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to get books"})
    }
})

// get book by title

async function readBookByTitle(bookTitle){
    try {
        const book = await Book.findOne({title: bookTitle})
        return book
    } catch (error) {
        throw error
    }
}

app.get("/books/:bookTitle", async (req, res) => {
    try {
        const book = await readBookByTitle(req.params.bookTitle)
        if(book){
            res.json(book)
        } else {
            res.status(404).json({error: "Book not found"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch book"})
    }
})

// get all books by author

async function readBooksByAuthor(authorName){
    try {
        const books = await Book.find({author: authorName})
        return books
    } catch (error) {
        throw error
    }
}

app.get("/books/author/:authorName", async (req, res) => {
    try {
        const books = await readBooksByAuthor(req.params.authorName)
        if(books.length != 0){
            res.json(books)
        } else {
            res.status(404).json({error: "No book found"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch book"})
    }
})

// get all books by genre

async function readBooksByGenre(genreType){
    try {
        const books = await Book.find({genre: genreType})
        return books
    } catch (error) {
        throw error
    }
}

app.get("/books/genre/:genreName", async (req, res) => {
    try {
        const books = await readBooksByGenre(req.params.genreName)
        if(books.length != 0){
            res.json(books)
        } else {
            res.status(404).json({error: "No book found"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch books"})
    }
})

// get books by year

async function readBooksByYear(year){
    try {
        const books = await Book.find({publishedYear: year})
        return books
    } catch (error) {
        throw error
    }
}

app.get("/books/year/:publishedYear", async (req, res) => {
    try {
        const books = await readBooksByYear(req.params.publishedYear)
        if(books.length != 0){
            res.json(books)
        } else {
            res.status(404).json({error: "No book found"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch book"})
    }
})

// update book by id

async function updateBookData(bookId, dataToUpdate){
    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true})
        return updatedBook
    } catch (error) {
        throw error
    }
}

app.post("/books/:bookId", async (req, res) => {
    try {
        const updatedBook = await updateBookData(req.params.bookId, req.body)
        
        if(updatedBook){
            res.status(201).json({message: "Book updated successfully", book: updatedBook})
        } else {
            res.status(404).json({error: "Book does not exist"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update book"})
    }
})

// update book by it's title

async function updateBookByTitle(bookTitle, dataToUpdate){
    try {
        const bookToUpdate = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new: true})
        return bookToUpdate
    } catch (error) {
        throw error
    }
}

app.post("/books/title/:bookTitle", async (req, res) => {
    try {
        const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body)
        if(!updatedBook){
            res.status(404).json({error: "Book does not exist"})
        } else {
            res.json({message: "Book updated successfully", book: updatedBook})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update book"})
    }
})

// delete book by id

async function deleteBookById(bookId){
    try {
        const movieToDelete = await Book.findByIdAndDelete(bookId)
        return movieToDelete
    } catch (error) {
        throw error
    }
}

app.delete("/books/:bookId", async (req, res) => {
    try {
        const deletedBook = await deleteBookById(req.params.bookId)
        
        if(!deletedBook){
            res.status(404).json({error: "Book not found"})
        } else {
            res.json({message: "Book deleted successfully"})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete book"})
    }
})

// listen requests

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})