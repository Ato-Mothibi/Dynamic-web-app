// BookService.js
class BookService {
    constructor(books) {
      this.books = books;
    }
  
    getAllBooks() {
      return this.books;
    }
  }
  
  export default BookService;
  