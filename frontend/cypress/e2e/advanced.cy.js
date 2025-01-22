// describe('Advanced Features Tests', () => {
//     beforeEach(() => {
//       cy.login('testuser', 'password123');
//     });
  
//     it('should search tasks by name', () => {
//       cy.addTask('Task One', '10:00');
//       cy.addTask('Task Two', '12:00');
  
//       cy.get('input[placeholder="Search by task name..."]').type('Task One');
//       cy.contains('Task One').should('be.visible');
//       cy.contains('Task Two').should('not.be.visible');
//     });
  
//     it('should reset tasks', () => {
//       cy.addTask('Reset Task 1', '08:00');
//       cy.addTask('Reset Task 2', '09:00');
//       cy.get('button:contains("Delete All Tasks")').click();
//       cy.contains('Reset Task 1').should('not.exist');
//       cy.contains('Reset Task 2').should('not.exist');
//     });
  
//     it('should sort tasks by due hour', () => {
//       cy.addTask('Evening Task', '18:00');
//       cy.addTask('Morning Task', '08:00');
  
//       cy.get('button:contains("Sort by Due Hour")').click();
  
//       // Verify task order
//       cy.get('.task-item').first().contains('Morning Task');
//       cy.get('.task-item').last().contains('Evening Task');
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
