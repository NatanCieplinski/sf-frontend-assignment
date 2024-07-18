/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

Cypress.Commands.add('login', () => {
  cy.visit('http://localhost:3000/login')
  cy.get('input[name="email"]').type('test@test.com')
  cy.get('input[name="password"]').type('password')
  cy.get('button[type="submit"]').click()
  cy.wait(2000)
})

Cypress.Commands.add('getToast', () => {
  return cy.get('[data-sonner-toast]')
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>
      getToast(): Chainable<JQuery<HTMLElement>>
    }
  }
}

export {}
