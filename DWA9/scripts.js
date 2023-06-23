// Import necessary data and classes
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Define the BookPreviewComponent class
class BookPreviewComponent extends HTMLElement {
  constructor() {
    super();

    // Initialize properties
    this.page = 1;
    this.matches = books;

    // Create the shadow DOM
    this.attachShadow({ mode: 'open' });

    // Bind event listeners
    this.handleListButtonClick = this.handleListButtonClick.bind(this);
    this.handleSearchCancelButtonClick = this.handleSearchCancelButtonClick.bind(this);
    this.handleSettingsCancelButtonClick = this.handleSettingsCancelButtonClick.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
    this.handleSettingsButtonClick = this.handleSettingsButtonClick.bind(this);
    this.handleSettingsFormSubmit = this.handleSettingsFormSubmit.bind(this);
    this.handleSearchFormSubmit = this.handleSearchFormSubmit.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  connectedCallback() {
    // Render the component content
    this.render();

    // Set up event listeners
    this.setupEventListeners();

    // Initialize the app
    this.initializeApp();
  }

  render() {
    // Create the component's template
    this.shadowRoot.innerHTML = `
      <style>
        /* Add component styles here */
      </style>
      <div id="bookContainer">
        <!-- Add your existing HTML template here -->
      </div>
    `;
  }

  setupEventListeners() {
    // Get the necessary elements
    const listButton = this.shadowRoot.querySelector('[data-list-button]');
    const searchCancelButton = this.shadowRoot.querySelector('[data-search-cancel]');
    const settingsCancelButton = this.shadowRoot.querySelector('[data-settings-cancel]');
    const searchButton = this.shadowRoot.querySelector('[data-header-search]');
    const settingsButton = this.shadowRoot.querySelector('[data-header-settings]');
    const settingsForm = this.shadowRoot.querySelector('[data-settings-form]');
    const searchForm = this.shadowRoot.querySelector('[data-search-form]');
    const listItems = this.shadowRoot.querySelector('[data-list-items]');

    // Add event listeners
    listButton.addEventListener('click', this.handleListButtonClick);
    searchCancelButton.addEventListener('click', this.handleSearchCancelButtonClick);
    settingsCancelButton.addEventListener('click', this.handleSettingsCancelButtonClick);
    searchButton.addEventListener('click', this.handleSearchButtonClick);
    settingsButton.addEventListener('click', this.handleSettingsButtonClick);
    settingsForm.addEventListener('submit', this.handleSettingsFormSubmit);
    searchForm.addEventListener('submit', this.handleSearchFormSubmit);
    listItems.addEventListener('click', this.handleListItemClick);
  }

  handleListButtonClick() {
    const startIndex = this.page * BOOKS_PER_PAGE;
    const endIndex = (this.page + 1) * BOOKS_PER_PAGE;
    const fragment = this.populatePreviewItems(startIndex, endIndex);
    this.page += 1;
    this.updateListButtonRemaining();
    this.shadowRoot.querySelector('[data-list-items]').appendChild(fragment);
  }

  handleSearchCancelButtonClick() {
    this.shadowRoot.querySelector('[data-search-overlay]').open = false;
  }

  handleSettingsCancelButtonClick() {
    this.shadowRoot.querySelector('[data-settings-overlay]').open = false;
  }

  handleSearchButtonClick() {
    this.shadowRoot.querySelector('[data-search-overlay]').open = true;
    this.shadowRoot.querySelector('[data-search-title]').focus();
  }

  handleSettingsButtonClick() {
    this.shadowRoot.querySelector('[data-settings-overlay]').open = true;
  }

  handleSettingsFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    this.setTheme(theme);
    this.shadowRoot.querySelector('[data-settings-overlay]').open = false;
  }

  handleSearchFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { searchTitle } = Object.fromEntries(formData);
    this.searchBooks(searchTitle);
    this.shadowRoot.querySelector('[data-search-overlay]').open = false;
  }

  handleListItemClick(event) {
    const bookId = event.target.closest('[data-list-item]').dataset.bookId;
    const book = this.matches.find((b) => b.id === bookId);
    if (book) {
      // Perform the desired action on the selected book
      console.log('Selected book:', book);
    }
  }

  initializeApp() {
    this.updateListButtonRemaining();
    this.renderPreviewItems();
  }

  updateListButtonRemaining() {
    const startIndex = this.page * BOOKS_PER_PAGE;
    const remainingBooks = this.matches.slice(startIndex);
    const remainingCount = Math.min(BOOKS_PER_PAGE, remainingBooks.length);
    this.shadowRoot.querySelector('[data-list-button]').textContent = `Load ${remainingCount} more`;
  }

  renderPreviewItems() {
    const endIndex = Math.min(BOOKS_PER_PAGE, this.matches.length);
    const fragment = this.populatePreviewItems(0, endIndex);
    this.shadowRoot.querySelector('[data-list-items]').appendChild(fragment);
  }

  populatePreviewItems(startIndex, endIndex) {
    const fragment = document.createDocumentFragment();
    const items = this.matches.slice(startIndex, endIndex);
    items.forEach((book) => {
      const listItem = document.createElement('div');
      listItem.dataset.listItem = '';
      listItem.dataset.bookId = book.id;
      listItem.textContent = book.title;
      fragment.appendChild(listItem);
    });
    return fragment;
  }

  searchBooks(title) {
    const searchTitle = title.trim().toLowerCase();
    this.page = 1;
    this.matches = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
    this.clearPreviewItems();
    this.updateListButtonRemaining();
    this.renderPreviewItems();
  }

  setTheme(theme) {
    // Set the theme based on the selected value
    console.log('Selected theme:', theme);
  }

  clearPreviewItems() {
    const listItems = this.shadowRoot.querySelector('[data-list-items]');
    while (listItems.firstChild) {
      listItems.firstChild.remove();
    }
  }
}

// Define the custom element
customElements.define('book-preview', BookPreviewComponent);
