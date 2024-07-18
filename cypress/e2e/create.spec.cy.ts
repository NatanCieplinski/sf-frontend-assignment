describe('Quote creation', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should create a quote', () => {
    cy.get('textarea[name="content"]').type('Testquote')
    cy.get('input[name="author"]').type('Testauthor')
    cy.get('button[type="submit"]').click()
    cy.get('input[data-testid="search-filter"]').type('Testquote')
    cy.get('p[data-testid="quote-content"]').should('be.visible')
    cy.get('p[data-testid="quote-content"]').should('contain', 'Testquote')
    cy.get('p[data-testid="quote-author"]').should('be.visible')
    cy.get('p[data-testid="quote-author"]').should('contain', 'Testauthor')
  })
})
