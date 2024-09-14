import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './reducers/filters';
import usersReducer from './reducers/users';

export const store = configureStore({
    reducer: {
        usersReducer,
        filterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
