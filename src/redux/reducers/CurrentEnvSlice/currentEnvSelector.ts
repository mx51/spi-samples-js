import { RootState } from '../../store';

export const currentEnvSelector = (state: RootState) => state.currentEnv.env;
