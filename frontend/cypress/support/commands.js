// Custom command to log in
Cypress.Commands.add('login', (username, password) => {
    cy.visit('/');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/mainPage');
  });
  
  // Custom command to register a new account
Cypress.Commands.add('register', (username, password) => {
    cy.visit('/');
    cy.contains("Don't have an account? Register").click();
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.contains('success').should('be.visible');
    cy.url().should('include', '/mainPage');
  });

  
  // Custom command to add a task
  Cypress.Commands.add('addTask', (taskName, dueHour) => {
    cy.get('input[placeholder="Task Name"]').type(taskName);
    cy.get('input[type="time"]').type(dueHour);
    cy.get('button:contains("Add Task")').click();
    cy.contains(taskName).should('be.visible');
  });
  
  // Custom command to delete a task by its name
  Cypress.Commands.add('deleteTask', (taskName) => {
    cy.contains(taskName)
      .parent()
      .find('button:contains("Delete")')
      .click();
    cy.contains(taskName).should('not.exist');
  });
  
  // Custom command to toggle task completion
  Cypress.Commands.add('toggleTaskDone', (taskName) => {
    cy.contains(taskName)
      .parent()
      .find('button:contains("Complete")')
      .click();
    cy.contains(taskName).parent().should('have.class', 'bg-green-100');
  });
  