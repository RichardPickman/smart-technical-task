import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UsersState {
    users: User[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

export const fetchUsers = createAsyncThunk<User[]>(
    'users/fetchUsers',
    async (_, thunkApi) => {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/users',
        );

        if (!response.ok) {
            return thunkApi.rejectWithValue(response.statusText);
        }

        const users = (await response.json()) as User[];

        return users.map((user, index) => ({
            id: String(index + 1),
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
        }));
    },
);

const initialState: UsersState = {
    users: [],
    loading: 'idle',
} satisfies UsersState;

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload;
            state.loading = 'succeeded';
        });
        builder.addCase(fetchUsers.rejected, (state) => {
            state.users = [];
            state.loading = 'failed';
        });
        builder.addCase(fetchUsers.pending, (state) => {
            state.users = [];
            state.loading = 'pending';
        });
    },
});

export default usersSlice.reducer;
