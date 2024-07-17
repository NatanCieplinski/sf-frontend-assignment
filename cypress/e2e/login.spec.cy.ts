describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  it('should redirect to home page on correct credentials', () => {
    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.get('h1').should('contain', 'My Quotes')
  })

  it('should show error toast on incorrect credentials', () => {
    cy.get('input[name="email"]').type('wrong@test.com')
    cy.get('input[name="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.getToast().should('contain.text', 'Error logging in')
  })
})
