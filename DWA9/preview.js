export class ListItemsComponent extends HTMLElement {
  constructor() {
    super();
  }


  connectedCallback() {
    this.setListItemsClick();
  }


  setListItemsClick() {
    this.querySelector('[data-list-items]').addEventListener('click', (event) => {
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
        this.querySelector('[data-list-active]').open = true;
        this.querySelector('[data-list-blur]').src = active.image;
        this.querySelector('[data-list-image]').src = active.image;
        this.querySelector('[data-list-title]').innerText = active.title;
        this.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(
          active.published).getFullYear()})`;
        this.querySelector('[data-list-description]').innerText = active.description;
      }
    });
  }
}


customElements.define('list-items', ListItemsComponent);


