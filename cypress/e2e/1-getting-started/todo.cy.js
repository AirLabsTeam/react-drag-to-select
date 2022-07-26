/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('example to-do app', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('/');
  });

  it('can select some items', () => {
    cy.get('.container')
      .trigger('mousedown', 10, 10, {
        eventConstructor: 'MouseEvent',
        button: 0,
      })
      .trigger('mousemove', 400, 150, {
        eventConstructor: 'MouseEvent',
        button: 1,
      })
      .trigger('mouseup', 400, 150, {
        eventConstructor: 'MouseEvent',
        button: 1,
      });

    for (let index = 0; index < 16; index++) {
      if (index < 3) {
        cy.get(`.element[data-testid="grid-cell-${index}"]`).should('have.class', 'selected');
      } else {
        cy.get(`.element[data-testid="grid-cell-${index}"]`).should('not.have.class', 'selected');
      }
    }
  });

  it('can select some items after scrolling', { scrollBehavior: false }, () => {
    cy.viewport(500, 120);

    cy.get('.element[data-testid="grid-cell-8"]').scrollIntoView()

    cy.get('.container', { force: true })
      .trigger('mousedown', 10, 320, {
        eventConstructor: 'MouseEvent',
        button: 0,
        force: true
      })
      .trigger('mousemove', 320, 320, {
        eventConstructor: 'MouseEvent',
        button: 1,
        force: true
      })
      .trigger('mouseup', 320, 320, {
        eventConstructor: 'MouseEvent',
        button: 1,
        force: true
      })

      for (let index = 0; index < 16; index++) {
        if (index > 7 && index < 11) {
          cy.get(`.element[data-testid="grid-cell-${index}"]`).should('have.class', 'selected');
        } else {
          cy.get(`.element[data-testid="grid-cell-${index}"]`).should('not.have.class', 'selected');
        }
      }
  });
});
