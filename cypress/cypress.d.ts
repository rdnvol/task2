/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    visitProductPage(handle: string): void;
    getByTestId(id: string): Chainable<Element>;
  }
}
