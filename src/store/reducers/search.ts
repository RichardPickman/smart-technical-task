import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types';

export interface SearchState {
    inputType: 'id' | 'name' | 'username' | 'email' | 'phone';
    query: string;
    users: User[];
}

const initialState: SearchState = {
    inputType: 'id',
    query: '',
    users: [],
} satisfies SearchState;

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchType: (state, action) => {
            state.inputType = action.payload;
        },
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
    },
});

export const { setSearchType, setQuery, setUsers } = searchSlice.actions;

export default searchSlice.reducer;
