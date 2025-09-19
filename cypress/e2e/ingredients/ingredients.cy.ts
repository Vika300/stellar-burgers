describe('Конструктор', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');
      cy.intercept('GET', 'api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');
  
      cy.visit('http://localhost:4000');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });
  
    it('Добавляем ингредиенты в конструктор', () => {

      cy.get('[data-ingredient-type="bun"]')
        .first()
        .as('bunIngredient');
      cy.get('@bunIngredient')
        .next()
        .contains('button', 'Добавить')
        .click();
      cy.get('[data-ingredient-type="main"]')
        .first()
        .as('otherIngredient');
      cy.get('@otherIngredient')
        .next()
        .contains('button', 'Добавить')
        .click();
      cy.get('[data-ingredient-type="sauce"]')
        .first()
        .as('otherIngredient');
      cy.get('@otherIngredient')
        .next()
        .contains('button', 'Добавить')
        .click();

      cy.get('[data-cy="bun-top"]')
        .should('exist')
        .and('contain', 'Краторная булка N-200i');
      cy.get('[data-cy="bun-bottom"]')
        .should('exist')
        .and('contain', 'Краторная булка N-200i');
  
      cy.get('[data-cy="constructor-topping"]')
        .find('li')
        .should('have.length', 2);

    });
  
    it('Тест модального окна', () => {
      const cardItem = () => cy.get('[data-ingredient-id="643d69a5c3f7b9001cfa093c"]');

      cardItem().click();

      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
  
      cardItem().click();
      cy.get('[data-cy="modal-overlay"]').click(0, 0, { force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  
    it('Отправка заказа', () => {
      cy.fixture('order.json').then((orderResponse) => {
        cy.intercept('POST', '**/orders', {
          statusCode: 200,
          body: orderResponse,
        }).as('postOrder');
  
        window.localStorage.setItem('refreshToken', 'refresh_token');
        cy.setCookie('accessToken', 'access_token');

        cy.get('[data-ingredient-type="bun"]')
          .first()
          .next()
          .contains('button', 'Добавить')
          .click();
        cy.get('[data-ingredient-type="main"]')
          .first()
          .next()
          .contains('button', 'Добавить')
          .click();
        cy.get('[data-ingredient-type="sauce"]')
          .first()
          .next()
          .contains('button', 'Добавить')
          .click();
        cy.get('[data-cy="order-button"]').click();
        cy.get('[data-cy="modal"]').within(() => {
          cy.contains('Оформляем заказ...').should('exist');
        });
  
        cy.wait('@postOrder');
  
        cy.get('[data-cy="modal"]').within(() => {
          cy.contains('Оформляем заказ...').should('not.exist');
        });
  
        cy.get('[data-cy="modal"]').should('exist');
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