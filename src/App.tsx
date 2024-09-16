import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ChangeEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
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

const InputWithSearch = ({ field }: { field: TableKey }) => {
    const values = useSelector(
        (state: RootState) => state.filterReducer.values,
    );
    const query = values[field];
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch<AppDispatch>();

    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        dispatch(setValue({ key: field, value: e.target.value }));

    const clearInput = () => {
        dispatch(setValue({ key: field, value: '' }));

        inputRef.current?.focus();
    };

    return (
        <TableHead>
            <div className="relative flex flex-col gap-2 my-2">
                <Label className="capitalize">{field}:</Label>
                <div className="relative">
                    <Input
                        key={field + '-input'}
                        ref={inputRef}
                        className={cn(query ? 'bg-slate-100' : 'bg-background')}
                        value={query}
                        onChange={onChange}
                    />
                    <Button
                        variant="ghost"
                        onClick={clearInput}
                        className={cn(
                            'absolute w-fit h-fit p-1 right-2 top-1/2 -translate-y-1/2',
                            !query ? 'invisible' : 'block',
                        )}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </TableHead>
    );
};

const MotionTableRow = motion.create(TableRow);

const UserRow = ({ user }: { user: User }) => (
    <MotionTableRow
        key={user.id}
        className="text-center"
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
        <Table className="w-fit mx-auto border rounded">
            <TableHeader className="h-full">
                <TableRow>
                    <InputWithSearch field="id" />
                    <InputWithSearch field="name" />
                    <InputWithSearch field="username" />
                    <InputWithSearch field="email" />
                    <InputWithSearch field="phone" />
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
