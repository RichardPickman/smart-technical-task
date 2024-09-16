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

    const filtered = useMemo(() => {
        const filters = Object.entries(values);

        return users.filter((user) =>
            filters.every(([key, value]) =>
                key in user ? isMatch(user[key as keyof User], value) : false,
            ),
        );
    }, [users, values]);

    return { users: filtered };
};
