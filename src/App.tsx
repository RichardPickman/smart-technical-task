import { AnimatePresence, motion } from 'framer-motion';
import { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Input } from './components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './components/ui/table';
import { useFilteredUsers } from './hooks/useFilteredUsers';
import { cn } from './lib/utils';
import { TableKey, setValue } from './store/reducers/filters';
import { fetchUsers } from './store/reducers/users';
import { AppDispatch, RootState } from './store/store';
import { User } from './types';

const TableHeadWithSearch = ({ field }: { field: TableKey }) => {
    const values = useSelector(
        (state: RootState) => state.filterReducer.values,
    );
    const query = values[field];
    const dispatch = useDispatch<AppDispatch>();

    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        dispatch(setValue({ key: field, value: e.target.value }));

    return (
        <TableHead className="m-0 p-0 divide-x-2">
            <Input
                className={cn(
                    'w-full h-full m-0 rounded-none border-none',
                    query ? 'bg-slate-200' : 'bg-background',
                )}
                type="text"
                key={field + '-input'}
                placeholder={field}
                onChange={onChange}
            />
        </TableHead>
    );
};

const MotionTableRow = motion.create(TableRow);

const UserRow = ({ user }: { user: User }) => (
    <MotionTableRow
        key={user.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <TableCell>{user.id}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.phone}</TableCell>
    </MotionTableRow>
);

const App = () => {
    const users = useSelector((state: RootState) => state.usersReducer.users);
    const loading = useSelector(
        (state: RootState) => state.usersReducer.loading,
    );
    const { users: filtered } = useFilteredUsers(users);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <Table className="w-fit mx-auto border">
            <TableHeader>
                <TableRow className="border rounded">
                    <TableHeadWithSearch field="id" />
                    <TableHeadWithSearch field="name" />
                    <TableHeadWithSearch field="username" />
                    <TableHeadWithSearch field="email" />
                    <TableHeadWithSearch field="phone" />
                </TableRow>
            </TableHeader>
            <TableBody className="relative">
                <AnimatePresence mode="sync">
                    {loading === 'succeeded' &&
                        filtered.map((user) => (
                            <UserRow key={user.id} user={user} />
                        ))}

                    {loading === 'pending' && (
                        <TableRow className="">
                            <TableCell>Loading...</TableCell>
                            <TableCell>Loading...</TableCell>
                            <TableCell>Loading...</TableCell>
                            <TableCell>Loading...</TableCell>
                            <TableCell>Loading...</TableCell>
                        </TableRow>
                    )}

                    {loading === 'failed' && (
                        <TableRow className="">
                            <TableCell colSpan={5}>Fetch failed.</TableCell>
                        </TableRow>
                    )}
                </AnimatePresence>
            </TableBody>
        </Table>
    );
};

export default App;
