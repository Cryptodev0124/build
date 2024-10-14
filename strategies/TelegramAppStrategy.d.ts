import { HereStrategyRequest, HereWalletProtocol } from "../types";
import { HereStrategy } from "./HereStrategy";
export declare class TelegramAppStrategy extends HereStrategy {
    appId: string;
    walletId: string;
    constructor(appId?: string, walletId?: string);
    connect(wallet: HereWalletProtocol): Promise<void>;
    request(conf: HereStrategyRequest): Promise<any>;
    onRequested(id: string): Promise<void>;
}
