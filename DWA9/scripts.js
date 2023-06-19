import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import { createPreviewElement, populatePreviewItems } from './preview.js';
import { setSearchButton, setSearchCancelButton, populateGenres, populateAuthors } from './search.js';
import { setTheme, setSettingsButton, setSettingsCancelButton } from './themeSettings.js';
export {updateListButtonRemaining}
// import {populateGenres, populateAuthors} from "./search"
// export {populateGenres, populateAuthors}
export {matches, page}
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
 * Sets the search form event listener.
 */
function setSearchForm() {
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
        page = 1;
        matches = result;
        if (result.length < 1) {
            document.querySelector('[data-list-message]').classList.add('list__message_show');
        } else {
            document.querySelector('[data-list-message]').classList.remove('list__message_show');
        }
        document.querySelector('[data-list-items]').innerHTML = '';
        const newItems = populatePreviewItems(0, BOOKS_PER_PAGE);
        document.querySelector('[data-list-items]').appendChild(newItems);
        document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;
        updateListButtonRemaining();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('[data-search-overlay]').open = false;
    });
}


/**
 * Sets the settings form event listener.
 */
function setSettingsForm() {
    document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);
        setTheme(theme);
        document.querySelector('[data-settings-overlay]').open = false;
    });
}


/**
 * Sets the list button event listener.
 */
function setListButton() {
    document.querySelector('[data-list-button]').addEventListener('click', () => {
        const startIndex = page * BOOKS_PER_PAGE;
        const endIndex = (page + 1) * BOOKS_PER_PAGE;
        const fragment = populatePreviewItems(startIndex, endIndex);
        document.querySelector('[data-list-items]').appendChild(fragment);
        page += 1;

        updateListButtonRemaining()
    });
}
/**
 * Updates the remaining count in the list button.
 */
function updateListButtonRemaining() {
    const remaining = Math.max(matches.length - (page * BOOKS_PER_PAGE), 0);
    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `;
}

/**
 * Sets the event listener for list item clicks.
 */
function setListItemsClick() {
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


/**
 * Initializes the application.
 */
function initializeApp() {
    const startingItems = populatePreviewItems(0, BOOKS_PER_PAGE);
    const genreHtml = populateGenres();
    const authorsHtml = populateAuthors();
    document.querySelector('[data-list-items]').appendChild(startingItems);
    document.querySelector('[data-search-genres]').appendChild(genreHtml);
    document.querySelector('[data-search-authors]').appendChild(authorsHtml);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('night');
    } else {
        setTheme('day');
    }
    setListButton();
    setSearchCancelButton();
    setSettingsCancelButton();
    setSearchButton();
    setSettingsButton();
    setSettingsForm();
    setSearchForm();
    setListItemsClick();
}
initializeApp();
