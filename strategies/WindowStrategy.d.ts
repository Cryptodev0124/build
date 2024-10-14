/// <reference types="node" />
import { HereProviderRequest } from "../types";
import { HereStrategy } from "./HereStrategy";
export declare class WindowStrategy extends HereStrategy {
    readonly endpoint: string;
    constructor(endpoint?: string);
    signWindow: Window | null;
    unloadHandler?: () => void;
    timerHandler?: NodeJS.Timeout;
    onInitialized(): Promise<void>;
    onRequested(id: string, request: HereProviderRequest, reject: (p?: string) => void): Promise<void>;
    close(): void;
    onFailed(): Promise<void>;
    onSuccess(): Promise<void>;
}
