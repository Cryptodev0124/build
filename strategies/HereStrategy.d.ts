import { HereStrategyRequest, HereProviderResult, HereWalletProtocol, HereProviderRequest } from "../types";
import { createRequest, getResponse, deleteRequest, proxyApi, getRequest } from "../helpers/proxyMethods";
export { createRequest, getResponse, deleteRequest, proxyApi, getRequest };
export declare class HereStrategy {
    wallet?: HereWalletProtocol;
    connect(wallet: HereWalletProtocol): Promise<void>;
    onInitialized(): Promise<void>;
    onRequested(id: string, request: HereProviderRequest, reject: (p?: string | undefined) => void): Promise<void>;
    onApproving(result: HereProviderResult): Promise<void>;
    onSuccess(result: HereProviderResult): Promise<void>;
    onFailed(result: HereProviderResult): Promise<void>;
    request(conf: HereStrategyRequest): Promise<HereProviderResult>;
}
