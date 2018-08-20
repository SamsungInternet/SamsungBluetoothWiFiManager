describe('Sapper template app', () => {
	beforeEach(() => {
		cy.visit('/')
	});

	it('has the correct Step number', () => {
		cy.contains('h2', 'Step 1')
	});
});