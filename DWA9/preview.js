class BookPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.page = 1;
    this.matches = [];
  }

  connectedCallback() {
    this.render();
    this.closePreview();
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

  populatePreviewItems(startIndex, endIndex) {
    const fragment = document.createDocumentFragment();
    for (const book of this.matches.slice(startIndex, endIndex)) {
      const element = this.createPreviewElement(book);
      fragment.appendChild(element);
    }
    return fragment;
  }

  closePreview() {
    this.shadowRoot
      .querySelector('[data-list-close]')
      .addEventListener('click', () => {
        this.shadowRoot.querySelector('[data-list-active]').open = false;
      });
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
          .preview {
            /* Add your button styles here */
          }

          .preview__image {
            /* Add your image styles here */
          }

          .preview__info {
            /* Add your info container styles here */
          }

          .preview__title {
            /* Add your title styles here */
          }

          .preview__author {
            /* Add your author styles here */
          }
        </style>
        <button class="preview" data-list-close>
          <img class="preview__image" src="">
          <div class="preview__info">
            <h3 class="preview__title"></h3>
            <div class="preview__author"></div>
          </div>
        </button>
    `;
    // Call your methods here to populate the template
  }
}

customElements.define('book-preview', BookPreview);
