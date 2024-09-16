import { RootState } from '@/store/store';
import { User } from '@/types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * This function is used to check if a value matches a search query.
 * It utilizes the toLowerCase method to convert the values to lowercase.
 *
 * @param value - The value to check.
 * @param search - The search query.
 *
 * @returns True if the value matches the search query, false otherwise.
 */
const isMatch = (value: string | number, search: string) =>
    String(value).toLowerCase().includes(search.toLowerCase());

/**
 * This hook is used to filter the users list by the given field.
 * It utilizes the useSelector hook to access the filter values from the store.
 *
 * @param users - The users list to filter.
 *
 * @returns The filtered users list.
 */
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
