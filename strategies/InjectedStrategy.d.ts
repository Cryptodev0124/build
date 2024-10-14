import { HereProviderResult, HereStrategyRequest, HereWalletProtocol } from "../types";
import { HereStrategy } from "./HereStrategy";
export declare class InjectedStrategy extends HereStrategy {
    connect(wallet: HereWalletProtocol): Promise<void>;
    request(conf: HereStrategyRequest): Promise<HereProviderResult>;
}
