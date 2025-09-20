import {
  loginUser,
  getUserData,
  registerUser,
  forgotPassword,
  resetPassword,
  updateUserData,
  logoutUser,
  initialState,
  userSlice
} from '../slices/userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@example.ru',
  name: 'test_user_name'
};

const mockRegisterData = {
  email: 'test@example.ru',
  password: 'password',
  name: 'test_user_name'
};

const mockUpdatedUser = {
  email: 'new_test@example.ru',
  password: 'new_password',
  name: 'new_test_user_name'
};

const reducer = userSlice.reducer;

describe('[userSlice] Тесты редьюсера', () => {
  describe('[loginUser]: авторизация пользователя', () => {
    test('loginUser.pending', () => {
      const state = reducer(
        initialState,
        loginUser.pending('', mockRegisterData)
      );

      expect(state.isLoading).toBe(true);
    });

    test('loginUser.fulfilled', () => {
      const state = reducer(
        initialState,
        loginUser.fulfilled(mockUser, '', mockRegisterData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    test('loginUser.rejected', () => {
      const state = reducer(
        initialState,
        loginUser.rejected(null, '', mockRegisterData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка входа');
    });
  });

  describe('[registerUser]: регистрация пользователя', () => {
    test('registerUser.pending', () => {
      const state = reducer(
        initialState,
        registerUser.pending('', mockRegisterData)
      );

      expect(state.isLoading).toBe(true);
    });

    test('registerUser.fulfilled', () => {
      const state = reducer(
        initialState,
        registerUser.fulfilled(mockUser, '', mockRegisterData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });

    test('registerUser.rejected', () => {
      const state = reducer(
        initialState,
        registerUser.rejected(null, '', mockRegisterData)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
    });
  });

  describe('[getUserData]: получение данных пользователя', () => {
    test('getUserData.pending', () => {
      const state = reducer(initialState, getUserData.pending('', undefined));

      expect(state.isLoading).toBe(true);
    });

    test('getUserData.fulfilled', () => {
      const state = reducer(
        initialState,
        getUserData.fulfilled(mockUser, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.isInit).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    test('getUserData.rejected', () => {
      const state = reducer(
        initialState,
        getUserData.rejected(null, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.isInit).toBe(true);
      expect(state.error).toBe('Ошибка получения пользователя');
    });
  });

  describe('[updateUserData]: обновление данных пользователя', () => {
    test('updateUserData.pending', () => {
      const state = reducer(
        initialState,
        updateUserData.pending('', mockRegisterData)
      );

      expect(state.isLoading).toBe(true);
    });

    test('updateUserData.fulfilled', () => {
      const state = reducer(
        initialState,
        updateUserData.fulfilled(mockUpdatedUser, '', mockUpdatedUser)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUpdatedUser);
    });

    test('updateUserData.rejected', () => {
      const state = reducer(
        initialState,
        updateUserData.rejected(null, '', mockUpdatedUser)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка обновления пользователя');
    });
  });

  describe('[logoutUser] выход пользователя', () => {
    test('logoutUser.pending', () => {
      const state = reducer(
        initialState,
        logoutUser.pending('', undefined)
      );

      expect(state.isLoading).toBe(true);
    });

    test('logoutUser.fulfilled', () => {
      const state = reducer(
        {
          ...initialState,
          user: mockUser,
          isInit: true
        },
        logoutUser.fulfilled(undefined, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isInit).toBe(false);
    });

    test('logoutUser.rejected', () => {
      const state = reducer(
        initialState,
        logoutUser.rejected(null, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка выхода');
    });
  });

  describe('[forgotPassword] восстановление забытого пароля', () => {
    test('forgotPassword.pending', () => {
      const state = reducer(
        initialState,
        forgotPassword.pending('', {
          email: 'test@example.ru'
        })
      );

      expect(state.isLoading).toBe(true);
    });

    test('forgotPassword.fulfilled', () => {
      const state = reducer(
        initialState,
        forgotPassword.fulfilled(undefined, '', {
          email: 'test@example.ru'
        })
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
    });

    test('forgotPassword.rejected', () => {
      const state = reducer(
        initialState,
        forgotPassword.rejected(null, '', {
          email: 'test@example.ru'
        })
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка восстановления пароля');
    });
  });

  describe('[resetPassword]: сброс пароля пользователя', () => {
    test('resetPassword.pending', () => {
      const state = reducer(
        initialState,
        resetPassword.pending('', {
          password: 'new_password',
          token: 'access_token'
        })
      );

      expect(state.isLoading).toBe(true);
    });

    test('resetPassword.fulfilled', () => {
      const state = reducer(
        initialState,
        resetPassword.fulfilled(undefined, '', {
          password: 'new_password',
          token: 'access_token'
        })
      );

      expect(state.isLoading).toBe(false);
    });

    test('resetPassword.rejected', () => {
      const state = reducer(
        initialState,
        resetPassword.rejected(null, '', {
          password: 'new_password',
          token: 'access_token'
        })
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка сброса пароля');
    });
  });
});
