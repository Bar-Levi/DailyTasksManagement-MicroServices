// describe('Task Management Tests', () => {
//     beforeEach(() => {
//       cy.login('testuser', 'password123'); // Ensure the user is logged in before each test
//     });
  
//     it('should add a task successfully', () => {
//       cy.addTask('Buy groceries', '12:00');
//     });
  
//     it('should toggle task completion', () => {
//       cy.addTask('Complete Cypress Tests', '14:00');
//       cy.toggleTaskDone('Complete Cypress Tests');
//     });
  
//     it('should edit a task', () => {
//       cy.addTask('Edit this task', '10:00');
//       cy.contains('Edit this task')
//         .parent()
//         .find('button:contains("✏️ Edit")')
//         .click();
  
//       cy.get('input[placeholder="Task Name"]').clear().type('Edited Task Name');
//       cy.get('button:contains("Save")').click();
//       cy.contains('Edited Task Name').should('be.visible');
//     });
  
//     it('should delete a task', () => {
//       cy.addTask('Task to delete', '09:00');
//       cy.deleteTask('Task to delete');
//     });
  
//     it('should show empty state when no tasks are present', () => {
//       cy.get('p:contains("No tasks found. Add your first task!")').should('be.visible');
//     });
//   });

describe('Dummy Test', () => {
    it('should visit the base URL and confirm Cypress is working', () => {
      cy.visit('/');
      cy.title().should('exist'); // Check that the page has a title
      cy.log('Cypress is set up correctly! 🎉');
    });
  
    it('should perform a basic assertion', () => {
      const sum = 2 + 2;
      expect(sum).to.equal(4); // Basic math assertion
      cy.log('Basic assertion works! ✅');
    });
  });
  
  