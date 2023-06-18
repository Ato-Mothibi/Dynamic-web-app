import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
export { createPreviewElement, populatePreviewItems }
import { matches } from './scripts';
// /**
//  * Current page number.
//  * @type {number}
//  */
// let page = 1;
// /**
//  * Array of book matches based on search filters.
//  * @type {Array}
//  */
// let matches = books;

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

// function closePreview(){
//     document.querySelector('[data-list-close]').addEventListener('click', () => {
//         document.querySelector('[data-list-active]').open = false
//     })
// }
// closePreview()