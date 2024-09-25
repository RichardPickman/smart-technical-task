import { User } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

export type TableKey = keyof User;

export interface FilterState {
    values: {
        [k in TableKey]: string;
    };
}

const initialState: FilterState = {
    values: {
        id: '',
        name: '',
        username: '',
        email: '',
        phone: '',
    },
} satisfies FilterState;

/**
 * This slice is used to manage the state of the filters.
 * It includes the filter values and setValue thunk.
 */

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setValue: (
            state,
            action: { payload: { key: TableKey; value: string } },
        ) => {
            state.values[action.payload.key] = action.payload.value;
        },
    },
});

export const { setValue } = filterSlice.actions;

export default filterSlice.reducer;
