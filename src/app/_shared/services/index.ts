import {Auth} from "./auth";
import {ChangeTitle} from "./change-title";
export * from './auth';
export * from './change-title';

export const SHARED_SERVICES = [Auth, ChangeTitle];
