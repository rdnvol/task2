class FacetMoreLess extends HTMLElement {
  constructor() {
    super();

    this.clickCount = 0;
    this.style.cursor = 'pointer';
    this.filterItems = JSON.parse(
      this.querySelector('script#filter-items').innerHTML
    );
    this.itemsToFilter = null;

    if (
      !Object.values(this.filterItems)?.length === 0 ||
      this.filterItems?.filter_values?.length <= 5
    ) {
      this.querySelector('#more').style.display = 'none';
      return;
    }
    this.addEventListener('click', function (e) {
      if (e.target.id === 'more') {
        this.clickCount += 1;
      } else {
        this.clickCount -= 1;
      }

      if (this.filterItems?.filter_label === 'Color') {
        this.itemsToFilter = this.filterItems.filter_values.map(
          (item, index) => `
         <div class="py-3 custom-input custom-input--colors-with-text">
           <input id="Filter-${item.param_name}--${index + 1}"
                  type="checkbox"
                  name="${item.param_name}"
                  value="${item.value}"
                  ${item.active && 'checked'}
                  ${item.count === 0 && item.active === false && 'disabled'}
                  >
           <label for="Filter-${item.param_name}--${
            index + 1
          }" class="custom-label flex items-center">
               <span class="custom-label__img-holder">
                 <div style="background-color: ${
                   item.value
                 }; width: 100%; height: 100%; border-radius: 50%;" >
                 </div>
               </span>
               ${item.label} (${item.count})
           </label>
         </div>
       `
        );
      } else {
        this.itemsToFilter = this.filterItems.filter_values.map(
          (item, index) =>
            `
          <div class="py-3 custom-input custom-input--square-with-text">
            <input
              id="Filter-${item.param_name}-${index + 1}"
              type="checkbox"
              value="${item.value}"
              name="${item.param_name}"
              ${item.active && 'checked'}
              ${item.count === 0 && item.active === false && 'disabled'}
            >
            <label for="Filter-${item.param_name}-${
              index + 1
            }" class="custom-label flex items-center">
              <span class="custom-label__check"></span>
              ${item.label} (${item.count})
            </label>
          </div>
          `
        );
      }

      this.queryVar =
        this.filterItems?.filter_label === 'Color' ? 'colors' : 'square';
      this.insertAfterEl = this.parentElement.querySelector(
        `.py-3.custom-input.custom-input--${this.queryVar}-with-text:last-of-type`
      );
      if (this.clickCount >= 1) {
        this.querySelector('#less').style.display = 'inline';
      }

      if (e.target.id === 'less') {
        if (this.clickCount * 5 + 5 < this.itemsToFilter.length) {
          this.querySelector('#more').style.display = 'inline';
        }
        this.items = this.parentElement.querySelectorAll(
          `.py-3.custom-input.custom-input--${this.queryVar}-with-text`
        );

        this.items.forEach((el, index) => {
          if (index + 1 > this.clickCount * 5 + 5) {
            el.remove();
          }
        });
        if (this.clickCount === 0) {
          this.querySelector('#less').style.display = 'none';
          return;
        }
        return;
      } else {
        if (this.clickCount * 5 + 5 >= this.itemsToFilter.length) {
          this.querySelector('#more').style.display = 'none';
        }

        this.insertAfterEl.insertAdjacentHTML(
          'afterend',
          this.itemsToFilter
            .slice(this.clickCount * 5, this.clickCount * 5 + 5)
            .join('')
        );
      }
    });
  }

  insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
}

customElements.define('more-less', FacetMoreLess);

class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.querySelector('form').addEventListener(
      'input',
      this.debouncedOnSubmit.bind(this)
    );

    const filterSelectors = document.querySelectorAll(
      '#filter-sortby, #filter-sortby-2'
    );

    const self = this;
    filterSelectors.forEach(
      (filterSelector) =>
        filterSelector.addEventListener('change', function (e) {
          const id = this.getAttribute('id');
          let surplusFilter;
          if (id === 'filter-sortby') {
            surplusFilter = document.getElementById('filter-sortby-2');
          } else {
            surplusFilter = document.getElementById('filter-sortby');
          }
          const tempValue = surplusFilter.value;
          if (surplusFilter) surplusFilter.value = '';

          const dbSubmit = self.debouncedOnSubmit.bind(self, e);
          dbSubmit().then(() => (surplusFilter.value = tempValue));
        }),
      self
    );

    const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
    if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
    FacetFiltersForm.checkActiveFilters();
  }

  static setListeners() {
    const onHistoryChange = (event) => {
      const searchParams = event.state
        ? event.state.searchParams
        : FacetFiltersForm.searchParamsInitial;
      if (searchParams === FacetFiltersForm.searchParamsPrev) return;
      FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener('popstate', onHistoryChange);
  }

  static toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  static renderPage(searchParams, event, updateURLHash = true) {
    FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = FacetFiltersForm.getSections();

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;

      FacetFiltersForm.filterData.some(filterDataUrl)
        ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
        : FacetFiltersForm.renderSectionFromFetch(url, event);
    });

    if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
  }

  static renderSectionFromFetch(url, event) {
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        const html = responseText;
        FacetFiltersForm.filterData = [
          ...FacetFiltersForm.filterData,
          { html, url },
        ];
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderPagination(html);
        FacetFiltersForm.renderProductCount(html);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;

    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderPagination(html);
    FacetFiltersForm.renderProductCount(html);
  }

  static renderProductGridContainer(html) {
    document.getElementById('product-grid').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('product-grid').innerHTML;
  }

  static renderPagination(html) {
    document.getElementById('pagination-container').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('pagination-container').innerHTML;
  }

  static renderProductCount(html) {
    const count = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductCount').innerHTML;
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .js-filter',
      '#FacetFiltersMobile .js-filter'
    );

    const matchesIndex = (element) => {
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter
        ? element.dataset.index === jsFilter.dataset.index
        : false;
    };
    const facetsToRender = Array.from(facetDetailsElements).filter(
      (element) => !matchesIndex(element)
    );

    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(
        `.js-filter[data-index="${element.dataset.index}"]`
      ).innerHTML = element.innerHTML;
    });

    FacetFiltersForm.renderActiveFacets(parsedHTML);
    FacetFiltersForm.renderAdditionalElements(parsedHTML);

    if (countsToRender)
      FacetFiltersForm.renderCounts(
        countsToRender,
        event.target.closest('.js-filter')
      );
  }

  static renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.filter-selected-element-list'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML =
        activeFacetsElement.innerHTML;
    });

    FacetFiltersForm.toggleActiveFacets(false);
    FacetFiltersForm.checkActiveFilters();
  }

  static renderAdditionalElements(html) {
    const mobileElementSelectors = [
      '.mobile-facets__open',
      '.mobile-facets__count',
      '.sorting',
    ];

    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector)) return;
      document.querySelector(selector).innerHTML =
        html.querySelector(selector).innerHTML;
    });
  }

  static renderCounts(source, target) {
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    if (sourceElement && targetElement) {
      target.querySelector('.facets__selected').outerHTML =
        source.querySelector('.facets__selected').outerHTML;
    }
  }

  static updateURLHash(searchParams) {
    history.pushState(
      { searchParams },
      '',
      `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`
    );
  }

  static getSections() {
    return [
      {
        section: document.getElementById('product-grid').dataset.id,
      },
    ];
  }

  static checkActiveFilters() {
    const clearAllBtn = document.querySelector('facet-remove[data-facet-clear-all]');
    const activeFilter = Array.from(document.querySelectorAll('#FacetsWrapperDesktop input')).find((input) => {
      if (input.type === 'number') {
        return input.value.trim().length;
      } else {
        return input.checked;
      }
    });

    activeFilter ? FacetFiltersForm.renderClearAll(clearAllBtn) : FacetFiltersForm.hideClearAll(clearAllBtn);
  }

  static renderClearAll(clearAll) {
    clearAll.removeAttribute('hidden');
  }

  static hideClearAll(clearAll) {
    clearAll.setAttribute('hidden', true);
  }

  onSubmitHandler(event) {
    event.preventDefault();

    let formData;
    let searchParams;
    if (event?.target?.closest('form')) {
      formData = new FormData(event.target.closest('form'));
      searchParams = new URLSearchParams(formData).toString();
    } else {
      const form = document.getElementById('FacetFiltersForm');
      formData = new FormData(form);
      searchParams = new URLSearchParams(formData).toString();
    }

    FacetFiltersForm.renderPage(searchParams, event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    FacetFiltersForm.toggleActiveFacets();
    const url =
      event.currentTarget.href.indexOf('?') == -1
        ? ''
        : event.currentTarget.href.slice(
            event.currentTarget.href.indexOf('?') + 1
          );
    FacetFiltersForm.renderPage(url);
  }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input').forEach((element) =>
      element.addEventListener('change', this.onRangeChange.bind(this))
    );

    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '')
      minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
  constructor() {
    super();
    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();
      const id = this.querySelector('a').getAttribute('id');
      if (id === 'price-range' || id === 'clear-all') {
        const priceRanges = document.querySelectorAll('.range-slider__input');

        priceRanges.forEach((rangeItem) => (rangeItem.value = ''));
      }
      const form =
        this.closest('facet-filters-form') ||
        document.querySelector('facet-filters-form');
      form.onActiveFilterClick(event);
    });
  }
}

customElements.define('facet-remove', FacetRemove);

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return;

  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', false);
  summaryElement.focus();
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    return new Promise((resolve) => {
      t = setTimeout(() => resolve(fn(...args)), wait);
    });
  };
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute('role', 'button');
  summary.setAttribute('aria-expanded', 'false');

  if (summary.nextElementSibling.getAttribute('id')) {
    summary.setAttribute('aria-controls', summary.nextElementSibling.id);
  }

  summary.addEventListener('click', (event) => {
    event.currentTarget.setAttribute(
      'aria-expanded',
      !event.currentTarget.closest('details').hasAttribute('open')
    );
  });

  if (summary.closest('header-drawer')) return;
  summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});
