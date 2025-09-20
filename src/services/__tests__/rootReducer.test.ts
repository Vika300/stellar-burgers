import store, { rootReducer } from '../store';

describe('[rootReducer] test', () => {
  test('Вызов с неизвестным экшеном', () => {
    const stateBefor = store.getState();
    const stateAfter = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(stateAfter).toEqual(stateBefor);
  });
});