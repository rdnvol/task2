class FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    // this.sectionId = document
    //   .querySelector('[data-section-id]')
    //   .getAttribute('data-section-id');

    console.log('This section id is', this.sectionId);

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

    console.log('Filter selectors', filterSelectors);
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
        FacetFiltersForm.renderProductCount(html);
      });
  }

  static renderSectionFromCache(filterDataUrl, event) {
    console.log('Render section from cache has been called');
    const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
    console.log('html from cache', html);
    FacetFiltersForm.renderFilters(html, event);
    FacetFiltersForm.renderProductGridContainer(html);
    FacetFiltersForm.renderProductCount(html);
  }

  static renderProductGridContainer(html) {
    document.getElementById('product-grid').innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('product-grid').innerHTML;
    // document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
    //   .parseFromString(html, 'text/html')
    //   .getElementById('ProductGridContainer').innerHTML;
  }

  static renderProductCount(html) {
    console.log('Html from product count', html);
    const count = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('ProductCount').innerHTML;
    const container = document.getElementById('ProductCount');
    const containerDesktop = document.getElementById('ProductCountDesktop');
    container.innerHTML = count;
    // container.classList.remove('loading');
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      // containerDesktop.classList.remove('loading');
    }
  }

  static renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const sectionId = document
      .querySelector('[data-section-id]')
      .getAttribute('data-section-id');

    console.log('section Id from renderFilters', sectionId);

    const facetDetailsElements = parsedHTML.querySelectorAll(
      '#FacetFiltersForm .js-filter, .js-filter-mobile'
    );
    const matchesIndex = (element) => {
      console.log('element from matches index', element);
      const jsFilter = event ? event.target.closest('.js-filter') : undefined;
      return jsFilter
        ? element.dataset.index === jsFilter.dataset.index
        : false;
    };
    const facetsToRender = Array.from(facetDetailsElements).filter(
      (element) => !matchesIndex(element)
    );

    console.log('Facet details elements', facetDetailsElements);
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    console.log('Counts to Render', countsToRender);

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
    console.log('html from render active facets', html);
    const activeFacetElementSelectors = ['.filter-selected-element-list'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      console.log('Active facets element', activeFacetsElement);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML =
        activeFacetsElement.innerHTML;
    });

    FacetFiltersForm.toggleActiveFacets(false);
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

    // document
    //   .getElementById('FacetFiltersFormMobile')
    //   .closest('menu-drawer')
    //   .bindEvents();
  }

  static renderCounts(source, target) {
    console.log('Source and target from renderCounts', source, target);
    const targetElement = target.querySelector('.facets__selected');
    const sourceElement = source.querySelector('.facets__selected');

    console.log('Target element', targetElement);
    console.log('Source Element', sourceElement);

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

  onSubmitHandler(event) {
    console.log('Event target from handler', event.target);
    event.preventDefault();

    let formData;
    let searchParams;
    if (event?.target?.closest('form')) {
      console.log('Form from onsubmit', event.target.closest('form'));
      formData = new FormData(event.target.closest('form'));
      searchParams = new URLSearchParams(formData).toString();
    } else {
      const sectionId = document
        .querySelector('[data-section-id]')
        .getAttribute('data-section-id');

      console.log('section Id from onSubmitHandler', sectionId);
      const form = document.getElementById(`FacetFiltersForm-${sectionId}`);
      console.log('Form from onSubmit handler', form);
      formData = new FormData(form);
      searchParams = new URLSearchParams(formData).toString();
    }

    console.log('Search params', searchParams);

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

        console.log('Price ranges are', priceRanges);
        priceRanges.forEach((rangeItem) => (rangeItem.value = ''));
      }
      const form =
        this.closest('facet-filters-form') ||
        document.querySelector('facet-filters-form');
      console.log('Form from Facet Remove', form);
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
