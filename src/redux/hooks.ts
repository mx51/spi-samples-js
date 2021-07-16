import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// types
import { AppDispatch, RootState } from './store';

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
