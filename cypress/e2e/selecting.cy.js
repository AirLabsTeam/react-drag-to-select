/// <reference types="cypress" />

describe('react-drag-to-select example', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('can select some items', () => {
    cy.get('.container')
      .trigger('mousedown', 10, 10, {
        eventConstructor: 'MouseEvent',
      })
      .trigger('mousemove', 400, 150, {        
        eventConstructor: 'MouseEvent',
      })
      .trigger('mouseup');

    for (let index = 0; index < 16; index++) {
      if (index < 3) {
        cy.get(`.element[data-testid="grid-cell-${index}"]`).should('have.class', 'selected');
      } else {
        cy.get(`.element[data-testid="grid-cell-${index}"]`).should('not.have.class', 'selected');
      }
    }
  });

  it('can select some items after scrolling', { scrollBehavior: false }, () => {
    cy.viewport(500, 200);

    cy.get('.element[data-testid="grid-cell-8"]').scrollIntoView()

    cy.get('.container', { force: true })
      .trigger('mousedown', 10, 320, {
        eventConstructor: 'MouseEvent',
        force: true
      })
      .trigger('mousemove', 320, 325, {
        eventConstructor: 'MouseEvent',
        force: true
      })
      .trigger('mouseup')

      for (let index = 0; index < 16; index++) {
        if (index > 7 && index < 11) {
          cy.get(`.element[data-testid="grid-cell-${index}"]`).should('have.class', 'selected');
        } else {
          cy.get(`.element[data-testid="grid-cell-${index}"]`).should('not.have.class', 'selected');
        }
      }
  });
});
