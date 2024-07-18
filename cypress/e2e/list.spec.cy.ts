describe('List', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should show list of quotes', () => {
    cy.get('p[data-testid="quote-content"]').should('be.visible')
    cy.get('p[data-testid="quote-content"]').should(
      'contain',
      'The best and most beautiful things in the world cannot be seen or even touched – they must be felt with the heart.'
    )
    cy.get('p[data-testid="quote-author"]').should('be.visible')
    cy.get('p[data-testid="quote-author"]').should('contain', 'Helen Keller')
  })

  it('should filter quotes by author or contnet', () => {
    cy.get('input[data-testid="search-filter"]').type('angelou')
    cy.get('p[data-testid="quote-author"]').should('be.visible')
    cy.get('p[data-testid="quote-author"]').should('contain', 'Angelou')
  })
})
