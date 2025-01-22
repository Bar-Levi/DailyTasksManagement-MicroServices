describe('Authentication Tests', () => {
    const testUsername = 'newuser';
    const testPassword = 'password123';
  
    it('should render the login form', () => {
      cy.visit('/');
      cy.contains('Login').should('be.visible');
    });
  
    it('should allow user to toggle between login and register', () => {
      cy.visit('/');
      cy.contains("Don't have an account? Register").click();
      cy.contains('Register').should('be.visible');
      cy.contains('Already have an account? Login').click();
      cy.contains('Login').should('be.visible');
    });
  
    it('should register a new account successfully', () => {
      cy.visit('/');
      cy.contains("Don't have an account? Register").click();
  
      cy.get('input[name="username"]').type(testUsername);
      cy.get('input[name="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
  
      // Verify successful registration
      cy.contains('success').should('be.visible');
      cy.url().should('include', '/mainPage');
    });
  
    it('should log in with the registered account', () => {
      cy.visit('/');
      cy.get('input[name="username"]').type(testUsername);
      cy.get('input[name="password"]').type(testPassword);
      cy.get('button[type="submit"]').click();
  
      // Verify successful login
      cy.url().should('include', '/mainPage');
      cy.contains(`Welcome, ${testUsername}`).should('be.visible'); // Adjust message if applicable
    });
  });
  