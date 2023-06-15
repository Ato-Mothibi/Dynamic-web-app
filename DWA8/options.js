export {SelectElementPopulator}


const SelectElementPopulator = {
    populateGenres() {
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
    },
    populateAuthors() {
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
    },
  };