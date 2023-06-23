import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import { DOMElementCreator, PreviewDataProviderImpl, DOMPreviewRenderer} from './preview.js';
// import createBookApp from './preview'
// // Interfaces
// class ElementCreator {
//   createPreviewElement(book) {}
// }


// class PreviewDataProvider {
//   getMatches(startIndex, endIndex, filters) {}
// }


// class PreviewRenderer {
//   renderPreviewItems(matches) {}
// }


//Classes and it's methods
class BookApp {
  constructor(
    elementCreator,
    previewDataProvider,
    previewRenderer
  ) {
    this.page = 1;
    this.matches = books;
    this.elementCreator = elementCreator;
    this.previewDataProvider = previewDataProvider;
    this.previewRenderer = previewRenderer;
  }


  populatePreviewItems(startIndex, endIndex) {
    const fragment = document.createDocumentFragment();
    for (const book of this.matches.slice(startIndex, endIndex)) {
      const element = this.elementCreator.createPreviewElement(book);
      fragment.appendChild(element);
    }
    return fragment;
  }


  closePreview() {
    document.querySelector('[data-list-close]').addEventListener('click', (event) => {
      document.querySelector('[data-list-active]').open = false;
    });
  }


  populateGenres() {
    const genreHtml = document.createDocumentFragment();
    const firstGenreElement = document.createElement('option');
    firstGenreElement.value = 'any';
    firstGenreElement.innerText = 'All Genres';
    genreHtml.appendChild(firstGenreElement);
    for (const [id, name] of Object.entries(genres)) {
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
    for (const [id, name] of Object.entries(authors)) {
      const element = document.createElement('option');
      element.value = id;
      element.innerText = name;
      authorsHtml.appendChild(element);
    }
    return authorsHtml;
  }


  setSearchCancelButton() {
    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
      document.querySelector('[data-search-overlay]').open = false;
    });
  }


  setSearchButton() {
    document.querySelector('[data-header-search]').addEventListener('click', () => {
      document.querySelector('[data-search-overlay]').open = true;
      document.querySelector('[data-search-title]').focus();
    });
  }


  setSearchForm() {
    document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const filters = Object.fromEntries(formData);
      const result = [];
      for (const book of books) {
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
      this.page = 1;
      this.matches = result;
      if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show');
      } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show');
      }
      document.querySelector('[data-list-items]').innerHTML = '';
      const newItems = this.populatePreviewItems(0, BOOKS_PER_PAGE);
      document.querySelector('[data-list-items]').appendChild(newItems);
      document.querySelector('[data-list-button]').disabled = (this.matches.length - (this.page * BOOKS_PER_PAGE)) < 1;
      this.updateListButtonRemaining();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('[data-search-overlay]').open = false;
    });
  }


  setTheme(theme) {
    const isDarkMode = theme === 'night';
    document.querySelector('[data-settings-theme]').value = theme;
    document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');
  }


  setSettingsCancelButton() {
    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
      document.querySelector('[data-settings-overlay]').open = false;
    });
  }


  setSettingsButton() {
    document.querySelector('[data-header-settings]').addEventListener('click', () => {
      document.querySelector('[data-settings-overlay]').open = true;
    });
  }


  setSettingsForm() {
    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);
      this.setTheme(theme);
      document.querySelector('[data-settings-overlay]').open = false;
    });
  }


  setListButton() {
    document.querySelector('[data-list-button]').addEventListener('click', () => {
      const startIndex = this.page * BOOKS_PER_PAGE;
      const endIndex = (this.page + 1) * BOOKS_PER_PAGE;
      const fragment = this.populatePreviewItems(startIndex, endIndex);
      document.querySelector('[data-list-items]').appendChild(fragment);
      this.page += 1;
      this.updateListButtonRemaining();
    });
    this.updateListButtonRemaining();
  }


  updateListButtonRemaining() {
    const remaining = Math.max(this.matches.length - (this.page * BOOKS_PER_PAGE), 0);
    const listButton = document.querySelector('[data-list-button]');
    listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `;
    listButton.disabled = remaining === 0;
  }


  setListItemsClick() {
    document.querySelector('[data-list-items]').addEventListener('click', (event) => {
      const pathArray = Array.from(event.path || event.composedPath());
      let active = null;
      for (const node of pathArray) {
        if (active) break;
        if (node?.dataset?.preview) {
          let result = null;
          for (const singleBook of books) {
            if (result) break;
            if (singleBook.id === node?.dataset?.preview) result = singleBook;
          }
          active = result;
        }
      }
      if (active) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = active.image;
        document.querySelector('[data-list-image]').src = active.image;
        document.querySelector('[data-list-title]').innerText = active.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = active.description;
      }
    });
  }


  initializeApp() {
    const startingItems = this.populatePreviewItems(0, BOOKS_PER_PAGE);
    const genreHtml = this.populateGenres();
    const authorsHtml = this.populateAuthors();
    document.querySelector('[data-list-items]').appendChild(startingItems);
    document.querySelector('[data-search-genres]').appendChild(genreHtml);
    document.querySelector('[data-search-authors]').appendChild(authorsHtml);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.setTheme('night');
    } else {
      this.setTheme('day');
    }
    this.setListButton();
    this.setSearchCancelButton();
    this.setSettingsCancelButton();
    this.setSearchButton();
    this.setSettingsButton();
    this.setSettingsForm();
    this.setSearchForm();
    this.setListItemsClick();
    this.closePreview();
  }
}


// // DOM-related classes implementing interfaces
// class DOMElementCreator extends ElementCreator {
//   createPreviewElement(book) {
//     const element = document.createElement('button');
//     element.classList = 'preview';
//     element.setAttribute('data-preview', book.id);
//     element.innerHTML = `
//         <img
//             class="preview__image"
//             src="${book.image}"
//         />
//         <div class="preview__info">
//             <h3 class="preview__title">${book.title}</h3>
//             <div class="preview__author">${authors[book.author]}</div>
//         </div>
//     `;
//     return element;
//   }
// }


class PreviewDataFilter {
  static filterMatches(books, filters) {
    const { genre, author } = filters;
    let filteredBooks = books;


    if (genre !== 'any') {
      filteredBooks = filteredBooks.filter((book) => book.genre === genre);
    }


    if (author !== 'any') {
      filteredBooks = filteredBooks.filter((book) => book.author === author);
    }


    return filteredBooks;
  }
}


// class PreviewDataProviderImpl extends PreviewDataProvider {
//   getMatches(startIndex, endIndex, filters) {
//     const filteredMatches = PreviewDataFilter.filterMatches(books, filters);
//     const matches = filteredMatches.slice(startIndex, endIndex);
//     return matches;
//   }
// }


// class DOMPreviewRenderer extends PreviewRenderer {
//   constructor(elementCreator) {
//     super();
//     this.elementCreator = elementCreator;
//   }


//   renderPreviewItems(matches) {
//     const fragment = document.createDocumentFragment();
//     for (const book of matches) {
//       const element = this.elementCreator.createPreviewElement(book);
//       fragment.appendChild(element);
//     }
//     document.querySelector('[data-list-items]').innerHTML = '';
//     document.querySelector('[data-list-items]').appendChild(fragment);
//   }
// }


// const bookApp = createBookApp();
// // Access the instances from the factory
// const elementCreator = bookApp.elementCreator;
// const previewDataProvider = bookApp.previewDataProvider;
// const previewRenderer = bookApp.previewRenderer;


// Usage of abstracted interfaces
const elementCreator = new DOMElementCreator();
const previewDataProvider = new PreviewDataProviderImpl();
const previewRenderer = new DOMPreviewRenderer(elementCreator);


const app = new BookApp(elementCreator, previewDataProvider, previewRenderer);
app.initializeApp();

