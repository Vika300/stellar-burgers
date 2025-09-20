describe('Конструктор', () => {
    const getModal = () => cy.get('[data-cy="modal"]');

    beforeEach(() => {
      cy.intercept('GET', 'api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');
      cy.intercept('GET', 'api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');
  
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');

      cy.get('[data-ingredient-type="bun"]')
        .first()
        .as('bunIngredient');
      cy.get('[data-ingredient-type="main"]')
        .first()
        .as('mainIngredient');
      cy.get('[data-ingredient-type="sauce"]')
        .first()
        .as('sauceIngredient');
    });
  
    it('Добавляем ингредиенты в конструктор', () => {

      cy.addIngredient('@bunIngredient')
      cy.addIngredient('@mainIngredient')
      cy.addIngredient('@sauceIngredient')

      cy.existAndContain('[data-cy="bun-top"]', 'Краторная булка N-200i')
      cy.existAndContain('[data-cy="bun-bottom"]', 'Краторная булка N-200i')
  
      cy.get('[data-cy="constructor-topping"]')
        .find('li')
        .should('have.length', 2);

    });
  
    it('Тест модального окна', () => {
      const cardItem = () => cy.get('[data-ingredient-id="643d69a5c3f7b9001cfa093c"]');

      cardItem().click();

      getModal().should('be.visible');
      getModal().contains('Краторная булка N-200i');
      cy.get('[data-cy="modal-close"]').click();
      getModal().should('not.exist');
  
      cardItem().click();
      cy.get('[data-cy="modal-overlay"]').click(0, 0, { force: true });
      getModal().should('not.exist');
    });
  
    it('Отправка заказа', () => {
      cy.fixture('order.json').then((orderResponse) => {
        cy.intercept('POST', '**/orders', {
          statusCode: 200,
          body: orderResponse,
        }).as('postOrder');
  
        window.localStorage.setItem('refreshToken', 'refresh_token');
        cy.setCookie('accessToken', 'access_token');

        cy.addIngredient('@bunIngredient')
        cy.addIngredient('@mainIngredient')
        cy.addIngredient('@sauceIngredient')
        cy.get('[data-cy="order-button"]').click();
        getModal().within(() => {
          cy.contains('Оформляем заказ...').should('exist');
        });
  
        cy.wait('@postOrder');
  
        getModal().within(() => {
          cy.contains('Оформляем заказ...').should('not.exist');
        });
  
        getModal().should('exist');
        cy.get('[data-cy="order-number"]').should(
          'contain.text',
          orderResponse.order.number
        );

        cy.get('[data-cy="modal-close"]').click();

        cy.get('[data-cy="bun-top"]').should('not.exist');
        cy.get('[data-cy="bun-bottom"]').should('not.exist');
        cy.get('[data-cy="constructor-topping"]').find('li').should('not.exist');

        cy.clearCookies();
        cy.clearLocalStorage();
      });
    });
  });