import { authors } from './data.js';

// function createPreviewElement(book) {
//   const element = document.createElement('button');
//   element.classList = 'preview';
//   element.setAttribute('data-preview', book.id);
//   element.innerHTML = `
//     <img class="preview__image" src="${book.image}" />
//     <div class="preview__info">
//       <h3 class="preview__title">${book.title}</h3>
//       <div class="preview__author">${authors[book.author]}</div>
//     </div>
//   `;
//   return element;
// }
// createPreviewElement()

// export {createPreviewElemenent}



// Interfaces
class ElementCreator {
    createPreviewElement(book) {}
  }
  
  class PreviewDataProvider {
    getMatches(startIndex, endIndex, filters) {}
  }
  
  class PreviewRenderer {
    renderPreviewItems(matches) {}
  }
  
  // DOM-related classes implementing interfaces
  class DOMElementCreator extends ElementCreator {
    createPreviewElement(book) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', book.id);
      element.innerHTML = `
          <img
              class="preview__image"
              src="${book.image}"
          />
          <div class="preview__info">
              <h3 class="preview__title">${book.title}</h3>
              <div class="preview__author">${authors[book.author]}</div>
          </div>
      `;
      return element;
    }
  }
  
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
  
  class PreviewDataProviderImpl extends PreviewDataProvider {
    getMatches(startIndex, endIndex, filters) {
      const filteredMatches = PreviewDataFilter.filterMatches(books, filters);
      const matches = filteredMatches.slice(startIndex, endIndex);
      return matches;
    }
  }
  
  class DOMPreviewRenderer extends PreviewRenderer {
    constructor(elementCreator) {
      super();
      this.elementCreator = elementCreator;
    }
  
    renderPreviewItems(matches) {
      const fragment = document.createDocumentFragment();
      for (const book of matches) {
        const element = this.elementCreator.createPreviewElement(book);
        fragment.appendChild(element);
      }
      document.querySelector('[data-list-items]').innerHTML = '';
      document.querySelector('[data-list-items]').appendChild(fragment);
    }
  }  

//   function createBookApp() {
//     const elementCreator = new DOMElementCreator();
//     const previewDataProvider = new PreviewDataProviderImpl();
//     const previewRenderer = new DOMPreviewRenderer(elementCreator);
  
//     return {elementCreator, previewDataProvider, previewRenderer};
//   }

  export { DOMElementCreator, PreviewDataProviderImpl, DOMPreviewRenderer}