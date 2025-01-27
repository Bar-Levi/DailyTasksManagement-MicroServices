Cypress.Commands.add('visitLoginPage', () => {
  cy.visit('/');
  cy.contains('Login').should('be.visible');
});

Cypress.Commands.add('login', (username, password) => {
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.contains('Task Manager').should('be.visible');
  cy.url().should('include', '/mainPage');
});

Cypress.Commands.add('register', (username, password) => {
  cy.contains("Don't have an account? Register").click();
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[name="submit-registration"]').click();
  cy.contains('Task Manager').should('be.visible');
  cy.url().should('include', '/mainPage');
});

Cypress.Commands.add('toggleLoginRegister', () => {
  cy.contains("Don't have an account? Register").click();
  cy.contains('Register').should('be.visible');
  cy.contains('Already have an account? Login').click();
  cy.contains('Login').should('be.visible');
});

Cypress.Commands.add('deleteUser', () => {
  cy.get('button[name="delete-user-button"]', { timeout: 10000 })
    .should('be.visible')
    .click({ force: true });
  cy.contains('Login').should('be.visible');
  cy.url().should('include', '/');
});
