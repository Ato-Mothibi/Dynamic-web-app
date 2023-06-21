import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

class BookApp {
  constructor(bookService, searchService, previewService, settingsService) {
    this.page = 1;
    this.matches = [];
    this.bookService = bookService;
    this.searchService = searchService;
    this.previewService = previewService;
    this.settingsService = settingsService;
  }

  async initializeApp() {
    const books = await this.bookService.getAllBooks();
    const startingItems = this.previewService.populatePreviewItems(0, BOOKS_PER_PAGE, books);
    const genreHtml = this.searchService.populateGenres();
    const authorsHtml = this.searchService.populateAuthors();
    this.previewService.appendPreviewItems(startingItems);
    this.searchService.appendGenres(genreHtml);
    this.searchService.appendAuthors(authorsHtml);
    this.settingsService.setTheme();
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.settingsService.setTheme('night');
    } else {
      this.settingsService.setTheme('day');
    }
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.searchService.setSearchCancelButton(() => {
      this.searchService.closeSearchOverlay();
    });

    this.searchService.setSearchButton(() => {
      this.searchService.openSearchOverlay();
    });

    this.previewService.setListItemsClick((active) => {
      this.previewService.openPreview(active);
    });

    this.searchService.setSearchForm((formData) => {
      const result = this.searchService.searchBooks(formData);
      this.page = 1;
      this.matches = result;
      this.previewService.clearPreviewItems();
      const newItems = this.previewService.populatePreviewItems(0, BOOKS_PER_PAGE, this.matches);
      this.previewService.appendPreviewItems(newItems);
      this.previewService.updateListButtonRemaining(this.page, this.matches.length);
      this.searchService.closeSearchOverlay();
    });

    this.previewService.setListButton(() => {
      const startIndex = this.page * BOOKS_PER_PAGE;
      const endIndex = (this.page + 1) * BOOKS_PER_PAGE;
      const fragment = this.previewService.populatePreviewItems(startIndex, endIndex, this.matches);
      this.previewService.appendPreviewItems(fragment);
      this.page += 1;
      this.previewService.updateListButtonRemaining(this.page, this.matches.length);
    });

    // this.previewService.setListItemsClick((node) => {
    //   const active = this.previewService.getActiveBook(node);
    //   if (active) {
    //     this.previewService.openPreview(active);
    //   }
    // });

    this.settingsService.setSettingsCancelButton(() => {
      this.settingsService.closeSettingsOverlay();
    });

    this.settingsService.setSettingsButton(() => {
      this.settingsService.openSettingsOverlay();
    });

    this.settingsService.setSettingsForm((formData) => {
      const { theme } = formData;
      this.settingsService.setTheme(theme);
      this.settingsService.closeSettingsOverlay();
    });
  }
}


//BookService class handles the retrieval of books.
class BookService {
  constructor(books) {
    this.books = books;
  }

  getAllBooks() {
    return Promise.resolve(this.books);
  }
}

//SearchService class handles search-related functionality.
class SearchService {
  constructor(books, authors, genres) {
    this.books = books;
    this.authors = authors;
    this.genres = genres;
  }

  populateGenres() {
    const genreHtml = document.createDocumentFragment();
    const firstGenreElement = document.createElement('option');
    firstGenreElement.value = 'any';
    firstGenreElement.innerText = 'All Genres';
    genreHtml.appendChild(firstGenreElement);
    for (const [id, name] of Object.entries(this.genres)) {
      const element = document.createElement('option');
      element.value = id;
      element.innerText = name;
      genreHtml.appendChild(element);
    }
    return genreHtml;
  }

  populateAuthors() {
    const authorsHtml = document.createDocumentFragment();
    const firstAuthorElement = document.createElement('option');
    firstAuthorElement.value = 'any';
    firstAuthorElement.innerText = 'All Authors';
    authorsHtml.appendChild(firstAuthorElement);
    for (const [id, name] of Object.entries(this.authors)) {
      const element = document.createElement('option');
      element.value = id;
      element.innerText = name;
      authorsHtml.appendChild(element);
    }
    return authorsHtml;
  }

  setSearchCancelButton(callback) {
    document.querySelector('[data-search-cancel]').addEventListener('click', callback);
  }

  setSearchButton(callback) {
    document.querySelector('[data-header-search]').addEventListener('click', callback);
  }

  setSearchForm(callback) {
    document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const filters = Object.fromEntries(formData);
      callback(filters);
    });
  }

  searchBooks(filters) {
    const result = [];
    for (const book of this.books) {
      let genreMatch = filters.genre === 'any';
      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }
      if (
        (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }
    return result;
  }

  appendGenres(genreHtml) {
    document.querySelector('[data-search-genres]').appendChild(genreHtml);
  }

  appendAuthors(authorsHtml) {
    document.querySelector('[data-search-authors]').appendChild(authorsHtml);
  }

  closeSearchOverlay() {
    document.querySelector('[data-search-overlay]').open = false;
  }

  openSearchOverlay() {
    document.querySelector('[data-search-overlay]').open = true;
    document.querySelector('[data-search-title]').focus();
  }
}

//PreviewService class handles the creation and manipulation of preview elements.
class PreviewService {
  constructor(books, authors) {
    this.books = books;
    this.authors = authors;
  }

  createPreviewElement({ author, id, image, title }) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);
    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${this.authors[author]}</div>
        </div>
    `;
    return element;
  }

  populatePreviewItems(startIndex, endIndex, books) {
    const fragment = document.createDocumentFragment();
    for (const book of books.slice(startIndex, endIndex)) {
      const element = this.createPreviewElement(book);
      fragment.appendChild(element);
    }
    return fragment;
  }  

  appendPreviewItems(fragment) {
    document.querySelector('[data-list-items]').appendChild(fragment);
  }

  clearPreviewItems() {
    document.querySelector('[data-list-items]').innerHTML = '';
  }

  setListItemsClick(callback) {
    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
      const target = event.target.closest('.preview');
      if (target) {
        const bookId = target.dataset.preview;
        const active = this.books.find((book) => book.id === bookId);
        if (active) {
          callback(active);
        }
      }
    })
  }

  updateListButtonRemaining(page, matchesLength) {
    const remaining = Math.max(matchesLength - (page * BOOKS_PER_PAGE), 0);
    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `;
  }

  setListItemsClick(callback) {
    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
      const pathArray = Array.from(event.path || event.composedPath());
      let active = null;
      for (const node of pathArray) {
        if (active) break;
        if (node?.dataset?.preview) {
          let result = null;
          for (const singleBook of this.books) {
            if (result) break;
            if (singleBook.id === node?.dataset?.preview) result = singleBook;
          }
          active = result;
        }
      }
      callback(active);
    });
  }

  getActiveBook(node) {
    let active = null;
    for (const book of this.books) {
      if (book.id === node?.dataset?.preview) {
        active = book;
        break;
      }
    }
    return active;
  }

  openPreview(book) {
    const listActive = document.querySelector('[data-list-active]');
    const listBlur = document.querySelector('[data-list-blur]');
    const listImage = document.querySelector('[data-list-image]');
    const listTitle = document.querySelector('[data-list-title]');
    const listSubtitle = document.querySelector('[data-list-subtitle]');
    const listDescription = document.querySelector('[data-list-description]');
    const closeButton = document.querySelector('[data-list-close]');

    listActive.open = true;
    listBlur.src = book.image;
    listImage.src = book.image;
    listTitle.innerText = book.title;
    listSubtitle.innerText = `${this.authors[book.author]} (${new Date(book.published).getFullYear()})`;
    listDescription.innerText = book.description;

    closeButton.addEventListener('click', () => {
      listActive.open = false;
    })
  }
}

//SettingsService class handles theme-related functionality.
class SettingsService {
  constructor() {}

  setTheme(theme) {
    const isDarkMode = theme === 'night';
    document.querySelector('[data-settings-theme]').value = theme;
    document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');
  }

  setSettingsCancelButton(callback) {
    document.querySelector('[data-settings-cancel]').addEventListener('click', callback);
  }

  setSettingsButton(callback) {
    document.querySelector('[data-header-settings]').addEventListener('click', callback);
  }

  setSettingsForm(callback) {
    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
      callback({ theme });
    });
  }

  closeSettingsOverlay() {
    document.querySelector('[data-settings-overlay]').open = false;
  }

  openSettingsOverlay() {
    document.querySelector('[data-settings-overlay]').open = true;
  }
}

// Usage
const bookService = new BookService(books);
const searchService = new SearchService(books, authors, genres);
const previewService = new PreviewService(books, authors);
const settingsService = new SettingsService();

const app = new BookApp(bookService, searchService, previewService, settingsService);
app.initializeApp();
