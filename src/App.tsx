import { SearchIcon } from 'lucide-react';
import { MouseEvent, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './components/ui/table';
import { SearchState, setQuery, setSearchType } from './store/reducers/search';
import { fetchUsers } from './store/reducers/users';
import { AppDispatch, RootState } from './store/store';

const TableHeadWithSearch = ({
    inputType,
}: {
    inputType: SearchState['inputType'];
}) => {
    const [isInputVisible, setIsMenuVisible] = useState(false);
    const { type, query } = useSelector((state: RootState) => ({
        type: state.searchReducer.inputType,
        query: state.searchReducer.query,
    }));
    const dispatch = useDispatch<AppDispatch>();

    const setFloatMenu = (event: MouseEvent<HTMLButtonElement>) => {
        const id = event.currentTarget.id as SearchState['inputType'];

        dispatch(setSearchType(id));
        setIsMenuVisible(true);
    };

    return (
        <TableHead className="spacing-2 w-fit">
            <div className="flex justify-between items-center">
                <p className="capitalize">{inputType}</p>
                {isInputVisible && type === inputType && (
                    <Input
                        className="min-w-12 max-w-48 m-2 text-center border rounded"
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => dispatch(setQuery(e.target.value))}
                        onBlur={() => setIsMenuVisible(false)}
                    />
                )}
                <Button
                    id={inputType}
                    className="w-fit h-fit"
                    onClick={setFloatMenu}
                    variant="ghost"
                >
                    <SearchIcon className="w-3 h-4" />
                </Button>
            </div>
        </TableHead>
    );
};

const App = () => {
    const { users, loading } = useSelector((state: RootState) => ({
        users: state.usersReducer.users,
        loading: state.usersReducer.loading,
    }));
    const { inputType, query } = useSelector((state: RootState) => ({
        inputType: state.searchReducer.inputType,
        query: state.searchReducer.query,
    }));
    const dispatch = useDispatch<AppDispatch>();

    useLayoutEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const filteredUsers = useMemo(() => {
        return users.filter((item) => {
            const data = item[inputType].toString().toLowerCase();

            return data.includes(query.toLowerCase());
        });
    }, [query, users, inputType]);

    return (
        <Table className="w-fit mx-auto border">
            <TableHeader>
                <TableRow className="border rounded ">
                    <TableHeadWithSearch inputType="id" />
                    <TableHeadWithSearch inputType="name" />
                    <TableHeadWithSearch inputType="username" />
                    <TableHeadWithSearch inputType="email" />
                    <TableHeadWithSearch inputType="phone" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading === 'succeeded' &&
                    filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                        </TableRow>
                    ))}
                {loading === 'pending' && (
                    <TableRow className="">
                        <td colSpan={5}>Loading...</td>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default App;
