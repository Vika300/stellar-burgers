import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface IEditorState {
  isLoading: boolean;
  error: string | null;
  buns: TIngredient | null;
  otherIngredients: TConstructorIngredient[];
}

export const initialState: IEditorState = {
  isLoading: false,
  error: null,
  buns: null,
  otherIngredients: []
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  selectors: {
    editorIsLoading: (state) => state.isLoading,
    editorError: (state) => state.error,
    editorBuns: (state) => state.buns,
    editorIngredients: (state) => state.otherIngredients
  },
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.buns = action.payload;
    },

    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.otherIngredients.push(action.payload);
    },

    removeIngredient: (state, action: PayloadAction<{ id: string }>) => {
      state.otherIngredients = state.otherIngredients.filter(
        (item) => item.id !== action.payload.id
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{
        id: string;
        direction: 'up' | 'down';
      }>
    ) => {
      const index = state.otherIngredients.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index === -1) return;

      const isUp = action.payload.direction === 'up';
      const newPosition = isUp ? index - 1 : index + 1;

      if (newPosition < 0 || newPosition >= state.otherIngredients.length)
        return;

      const [movedItem] = state.otherIngredients.splice(index, 1);
      state.otherIngredients.splice(newPosition, 0, movedItem);
    },

    resetEditor: (state) => {
      state.buns = null;
      state.otherIngredients = [];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { editorIsLoading, editorError, editorBuns, editorIngredients } =
  editorSlice.selectors;

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetEditor,
  setLoading,
  setError
} = editorSlice.actions;
