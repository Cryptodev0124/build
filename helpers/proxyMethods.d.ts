import { HereProviderRequest, HereProviderResult } from "../types";
export declare const proxyApi = "https://h4n.app";
export declare const getRequest: (id: string, signal?: AbortSignal | undefined) => Promise<HereProviderRequest>;
export declare const getResponse: (id: string) => Promise<HereProviderResult>;
export declare const deleteRequest: (id: string) => Promise<void>;
export declare const computeRequestId: (request: HereProviderRequest) => Promise<{
    requestId: string;
    query: string;
}>;
export declare const createRequest: (request: HereProviderRequest, signal?: AbortSignal | undefined) => Promise<string>;
