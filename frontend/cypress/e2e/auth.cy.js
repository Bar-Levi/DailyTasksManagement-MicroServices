describe('Authentication Tests', () => {
  const testUsername = 'Cypress123';
  const testPassword = 'Cypress123';

  it('should render the login form', () => {
    cy.visitLoginPage();
  });

  it('should allow user to toggle between login and register', () => {
    cy.visitLoginPage();
    cy.toggleLoginRegister();
  });

  it('should register a new account successfully', () => {
    cy.visitLoginPage();
    cy.register(testUsername, testPassword);
  });

  it('should log in with the registered account', () => {
    cy.visitLoginPage();
    cy.login(testUsername, testPassword);
  });

  it('should delete user', () => {
    cy.visitLoginPage();
    cy.login(testUsername, testPassword);
    cy.deleteUser();
  });
});
