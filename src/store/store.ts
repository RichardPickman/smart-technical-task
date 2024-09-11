import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './reducers/search';
import usersReducer from './reducers/users';

export const store = configureStore({
    reducer: {
        usersReducer,
        searchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
