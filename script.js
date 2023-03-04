const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const prevoisSearchResults = document.querySelector('#prevoius-search-results');


const saveSearchResult = (result) => {
  localStorage.setItem('searchQuery', JSON.stringify(result));
}

const deleteSearchHistory = () => {
  localStorage.removeItem("searchQuery")
}

const searchInLocalStorage = (keyword) => {
  try {
    const storedQuery = localStorage.getItem('searchQuery');
    const previoiusSearchResults = JSON.parse(storedQuery)
    return previoiusSearchResults.filter(item => item?.volumeInfo?.title.toLowerCase().includes(keyword.toLowerCase()))
  } catch (err) {
    console.log(err)
    return [];
  }

}

const showResult = (books, ishowingLocal = false) => {
  books.forEach(book => {
    const title = book.volumeInfo.title;
    const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
    const description = book?.volumeInfo?.description || 'No description available.';
    const thumbnail = book?.volumeInfo?.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196.png?text=No+Cover+Available';
    const previewLink = book.volumeInfo.previewLink;
    const bookItem = `
          <div class="book">
            <img src="${thumbnail}" alt="${title} book cover">
            <h2>${title}</h2>
            <p>By: ${author}</p>
            <p class="desc">${description}</p>
            <a href="${previewLink}" target="_blank">Preview</a>
          </div>
        `;
    ishowingLocal ? prevoisSearchResults.insertAdjacentHTML('beforeend', bookItem) :
      searchResults.insertAdjacentHTML('beforeend', bookItem);
  });
}


searchForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  searchResults.innerHTML = '';

  const query = searchInput.value;
  if (query.trim() === '') {
    alert('Please enter a search query');
    return;
  }
  // Here we are searching for keyword in the database using API.
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const books = data.items;
      saveSearchResult(books)
      showResult(books)
    })
    .catch(error => {
      console.error(error);
      alert('An error occurred while fetching data from the Google Books API.');
      return;
    });

})

const getSearchResultsFromLocal = () => {
  const storedQuery = localStorage.getItem('searchQuery');
  return JSON.parse(storedQuery)
}


const previouslySerachedItems = getSearchResultsFromLocal()

showResult(previouslySerachedItems, true)



