import { RootState } from '@/store/store';
import { User } from '@/types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const isMatch = (value: string | number, search: string) =>
    String(value).toLowerCase().includes(search.toLowerCase());

export const useFilteredUsers = (users: User[]) => {
    const values = useSelector(
        (state: RootState) => state.filterReducer.values,
    );

    const filtered = useMemo(
        () =>
            users.filter((user) =>
                Object.entries(user).every((tuple) => {
                    const [key, value] = tuple as [keyof User, string];

                    return isMatch(value, values[key]);
                }),
            ),
        [users, values],
    );

    return { users: filtered };
};
