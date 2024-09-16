import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './reducers/filters';
import usersReducer from './reducers/users';

/**
 * This is the main store for the application.
 * It includes the users and filters reducers.
 */

export const store = configureStore({
    reducer: {
        usersReducer,
        filterReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
