import { books, authors, genres } from './data.js';

/**
 * Current page number.
 * @type {number}
 */
let page = 1;
/**
 * Array of book matches based on search filters.
 * @type {Array}
 */
let matches = books;

/**
 * Populates the genres select element.
 * @returns {DocumentFragment} The document fragment containing the genre options.
 */
function populateGenres() {
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
/**
 * Populates the authors select element.
 * @returns {DocumentFragment} The document fragment containing the author options.
 */
function populateAuthors() {
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

/**
 * Sets the search cancel button event listener.
 */
function setSearchCancelButton() {
    document.querySelector('[data-search-cancel]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = false;
    });
}

/**
 * Sets the search button event listener.
 */
function setSearchButton() {
    document.querySelector('[data-header-search]').addEventListener('click', () => {
        document.querySelector('[data-search-overlay]').open = true;
        document.querySelector('[data-search-title]').focus();
    });
}


// /**
//  * Sets the search form event listener.
//  */
// function setSearchForm() {
//     document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
//         event.preventDefault();
//         const formData = new FormData(event.target);
//         const filters = Object.fromEntries(formData);
//         const result = [];
//         for (const book of books) {
//             let genreMatch = filters.genre === 'any';
//             for (const singleGenre of book.genres) {
//                 if (genreMatch) break;
//                 if (singleGenre === filters.genre) {
//                     genreMatch = true;
//                 }
//             }
//             if (
//                 (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
//                 (filters.author === 'any' || book.author === filters.author) &&
//                 genreMatch
//             ) {
//                 result.push(book);
//             }
//         }
//         page = 1;
//         matches = result;
//         if (result.length < 1) {
//             document.querySelector('[data-list-message]').classList.add('list__message_show');
//         } else {
//             document.querySelector('[data-list-message]').classList.remove('list__message_show');
//         }
//         document.querySelector('[data-list-items]').innerHTML = '';
//         const newItems = populatePreviewItems(0, BOOKS_PER_PAGE);
//         document.querySelector('[data-list-items]').appendChild(newItems);
//         document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;
//         updateListButtonRemaining();
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//         document.querySelector('[data-search-overlay]').open = false;
//     });
// }

export { setSearchButton, setSearchCancelButton, populateGenres, populateAuthors}