
import {
  initialState,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetEditor,
  editorSlice
} from '../slices/editorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { mockIngredients } from '../__tests__/ingredientsSlice.test'

const mockBunIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMainIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  id: '1'
};

const mockSauseIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  id: '2'
};

describe('[editorSlice]: тесты', () => {
  test('[setBun]: тест добавления булочки в конструктор', () => {
    const action = setBun(mockIngredients[0]);

    expect(action.payload).toEqual(mockBunIngredient);
  });

  test('[addIngredient]: тест добавления ингредиента в конструктор', () => {
    const ingredientWithId: TConstructorIngredient = {
      ...mockIngredients[1],
      id: '1'
    };
    const action = addIngredient(ingredientWithId);

    expect(action.payload).toEqual(mockMainIngredient);
  });

  test('[removeIngredient]: тест удаления ингредиента', () => {
    const otherIngredientsState = {
      ...initialState,
      otherIngredients: [mockMainIngredient, mockSauseIngredient]
    };

    const result = editorSlice.reducer(
      otherIngredientsState,
      removeIngredient({ id: '2' })
    );

    expect(result.otherIngredients).toHaveLength(1);
    expect(result.otherIngredients[0]).toEqual({
      ...mockMainIngredient,
      id: '1'
    });
  });

  test('[moveIngredient]: изменение позиции ингредиента (вверх)', () => {
    const state = {
      ...initialState,
      otherIngredients: [mockMainIngredient, mockSauseIngredient]
    };

    const result = editorSlice.reducer(
      state,
      moveIngredient({ id: mockSauseIngredient.id, direction: 'up' })
    );

    expect(result.otherIngredients).toEqual([
      mockSauseIngredient,
      mockMainIngredient
    ]);
  });

  test('[moveIngredient]: изменение позиции ингредиента (вниз)', () => {
    const state = {
      ...initialState,
      otherIngredients: [mockMainIngredient, mockSauseIngredient]
    };

    const result = editorSlice.reducer(
      state,
      moveIngredient({ id: mockMainIngredient.id, direction: 'down' })
    );

    expect(result.otherIngredients).toEqual([
      mockSauseIngredient,
      mockMainIngredient
    ]);
  });

  test('[resetEditor]: сброс конструктора', () => {
    const state = {
      ...initialState,
      buns: mockBunIngredient,
      otherIngredients: [mockMainIngredient, mockSauseIngredient]
    };

    const result = editorSlice.reducer(state, resetEditor());

    expect(result.buns).toBeNull();
    expect(result.otherIngredients).toHaveLength(0);
  });
});