import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
// import {populateGenres, populateAuthors} from "./search"
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
 * Creates a preview element for a book.
 * @param {Object} book - The book object containing author, id, image, and title.
 * @returns {HTMLElement} The preview element.
 */
function createPreviewElement({ author, id, image, title }) {
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
            <div class="preview__author">${authors[author]}</div>
        </div>
    `;
    return element;
}
/**
 * Populates the preview items on the page.
 * @param {number} startIndex - The start index of the items to populate.
 * @param {number} endIndex - The end index of the items to populate.
 * @returns {DocumentFragment} The document fragment containing the preview items.
 */
function populatePreviewItems(startIndex, endIndex) {
    const fragment = document.createDocumentFragment();
    for (const book of matches.slice(startIndex, endIndex)) {
        const element = createPreviewElement(book);
        fragment.appendChild(element);
    }
    return fragment;
}


/**
 * Closes the preview
 */
function closePreview(){
    document.querySelector('[data-list-close]').addEventListener('click', () => {
        document.querySelector('[data-list-active]').open = false
    })
}
closePreview()


// /**
//  * Creates option elements for a dropdown menu.
//  * @param {string} container - The dropdown container.
//  * @param {string} defaultValue - The default value of the dropdown.
//  * @param {Object} options - The options for the dropdown.
//  */
// function generateOptions(data, defaultOptionText) {
//     const fragment = document.createDocumentFragment();
//     const defaultOption = document.createElement('option');
//     defaultOption.value = 'any';
//     defaultOption.innerText = defaultOptionText;
//     fragment.appendChild(defaultOption);
 
//     for (const [id, name] of Object.entries(data)) {
//       const option = document.createElement('option');
//       option.value = id;
//       option.innerText = name;
//       fragment.appendChild(option);
//     }
 
//     return fragment;
//   }




// // Generates genre and author options by using the generateOptions
//   const genreHtml = generateOptions(genres, 'All Genres');
//   const authorHtml = generateOptions(authors, 'All Authors');
 
//   document.querySelector('[data-search-genres]').appendChild(genreHtml);
//   document.querySelector('[data-search-authors]').appendChild(authorHtml);
 


// /**
//  * Populates the genres select element.
//  * @returns {DocumentFragment} The document fragment containing the genre options.
//  */
// function populateGenres() {
//     const genreHtml = document.createDocumentFragment();
//     const firstGenreElement = document.createElement('option');
//     firstGenreElement.value = 'any';
//     firstGenreElement.innerText = 'All Genres';
//     genreHtml.appendChild(firstGenreElement);
//     for (const [id, name] of Object.entries(genres)) {
//         const element = document.createElement('option');
//         element.value = id;
//         element.innerText = name;
//         genreHtml.appendChild(element);
//     }
//     return genreHtml;
// }
// /**
//  * Populates the authors select element.
//  * @returns {DocumentFragment} The document fragment containing the author options.
//  */
// function populateAuthors() {
//     const authorsHtml = document.createDocumentFragment();
//     const firstAuthorElement = document.createElement('option');
//     firstAuthorElement.value = 'any';
//     firstAuthorElement.innerText = 'All Authors';
//     authorsHtml.appendChild(firstAuthorElement);
//     for (const [id, name] of Object.entries(authors)) {
//         const element = document.createElement('option');
//         element.value = id;
//         element.innerText = name;
//         authorsHtml.appendChild(element);
//     }
//     return authorsHtml;
// }
/**
 * Sets the theme of the application.
 * @param {string} theme - The theme to set ('day' or 'night').
 */
function setTheme(theme) {
    const isDarkMode = theme === 'night';
    document.querySelector('[data-settings-theme]').value = theme;
    document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');
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
 * Sets the settings cancel button event listener.
 */
function setSettingsCancelButton() {
    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false;
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
/**
 * Sets the settings button event listener.
 */
function setSettingsButton() {
    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = true;
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













