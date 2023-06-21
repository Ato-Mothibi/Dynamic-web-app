// Usage
import BookService from './books';
import SearchService from './search';
import PreviewService from './preview';
import SettingsService from './settings.js';
import BookApp from './bookApp';
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

const bookService = new BookService(books);
const searchService = new SearchService(books, authors, genres);
const previewService = new PreviewService(books, authors);
const settingsService = new SettingsService();

const app = new BookApp(bookService, searchService, previewService, settingsService);
app.initializeApp();
