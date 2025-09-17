import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  registerUserApi,
  loginUserApi,
  TRegisterData,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  logoutApi,
  TAuthResponse,
  TUserResponse,
  TLoginData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response: TAuthResponse = await loginUserApi(loginData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getUserData = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response: TUserResponse = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData, { rejectWithValue }) => {
    try {
      const response: TAuthResponse = await registerUserApi(registerData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      await forgotPasswordApi({ email });
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      await resetPasswordApi(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUserData = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response: TUserResponse = await updateUserApi(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export interface UserState {
  isAuthChecked: boolean;
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | null;
}

export const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: null,
  isAuthChecked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    getUser: (state) => state.user,
    userIsLoading: (state) => state.isLoading,
    userError: (state) => state.error,
    isAuthChecked: (state) => state.isAuthChecked
  },
  reducers: {
    init: (state) => {
      state.isInit = true;
    },
    setAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInit = true;
        state.isAuthChecked = true;
      });

    builder
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка получения пользователя';
        state.isInit = true;
        state.isAuthChecked = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInit = true;
        state.isAuthChecked = true;
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка регистрации';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInit = true;
        state.user = action.payload;
        state.error = null;
      });

    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка восстановления пароля';
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка сброса пароля';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || 'Ошибка обновления пользователя';
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка выхода';
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isInit = false;
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const { getUser, userIsLoading, userError, isAuthChecked } =
  userSlice.selectors;
export const { init, setAuthChecked } = userSlice.actions;
