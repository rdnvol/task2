import debounce from 'debounce';

export function predictiveSearch() {
  const input = document.querySelector('input[type="search"]');
  const searchBlock = document.querySelector('#predictive-search');
  const searchOpenButton = document.querySelector('.predictive-search__opener');
  const resetButton = document.querySelector('[data-btn-reset]');
  const predictiveSearchResults = document.querySelector('#predictive-search-container');
  const viewportMeta = document.querySelector('head > meta[name="viewport"]');
  let searchQuery = '';

  function open() {
    predictiveSearchResults.style.display = 'block';
  }

  function close() {
    predictiveSearchResults.style.display = 'none';
  }

  function getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${searchTerm}&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);

          close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser()
          .parseFromString(text, 'text/html')
          .querySelector('#shopify-section-predictive-search').innerHTML;

        predictiveSearchResults.innerHTML = resultsMarkup;
        open();
      })
      .catch((error) => {
        close();
        throw error;
      });
  }

  function displaySearchQuery(oldValueQuery, newValueQuery) {
    const searchQueryContainer = document.querySelector('[data-predictive-search-search-for-text]');
    const currentQueryText = searchQueryContainer?.innerText;

    if (currentQueryText) {
      const newButtonText = currentQueryText.replace(oldValueQuery, newValueQuery);

      searchQueryContainer.textContent = newButtonText;
    }
  }

  function onChange() {
    const newSearchQuery = input.value.trim();

    displaySearchQuery(searchQuery, newSearchQuery);
    searchQuery = newSearchQuery;

    if (!searchQuery.length) {
      close();

      return;
    }

    resetButton.addEventListener('click', close);
    getSearchResults(searchQuery);
  }

  searchBlock.addEventListener('toggle', () => {
    if (searchBlock.open) {
      onChange();
      input.focus();
    }
  });

  searchOpenButton.onclick = () => {
    viewportMeta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, user-scalable=0'
    );
    input.focus();
    setTimeout(() => {
      viewportMeta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, user-scalable=1'
      );
    }, 0);
  };

  input.addEventListener(
    'input',
    debounce(() => {
      onChange();
    }, 300)
  );
}
