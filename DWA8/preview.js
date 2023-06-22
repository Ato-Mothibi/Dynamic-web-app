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

// // Interfaces
// class ElementCreator {
//   createPreviewElement(book) {}
// }
// class PreviewDataProvider {
//     getMatches(startIndex, endIndex, filters) {}
//   }
  
// class PreviewRenderer {
//    renderPreviewItems(matches) {}
//  }

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

// export {DOMElementCreator, ElementCreator, PreviewDataProvider, PreviewRenderer}