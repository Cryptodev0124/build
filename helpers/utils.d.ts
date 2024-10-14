import { AccessKeyInfoView } from "@near-js/types";
import { HereCall, SelectorType } from "../types";
import { HereStrategy } from "../strategies/HereStrategy";
import { Action } from "./types";
export declare const getDeviceId: () => string;
export declare const isMobile: () => boolean;
export declare const serializeActions: (actions: Action[]) => Action[];
export declare const getPublicKeys: (rpc: string, accountId: string) => Promise<Array<{
    public_key: string;
    access_key: {
        permission: string;
    };
}>>;
export declare const internalThrow: (error: unknown, strategy: HereStrategy, selector?: SelectorType | undefined) => never;
export declare const isValidAccessKey: (accountId: string, accessKey: AccessKeyInfoView, call: HereCall) => boolean;
