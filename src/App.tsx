import { AnimatePresence, AnimationProps, motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './components/ui/table';
import { SearchState, setQuery, setSearchType } from './store/reducers/search';
import { fetchUsers } from './store/reducers/users';
import { AppDispatch, RootState } from './store/store';

const MotionInput = motion.create(Input);

const visibleMotion: AnimationProps['animate'] = {
    opacity: 1,
    transform: 'translateY(0%)',
    position: 'relative',
};

const invisibleMotion: AnimationProps['initial'] = {
    opacity: 0,
    transform: 'translateY(100%)',
    position: 'absolute',
};

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

    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
        dispatch(setQuery(e.target.value));

    const onBlur = () => setIsMenuVisible(false);

    return (
        <TableHead className="spacing-2 w-52 overflow-hidden">
            <div className="flex justify-between items-center overflow-hidden gap-2 p-2">
                <AnimatePresence mode="sync">
                    {!isInputVisible && (
                        <motion.p
                            key={inputType + '-label'}
                            className="capitalize"
                            initial={invisibleMotion}
                            animate={!isInputVisible && visibleMotion}
                            exit={invisibleMotion}
                        >
                            {inputType}
                        </motion.p>
                    )}
                    {isInputVisible && type === inputType && (
                        <MotionInput
                            className="min-w-12 max-w-36 text-center border rounded"
                            type="text"
                            key={inputType + '-input'}
                            placeholder="Search"
                            value={query}
                            onChange={onChange}
                            onBlur={onBlur}
                            initial={invisibleMotion}
                            animate={
                                isInputVisible &&
                                type === inputType &&
                                visibleMotion
                            }
                            exit={invisibleMotion}
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
                </AnimatePresence>
            </div>
        </TableHead>
    );
};

const MotionTableRow = motion.create(TableRow);

const useFilteredUsers = () => {
    const users = useSelector((state: RootState) => state.usersReducer.users);

    const { inputType, query } = useSelector((state: RootState) => ({
        inputType: state.searchReducer.inputType,
        query: state.searchReducer.query,
    }));

    const filteredUsers = useMemo(() => {
        return users.filter((item) => {
            const data = item[inputType].toString().toLowerCase();

            return data.includes(query.toLowerCase());
        });
    }, [query, users, inputType]);

    return { filteredUsers };
};

const App = () => {
    const loading = useSelector(
        (state: RootState) => state.usersReducer.loading,
    );
    const { filteredUsers: users } = useFilteredUsers();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const refetchUsers = () => dispatch(fetchUsers());

    return (
        <Table className="w-fit mx-auto border">
            <TableCaption className="">
                <p>Refetch data</p>
                <Button onClick={refetchUsers}>Click</Button>
            </TableCaption>
            <TableHeader>
                <TableRow className="border rounded">
                    <TableHeadWithSearch inputType="id" />
                    <TableHeadWithSearch inputType="name" />
                    <TableHeadWithSearch inputType="username" />
                    <TableHeadWithSearch inputType="email" />
                    <TableHeadWithSearch inputType="phone" />
                </TableRow>
            </TableHeader>
            <TableBody className="relative">
                <AnimatePresence mode="sync">
                    {loading === 'succeeded' &&
                        users.map((user) => (
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
                        ))}
                </AnimatePresence>
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
            </TableBody>
        </Table>
    );
};

export default App;
