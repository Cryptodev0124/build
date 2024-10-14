/// <reference types="node" />
import { Action } from "./types";
export declare const parseArgs: (data: Object | string) => Object | Buffer;
export declare const createAction: (action: Action) => import("@near-js/transactions").Action;
