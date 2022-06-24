/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    visitProductPage(handle: string): void;
    getByTestId(id: string): Chainable<Element>;
    checkMonth(id: string, monthValue: string): Chainable<Element>;
    autocomplete(value: string): Chainable<Element>;
    visitFirstScreen();
    filterByColumn(column: ColDef, value: string): Chainable<Element>;
    sortingByColumn(column: ColDef): Chainable<Element>;
    authenticate(): void;
  }
}
