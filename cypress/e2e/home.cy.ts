describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4321');
  });

  it('should display the main title', () => {
    cy.get('h1').should('contain', 'Cat Avatar Generator');
  });

  it('should have a generate button', () => {
    cy.get('button').contains('Generate Random Avatar').should('be.visible');
  });

  it('should show "Se connecter avec Google" when not authenticated', () => {
    cy.get('#google-signin-btn').should('be.visible').should('contain', 'Se connecter avec Google');
  });
});
