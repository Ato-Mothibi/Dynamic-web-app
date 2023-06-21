// BookApp.js
class BookApp {
    constructor(bookService, searchService, previewService, settingsService) {
      this.page = 1;
      this.matches = [];
      this.bookService = bookService;
      this.searchService = searchService;
      this.previewService = previewService;
      this.settingsService = settingsService;
    }
  
    initializeApp() {
        const startingItems = this.previewService.populatePreviewItems(0, BOOKS_PER_PAGE);
        const genreHtml = this.searchService.populateGenres();
        const authorsHtml = this.searchService.populateAuthors();
        this.previewService.appendPreviewItems(startingItems);
        this.searchService.appendGenres(genreHtml);
        this.searchService.appendAuthors(authorsHtml);
        this.settingsService.setTheme();
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
          const newItems = this.previewService.populatePreviewItems(0, BOOKS_PER_PAGE);
          this.previewService.appendPreviewItems(newItems);
          this.previewService.updateListButtonRemaining(this.page, this.matches.length);
          this.searchService.closeSearchOverlay();
        });
    
        this.previewService.setListButton(() => {
          const startIndex = this.page * BOOKS_PER_PAGE;
          const endIndex = (this.page + 1) * BOOKS_PER_PAGE;
          const fragment = this.previewService.populatePreviewItems(startIndex, endIndex);
          this.previewService.appendPreviewItems(fragment);
          this.page += 1;
          this.previewService.updateListButtonRemaining(this.page, this.matches.length);
        });
    
        this.previewService.setListItemsClick((node) => {
          const active = this.previewService.getActiveBook(node);
          if (active) {
            this.previewService.openPreview(active);
          }
        });
    
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
  
  export default BookApp;
  